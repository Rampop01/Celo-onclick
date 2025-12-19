// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/OnClick.sol";
import "../src/MockUSDC.sol";

contract DeployMainnetScript is Script {
    // Mainnet USDC address (6 decimals)
    address public constant MAINNET_USDC = 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359;
    
    function run() external {
        // Load deployer's private key from environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying contracts with the account:", deployer);
        console.log("Account balance:", deployer.balance / 1e18, "ETH");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy OnClick with mainnet USDC
        OnClick onclick = new OnClick(
            MAINNET_USDC,  // Mainnet USDC address
            100,          // 1% platform fee (1% = 100 bps)
            deployer      // Fee recipient (can be updated later to a multisig)
        );
        
        vm.stopBroadcast();
        
        // Print summary
        console.log("\n==============================================");
        console.log("Mainnet Deployment Summary:");
        console.log("==============================================");
        console.log("OnClick Contract:", address(onclick));
        console.log("USDC Address:   ", MAINNET_USDC);
        console.log("Fee Recipient:  ", deployer);
        console.log("Platform Fee:   1%");
        console.log("==============================================\n");
        
        console.log("✅ Deployment completed!");
    }
}
