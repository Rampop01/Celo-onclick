# OnClick Smart Contract

Universal payment and donation platform smart contract built with Foundry.

## Overview

The OnClick contract enables creators, businesses, and crowdfunders to:
- Create handle-based payment pages
- Accept payments in USDC (from crypto or fiat on-ramp)
- Track funding goals and deadlines
- Manage supporter lists and payment history

## Features

- **Handle-based Pages**: Unique handles for each payment page
- **Multiple Roles**: Support for Creators, Businesses, and Crowdfunders
- **Goal Tracking**: Optional funding goals with progress tracking
- **Deadline Support**: Optional campaign deadlines
- **Fiat Integration**: Support for fiat-to-crypto payments via backend
- **Platform Fees**: Configurable fee system (default 1-2%)
- **Security**: Reentrancy guards, pausable, and access controls

## Setup

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Node.js (for dependencies)

### Installation

```bash
# Install Foundry dependencies
forge install OpenZeppelin/openzeppelin-contracts

# Install npm dependencies (if using scripts)
npm install
```

## Contract Functions

### Page Management

- `createPage(handle, role, walletAddress, goal, deadline)` - Create a new payment page
- `updatePage(handle, walletAddress, goal, deadline)` - Update page settings
- `transferPageOwnership(handle, newOwner)` - Transfer page ownership
- `isHandleAvailable(handle)` - Check if handle is available

### Payments

- `makePayment(handle, amount, message)` - Make a crypto payment in USDC
- `recordFiatPayment(handle, supporter, amount, message)` - Record fiat payment (admin only)

### View Functions

- `getPage(handle)` - Get page data
- `getPageProgress(handle)` - Get funding progress (0-10000 basis points)
- `getPaymentCount(handle)` - Get number of payments
- `getPayment(handle, index)` - Get payment at index
- `getPayments(handle)` - Get all payments
- `getSupporterCount(handle)` - Get unique supporter count
- `getSupporters(handle)` - Get all supporter addresses
- `isGoalReached(handle)` - Check if goal is reached
- `isDeadlinePassed(handle)` - Check if deadline passed

### Admin Functions

- `setPlatformFee(newFeeBps)` - Update platform fee
- `setFeeRecipient(newFeeRecipient)` - Update fee recipient
- `pause()` / `unpause()` - Pause/unpause contract
- `emergencyWithdraw(token, to, amount)` - Emergency withdraw

## Deployment

### Local Testing

```bash
# Compile
forge build

# Run tests
forge test

# Deploy to local node
forge script script/Deploy.s.sol:DeployScript --rpc-url http://localhost:8545 --broadcast
```

### Testnet/Mainnet

```bash
# Set environment variables
export PRIVATE_KEY=your_private_key
export RPC_URL=your_rpc_url
export USDC_ADDRESS=0x... # USDC token address

# Deploy
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $RPC_URL \
  --broadcast \
  --verify
```

## Contract Parameters

- **USDC Token**: Address of USDC ERC20 token
- **Platform Fee**: Basis points (100 = 1%, default 100-200)
- **Fee Recipient**: Address to receive platform fees

## Security Considerations

- Contract uses OpenZeppelin's ReentrancyGuard
- Pausable for emergency stops
- Access controls for admin functions
- SafeERC20 for token transfers
- Input validation on all functions

## License

MIT

