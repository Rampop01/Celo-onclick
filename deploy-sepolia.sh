#!/bin/bash

# Celo Sepolia Deployment Script
# Make executable: chmod +x deploy-sepolia.sh
# Run: ./deploy-sepolia.sh

set -e  # Exit on error

echo "🚀 Deploying to Celo Sepolia Testnet..."
echo ""

# Check if private key is set
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY environment variable not set"
    echo "Run: export PRIVATE_KEY=your_private_key_here"
    exit 1
fi

RPC_URL="https://rpc.ankr.com/celo_sepolia"
CHAIN_ID="84532"

echo "📋 Network Info:"
echo "   RPC: $RPC_URL"
echo "   Chain ID: $CHAIN_ID"
echo "   Explorer: https://sepolia.celoscan.io"
echo ""

echo "🚀 Deploying contracts..."
echo "   (This may take 1-2 minutes...)"
echo ""

# Deploy using forge script
forge script script/DeploySepolia.s.sol:DeploySepoliaScript \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --legacy \
  -vvv

# Extract addresses from broadcast file
BROADCAST_FILE="broadcast/DeploySepolia.s.sol/$CHAIN_ID/run-latest.json"

if [ -f "$BROADCAST_FILE" ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    
    # Parse addresses (this is a simple approach)
    echo "📝 Contract Addresses:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Check the output above for the deployed addresses:"
    echo "   - Mock USDC"
    echo "   - OnClick"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🔗 View on Explorer:"
    echo "   https://sepolia.celoscan.io"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. Copy the addresses from the output above"
    echo "   2. Update onclick/lib/contract.ts with these addresses"
    echo "   3. Mint USDC to your wallet for testing"
    echo "   4. Start testing your app!"
    echo ""
else
    echo "⚠️  Deployment completed but broadcast file not found"
    echo "   Check the output above for contract addresses"
fi
