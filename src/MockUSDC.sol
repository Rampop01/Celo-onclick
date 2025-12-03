// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockUSDC
 * @notice Mock USDC token for testing on Celo Sepolia testnet
 * @dev Anyone can mint tokens for testing purposes
 */
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        // Mint 1 million USDC to deployer
        _mint(msg.sender, 1_000_000 * 10**6);
    }
    
    /// @notice USDC uses 6 decimals
    function decimals() public pure override returns (uint8) {
        return 6;
    }
    
    /// @notice Public mint function for testing (anyone can mint)
    /// @param to Address to mint tokens to
    /// @param amount Amount to mint (in smallest unit, 1 USDC = 1_000_000)
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

