// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/OnClick.sol";
import "../src/MockUSDC.sol";

contract DeploySepoliaScript is Script {
    function run() external {
        vm.startBroadcast();
        
        // 1. Deploy Mock USDC
        MockUSDC usdc = new MockUSDC();
        console.log("Mock USDC deployed at:", address(usdc));
        
        // 2. Deploy OnClick with Mock USDC
        OnClick onclick = new OnClick(
            address(usdc),  // Mock USDC address
            100,            // 1% platform fee
            msg.sender      // Fee recipient
        );
        console.log("OnClick deployed at:", address(onclick));
        
        vm.stopBroadcast();
        
        // Print summary
        console.log("");
        console.log("==============================================");
        console.log("Deployment Summary:");
        console.log("==============================================");
        console.log("Mock USDC:", address(usdc));
        console.log("OnClick:  ", address(onclick));
        console.log("==============================================");
    }
}


