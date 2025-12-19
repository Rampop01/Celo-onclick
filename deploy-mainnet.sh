#!/bin/bash

# Celo Mainnet Deployment Script
# Make executable: chmod +x deploy-mainnet.sh
# Run: ./deploy-mainnet.sh

set -e  # Exit on error

echo "🚀 Deploying to Celo Mainnet..."
echo ""

# Check if private key is set
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY environment variable not set"
    echo "Run: export PRIVATE_KEY=your_private_key_here"
    exit 1
fi

RPC_URL="https://rpc.ankr.com/celo"
CHAIN_ID="42220"

echo "📋 Network Info:"
echo "   RPC: $RPC_URL"
echo "   Chain ID: $CHAIN_ID"
echo "   Explorer: https://celoscan.io"
echo ""

# Verify deployment
read -p "⚠️  Are you sure you want to deploy to Celo Mainnet? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "🚫 Deployment cancelled"
    exit 1
fi

echo "🚀 Deploying contracts..."
echo "   (This may take a few minutes and cost CELO for gas)"
echo ""

# Deploy using forge script
forge script script/DeployMainnet.s.sol:DeployMainnetScript \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --legacy \
  -vvv

# Extract addresses from broadcast file
BROADCAST_FILE="broadcast/DeployMainnet.s.sol/$CHAIN_ID/run-latest.json"

if [ -f "$BROADCAST_FILE" ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    
    # Parse addresses (this is a simple approach)
    echo "📝 Contract Addresses:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Extract contract addresses from the broadcast file
    OLD_IFS=$IFS
    IFS=$'\n'
    
    # Find all contract deployments
    DEPLOYMENTS=$(jq -r '.transactions[] | select(.transactionType == "CREATE" or .transactionType == "CREATE2") | {contractName, contractAddress} | "\(.contractName): \\(.contractAddress)"' $BROADCAST_FILE 2>/dev/null || true)
    
    if [ -z "$DEPLOYMENTS" ]; then
        echo "No contract deployments found in the broadcast file."
        echo "Check the transaction hashes below for details."
    else
        echo "$DEPLOYMENTS"
    fi
    
    IFS=$OLD_IFS
    
    # Get transaction hashes
    echo ""
    echo "🔗 Transaction Hashes:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    jq -r '.transactions[] | "\(.transactionType) \(.contractName): \(.hash)"' $BROADCAST_FILE 2>/dev/null || echo "Could not extract transaction hashes"
    
    echo ""
    echo "🔍 View on CeloScan:"
    echo "   https://celoscan.io/tx/$(jq -r '.transactions[0].hash' $BROADCAST_FILE 2>/dev/null || echo "")"
    
    echo ""
    echo "💡 Next Steps:"
    echo "   1. Verify your contracts on CeloScan"
    echo "   2. Update the DEPLOYED_ADDRESSES.md with the new addresses"
    echo "   3. Consider transferring ownership to a multisig wallet"
    echo ""
else
    echo ""
    echo "❌ Deployment may have failed. Check the transaction hashes above for details."
    echo ""
    exit 1
fi
