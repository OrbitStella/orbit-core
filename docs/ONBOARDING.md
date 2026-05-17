# Orbit Core Onboarding Guide

Welcome to Orbit Core! This guide will help you get started with building Stellar Soroban applications.

## What is Orbit Core?

Orbit Core is a TypeScript SDK and CLI toolkit for Stellar Soroban smart contract development and deployment. It provides:

- **SDK**: TypeScript library for Stellar/Soroban contract interaction
- **CLI**: Command-line tool for contract deployment and interaction
- **Web App**: Next.js web application for contract interaction
- **Shared Utils**: Common utility functions for development
- **Example Contracts**: Sample Soroban smart contracts in Rust

## Quick Setup

### 1. Prerequisites

You'll need:
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Rust (for contract development)

```bash
# Check Node.js
node --version

# Install pnpm
npm install -g pnpm

# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

### 2. Install Dependencies

```bash
# Clone the repository
git clone https://github.com/OrbitStella/orbit-core.git
cd orbit-core

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

## Your First Contract

### 1. Build the Example Contract

```bash
# Build the counter contract
cd contracts/counter
cargo build --target wasm32-unknown-unknown --release

# Test it
cargo test
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
orbit deploy \
  --wasm target/wasm32-unknown-unknown/release/counter_contract.wasm \
  --key ~/.config/soroban/alice.key \
  --network testnet
```

## Interact with Your Contract

### Using the CLI

```bash
# Invoke contract method
orbit invoke \
  --contract <CONTRACT_ID> \
  --method increment \
  --key ~/.config/soroban/alice.key \
  --network testnet

# Check contract status
orbit status \
  --contract-id <CONTRACT_ID> \
  --network testnet

# Get account information
orbit account \
  --public-key <PUBLIC_KEY> \
  --network testnet
```

### Using the Web App

```bash
# Start the web app
pnpm --filter "@orbit-core/web" dev
```

Navigate to `http://localhost:3000` to access the web interface.

## Project Structure

```
orbit-core/
├── packages/
│   ├── sdk/           # TypeScript SDK
│   ├── cli/           # Command-line tools
│   └── shared-utils/  # Shared utilities
├── contracts/
│   └── counter/       # Example Soroban contract
├── apps/
│   └── web/           # Next.js web application
├── examples/
│   └── contracts/     # Example contract templates
└── docs/              # Documentation
```

## Available Scripts

```bash
# Build all packages
pnpm build

# Run all tests
pnpm test

# Run linting
pnpm lint

# Format code
pnpm format

# Type checking
pnpm typecheck
```

## Documentation

- [README](../README.md) - Main project documentation
- [CLI Reference](./CLI_REFERENCE.md) - Command-line tool documentation
- [Architecture](./architecture.md) - System design overview
- [Contributing](../CONTRIBUTING.md) - Contribution guidelines

## Get Help

- **GitHub Issues**: Report bugs and request features at https://github.com/OrbitStella/orbit-core/issues
- **Stellar Docs**: https://developers.stellar.org/docs/soroban/
- **Soroban Docs**: https://soroban.stellar.org/

---

**Welcome to Orbit Core!**
