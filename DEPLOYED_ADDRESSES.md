# 📝 Deployed Contract Addresses

## Celo Sepolia Testnet

### Deployment Date
November 20, 2024

### Contract Addresses

| Contract | Address | Explorer Link |
|----------|---------|--------------|
| **Mock USDC** | `0xd9fc6cC979472A5FA52750ae26805462E1638872` | [View on Explorer](https://sepolia.celoscan.io/address/0xd9fc6cC979472A5FA52750ae26805462E1638872) |
| **OnClick** | `0x274f499201b0716e6CB632FF5BEc10cAD508eAD6` | [View on Explorer](https://sepolia.celoscan.io/address/0x274f499201b0716e6CB632FF5BEc10cAD508eAD6) |

### Deployment Transactions

| Contract | Transaction Hash | Block |
|----------|-----------------|-------|
| **Mock USDC** | `0xe1a1de03ff74c48ce3fcaa16a00a51f382198eeb994313a355212c9ede0dd663c3e` | 10375970 |
| **OnClick** | `0xe847d6c711bbda987fb2f64558e3e3f0e7cb88787a7b90861ad4f794817dd67a` | 10375971 |

### Gas Used
- **Mock USDC**: 659,905 gas (0.016498284905 ETH)
- **OnClick**: 2,921,434 gas (0.073038771434 ETH)
- **Total**: 3,581,339 gas (0.089537056339 ETH)

### Configuration
- **Network**: Celo Sepolia Testnet
- **Chain ID**: 84532 (11142220 in some tools)
- **RPC URL**: https://rpc.ankr.com/celo_sepolia
- **Explorer**: https://sepolia.celoscan.io

---

## Frontend Integration

The frontend has been automatically updated with these addresses in `onclick/lib/contract.ts`:

```typescript
testnet: {
  onClick: '0x274f499201b0716e6CB632FF5BEc10cAD508eAD6',
  usdc: '0xd9fc6cC979472A5FA52750ae26805462E1638872',
}
```

---

## Next Steps

### 1. Mint Test USDC
Mint USDC to your wallet for testing payments:

```bash
cast send 0xd9fc6cC979472A5FA52750ae26805462E1638872 \
  "mint(address,uint256)" \
  YOUR_WALLET_ADDRESS \
  1000000000 \
  --rpc-url https://rpc.ankr.com/celo_sepolia \
  --private-key $PRIVATE_KEY
```

This will mint **1000 USDC** (with 6 decimals) to your wallet.

### 2. Add Celo Sepolia to MetaMask

**Quick Add** (paste in browser console):
```javascript
window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0x14A54',
    chainName: 'Celo Sepolia Testnet',
    nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
    rpcUrls: ['https://rpc.ankr.com/celo_sepolia'],
    blockExplorerUrls: ['https://sepolia.celoscan.io']
  }]
});
```

### 3. Test Your App

```bash
cd onclick
npm run dev
```

#### Testing Checklist:
- [ ] Connect wallet to Celo Sepolia
- [ ] Mint USDC to your wallet
- [ ] Create a test page
- [ ] Check your USDC balance in the app
- [ ] Make a test payment
- [ ] Verify transaction on explorer
- [ ] Check page stats update

---

## Useful Commands

### Check USDC Balance
```bash
cast call 0xd9fc6cC979472A5FA52750ae26805462E1638872 \
  "balanceOf(address)(uint256)" \
  YOUR_WALLET_ADDRESS \
  --rpc-url https://rpc.ankr.com/celo_sepolia
```

### Check Page Info
```bash
cast call 0x274f499201b0716e6CB632FF5BEc10cAD508eAD6 \
  "getPage(string)" \
  "yourhandle" \
  --rpc-url https://rpc.ankr.com/celo_sepolia
```

### Mint More USDC (Anyone can call this)
```bash
cast send 0xd9fc6cC979472A5FA52750ae26805462E1638872 \
  "mint(address,uint256)" \
  YOUR_ADDRESS \
  5000000000 \
  --rpc-url https://rpc.ankr.com/celo_sepolia \
  --private-key $PRIVATE_KEY
```

---

## Contract Details

### Mock USDC
- **Name**: Mock USDC
- **Symbol**: USDC
- **Decimals**: 6
- **Initial Supply**: 1,000,000 USDC (to deployer)
- **Features**: Public mint function (anyone can mint for testing)

### OnClick
- **USDC Token**: 0xd9fc6cC979472A5FA52750ae26805462E1638872
- **Platform Fee**: 100 basis points (1%)
- **Fee Recipient**: Deployer address
- **Features**: 
  - Create pages (Creator, Business, Crowdfunder roles)
  - Accept USDC payments
  - Track supporters and totals
  - Transfer handles
  - Withdraw funds

---

## Need Help?

- **Faucet**: https://faucet.celo.org/sepolia (for CELO gas)
- **Explorer**: https://sepolia.celoscan.io
- **RPC**: https://rpc.ankr.com/celo_sepolia
- **Docs**: See `CELO_SEPOLIA_SETUP.md`

---

**🎊 Happy Testing!** 🚀


