// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script, console} from "forge-std/Script.sol";
import {OnClick} from "../src/OnClick.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Get deployment parameters from environment
        address usdcToken = vm.envAddress("USDC_ADDRESS");
        uint256 platformFeeBps = vm.envOr("PLATFORM_FEE_BPS", uint256(100)); // Default 1%
        address feeRecipient = vm.envAddress("FEE_RECIPIENT");

        vm.startBroadcast(deployerPrivateKey);

        OnClick onClick = new OnClick(
            usdcToken,
            platformFeeBps,
            feeRecipient
        );

        vm.stopBroadcast();

        console.log("OnClick deployed at:", address(onClick));
        console.log("USDC Token:", usdcToken);
        console.log("Platform Fee:", platformFeeBps, "bps");
        console.log("Fee Recipient:", feeRecipient);
    }
}

