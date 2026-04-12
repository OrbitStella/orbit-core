# 10-Minute Onboarding Guide

Welcome to Orbit Core! This guide will get you up and running in just 10 minutes.

## What is Orbit Core?

Orbit Core is a comprehensive toolkit for building Stellar Soroban applications. It includes:

- **SDK**: TypeScript library for Stellar/Soroban integration
- **CLI**: Command-line tools for deployment and interaction
- **Web App**: React interface for contract interaction
- **Contracts**: Example smart contracts in Rust

## Quick Setup (2 minutes)

### 1. Prerequisites

You'll need:
- Node.js 18+ and pnpm
- Rust (for contract development)

```bash
# Check Node.js
node --version

# Install pnpm
npm install -g pnpm

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

### 2. Install Dependencies

```bash
# Clone and setup
git clone https://github.com/your-org/orbit-core.git
cd orbit-core

# Install everything
make setup
```

## Your First Contract (3 minutes)

### 1. Build the Example Contract

```bash
# Build the counter contract
make build:contract

# Test it
make test:contract
```

### 2. Get Testnet Account

```bash
# Create testnet account
soroban keys generate --global alice
soroban keys fund alice --network testnet

# Get your public key
soroban keys address alice
```

### 3. Deploy the Contract

```bash
# Deploy to testnet
export CONTRACT_KEY=~/.config/soroban/alice.key
make deploy:contract
```

You should see something like:
```
Contract deployed successfully!
Contract ID: CD3XS...U7M
Transaction ID: a1b2c3d4e5f6...
```

## Interact with Your Contract (2 minutes)

### 1. Initialize the Contract

Replace `CONTRACT_ID` with your deployed contract ID and `PUBLIC_KEY` with your address:

```bash
# Initialize contract (replace with your values)
orbit invoke \
  --contract CONTRACT_ID \
  --method initialize \
  --args '["PUBLIC_KEY"]' \
  --key $CONTRACT_KEY \
  --network testnet
```

### 2. Use the Contract

```bash
# Increment counter
orbit invoke \
  --contract CONTRACT_ID \
  --method increment \
  --key $CONTRACT_KEY \
  --network testnet

# Get counter value
orbit invoke \
  --contract CONTRACT_ID \
  --method get \
  --network testnet
```

## Explore the Web App (2 minutes)

### 1. Start the Development Server

```bash
# Start the web app
make dev:web
```

### 2. Open Your Browser

Navigate to `http://localhost:3000`

You'll see:
- **Wallet Connect**: Connect your testnet account
- **Account Info**: View your account details
- **Contract Interaction**: Deploy and invoke contracts

### 3. Try the Web Interface

1. Connect your wallet using your testnet secret key
2. Enter your contract ID
3. Try the "increment" method
4. Check the "get" method to see the result

## Understand the Architecture (1 minute)

```
Orbit Core
|
+-- packages/sdk/      # TypeScript SDK
+-- packages/cli/      # Command-line tools  
+-- apps/web/          # React web app
+-- contracts/counter/  # Rust smart contract
```

- **SDK**: Core library for Stellar operations
- **CLI**: Command-line interface for developers
- **Web App**: User interface for contract interaction
- **Contracts**: Smart contracts written in Rust

## Next Steps

### Try These Commands

```bash
# Check project status
make status

# Run all tests
make test

# Check code quality
make lint

# See all available commands
make help
```

### Explore the Code

1. **SDK**: `packages/sdk/src/index.ts` - Main client class
2. **CLI**: `packages/cli/src/commands/` - Command implementations
3. **Web**: `apps/web/src/components/` - React components
4. **Contract**: `contracts/counter/src/lib.rs` - Smart contract

### Read the Documentation

- [Architecture](./architecture.md) - System design
- [SDK Guide](./sdk.md) - TypeScript library
- [CLI Guide](./cli.md) - Command-line tools
- [Contracts Guide](./contracts.md) - Smart contracts

## Common Tasks

### Deploy a New Contract

```bash
# Build your contract
cd contracts/my-contract
cargo build --target wasm32-unknown-unknown --release

# Deploy it
orbit deploy \
  --wasm target/wasm32-unknown-unknown/release/my_contract.wasm \
  --key $CONTRACT_KEY \
  --network testnet
```

### Check Account Balance

```bash
# Check your testnet account
orbit account --public-key YOUR_PUBLIC_KEY --network testnet
```

### Run Tests

```bash
# Run all tests
make test

# Run specific package tests
pnpm --filter "@orbit-core/sdk" test

# Run contract tests
cd contracts/counter && cargo test
```

## Get Help

### Documentation

- **Quick Start**: [QUICK_START.md](../QUICK_START.md)
- **Testing Guide**: [TESTING.md](../TESTING.md)
- **Contributing**: [CONTRIBUTING.md](../CONTRIBUTING.md)

### Community

- **Discord**: Join our community for help
- **GitHub Issues**: Report bugs and request features
- **Stellar Docs**: [developers.stellar.org](https://developers.stellar.org/)

### Troubleshooting

**Common Issues:**

1. **"Account not found"**
   - Fund your testnet account: `soroban keys fund alice --network testnet`

2. **"Contract not found"**
   - Verify contract ID is correct
   - Check you're on the right network

3. **"Insufficient balance"**
   - Fund your account with more testnet lumens

4. **"Build failed"**
   - Run `make setup` to ensure everything is installed

## You're Ready! 

You've successfully:

- [x] Set up the development environment
- [x] Built and deployed a smart contract
- [x] Interacted with your contract via CLI
- [x] Used the web application interface
- [x] Understood the basic architecture

### What's Next?

1. **Build Your Own Contract**: Create a custom smart contract
2. **Explore the SDK**: Use the TypeScript library in your projects
3. **Contribute**: Help improve Orbit Core (see [CONTRIBUTING.md](../CONTRIBUTING.md))
4. **Join the Community**: Connect with other developers

---

**Welcome to the Orbit Core ecosystem!** 

If you need help, reach out on Discord or create a GitHub issue. Happy building! :rocket:
