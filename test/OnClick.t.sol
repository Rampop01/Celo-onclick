// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Test} from "forge-std/Test.sol";
import {OnClick} from "../src/OnClick.sol";

// Simple ERC20 mock for testing
contract MockERC20 {
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    uint8 public decimals = 6;
    string public name = "Mock USDC";
    string public symbol = "USDC";
    
    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
    }
    
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}

contract OnClickTest is Test {
    OnClick public onClick;
    MockERC20 public usdc;
    
    address public owner = address(1);
    address public feeRecipient = address(2);
    address public creator = address(3);
    address public supporter = address(4);
    
    uint256 public constant PLATFORM_FEE_BPS = 100; // 1%
    
    function setUp() public {
        // Deploy mock USDC
        usdc = new MockERC20();
        
        // Deploy OnClick contract
        vm.prank(owner);
        onClick = new OnClick(
            address(usdc),
            PLATFORM_FEE_BPS,
            feeRecipient
        );
        
        // Mint USDC to supporter
        usdc.mint(supporter, 10000e6); // 10,000 USDC (6 decimals)
    }
    
    function testCreatePage() public {
        vm.prank(creator);
        onClick.createPage(
            "testhandle",
            OnClick.Role.Creator,
            creator,
            5000e6, // 5000 USDC goal
            0 // No deadline
        );
        
        OnClick.Page memory page = onClick.getPage("testhandle");
        assertEq(page.owner, creator);
        assertEq(page.handle, "testhandle");
        assertEq(uint256(page.role), uint256(OnClick.Role.Creator));
        assertEq(page.goal, 5000e6);
        assertTrue(page.exists);
    }
    
    function testHandleAvailability() public {
        assertTrue(onClick.isHandleAvailable("newhandle"));
        
        vm.prank(creator);
        onClick.createPage("newhandle", OnClick.Role.Creator, creator, 0, 0);
        
        assertFalse(onClick.isHandleAvailable("newhandle"));
    }
    
    function testMakePayment() public {
        // Create page
        vm.prank(creator);
        onClick.createPage("test", OnClick.Role.Creator, creator, 10000e6, 0);
        
        // Make payment
        uint256 amount = 1000e6; // 1000 USDC
        vm.startPrank(supporter);
        usdc.approve(address(onClick), amount);
        onClick.makePayment("test", amount, "Great work!");
        vm.stopPrank();
        
        // Check page stats
        OnClick.Page memory page = onClick.getPage("test");
        assertEq(page.totalRaised, amount);
        assertEq(page.supporterCount, 1);
        
        // Check fee was deducted
        uint256 expectedFee = (amount * PLATFORM_FEE_BPS) / 10000;
        assertEq(usdc.balanceOf(feeRecipient), expectedFee);
        assertEq(usdc.balanceOf(creator), amount - expectedFee);
    }
    
    function testMultiplePayments() public {
        vm.prank(creator);
        onClick.createPage("test", OnClick.Role.Creator, creator, 0, 0);
        
        uint256 amount = 500e6;
        vm.startPrank(supporter);
        usdc.approve(address(onClick), amount * 2);
        
        onClick.makePayment("test", amount, "First payment");
        onClick.makePayment("test", amount, "Second payment");
        vm.stopPrank();
        
        OnClick.Page memory page = onClick.getPage("test");
        assertEq(page.totalRaised, amount * 2);
        assertEq(page.supporterCount, 1); // Same supporter
        assertEq(onClick.getPaymentCount("test"), 2);
    }
    
    function testGoalProgress() public {
        vm.prank(creator);
        onClick.createPage("test", OnClick.Role.Creator, creator, 10000e6, 0);
        
        uint256 amount = 3000e6;
        vm.startPrank(supporter);
        usdc.approve(address(onClick), amount);
        onClick.makePayment("test", amount, "");
        vm.stopPrank();
        
        uint256 progress = onClick.getPageProgress("test");
        assertEq(progress, 3000); // 30% = 3000 basis points
    }
    
    function testUpdatePage() public {
        vm.prank(creator);
        onClick.createPage("test", OnClick.Role.Creator, creator, 5000e6, 0);
        
        address newWallet = address(5);
        vm.prank(creator);
        onClick.updatePage("test", newWallet, 10000e6, 0);
        
        OnClick.Page memory page = onClick.getPage("test");
        assertEq(page.walletAddress, newWallet);
        assertEq(page.goal, 10000e6);
    }
    
    function testDeadline() public {
        uint256 deadline = block.timestamp + 30 days;
        
        vm.prank(creator);
        onClick.createPage("test", OnClick.Role.Crowdfunder, creator, 10000e6, deadline);
        
        assertFalse(onClick.isDeadlinePassed("test"));
        
        // Fast forward past deadline
        vm.warp(deadline + 1);
        assertTrue(onClick.isDeadlinePassed("test"));
    }
    
    function testRevertIfHandleTaken() public {
        vm.prank(creator);
        onClick.createPage("test", OnClick.Role.Creator, creator, 0, 0);
        
        vm.prank(address(5));
        vm.expectRevert("Handle already taken");
        onClick.createPage("test", OnClick.Role.Creator, address(5), 0, 0);
    }
    
    function testRevertIfNotOwner() public {
        vm.prank(creator);
        onClick.createPage("test", OnClick.Role.Creator, creator, 0, 0);
        
        vm.prank(supporter);
        vm.expectRevert("Not page owner");
        onClick.updatePage("test", supporter, 0, 0);
    }
}

