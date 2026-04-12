# Orbit Core - Quick Start Guide

## Prerequisites

1. **Node.js >= 18.0.0**
2. **pnpm >= 8.0.0**
3. **Rust** (for contract development)

## Installation

```bash
# Install Node.js and pnpm
npm install -g pnpm

# Install Rust (for contracts)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Install WASM target
rustup target add wasm32-unknown-unknown

# Install Soroban CLI
cargo install soroban-cli
```

## Setup

```bash
# Clone and setup the monorepo
cd orbit-core
pnpm install

# Copy environment configuration
cp .env.example .env

# Build all packages
pnpm build
```

## Environment Configuration

Edit `.env` with your Stellar testnet configuration:

```env
# Stellar Network Configuration
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org

# Account Configuration (for testing only)
SECRET_KEY=YOUR_SECRET_KEY_HERE
PUBLIC_KEY=YOUR_PUBLIC_KEY_HERE
```

## Getting Testnet Funds

```bash
# Create a test account
soroban config network --global testnet
soroban keys generate --global alice
soroban keys fund alice --network testnet

# Get your public key
soroban keys address alice
```

## Building and Deploying Contracts

### 1. Build the Counter Contract

```bash
cd contracts/counter
cargo build --target wasm32-unknown-unknown --release
```

### 2. Deploy the Contract

```bash
# From project root
orbit deploy \
  --wasm contracts/counter/target/wasm32-unknown-unknown/release/counter_contract.wasm \
  --key ~/.config/soroban/alice.key \
  --network testnet
```

### 3. Initialize the Contract

```bash
# Replace CONTRACT_ID with the deployment result
orbit invoke \
  --contract CONTRACT_ID \
  --method initialize \
  --args '["YOUR_PUBLIC_KEY"]' \
  --key ~/.config/soroban/alice.key \
  --network testnet
```

### 4. Test the Contract

```bash
# Increment counter
orbit invoke \
  --contract CONTRACT_ID \
  --method increment \
  --key ~/.config/soroban/alice.key \
  --network testnet

# Get counter value
orbit invoke \
  --contract CONTRACT_ID \
  --method get \
  --network testnet
```

## Using the Web App

```bash
# Start the development server
pnpm --filter "@orbit-core/web" dev

# Open http://localhost:3000
```

The web app provides:
- Wallet connection (mock implementation)
- Account information display
- Contract interaction interface

## CLI Commands

### Deploy Contract
```bash
orbit deploy --wasm <path> --key <keyfile> --network testnet
```

### Invoke Contract Method
```bash
orbit invoke --contract <id> --method <name> --args '[...]' --key <keyfile>
```

### Get Account Info
```bash
orbit account --public-key <key> --network testnet
```

## SDK Usage

```typescript
import { createOrbitClient, NETWORKS } from '@orbit-core/sdk'

// Connect to testnet
const client = createOrbitClient({
  networkUrl: NETWORKS.TESTNET.networkUrl,
  rpcUrl: NETWORKS.TESTNET.rpcUrl,
  networkPassphrase: NETWORKS.TESTNET.networkPassphrase
})

// Get account info
const account = await client.getAccount(publicKey)

// Deploy contract
const result = await client.deployContract(wasmCode, keypair)

// Invoke contract method
const invokeResult = await client.invokeContract('increment', [], keypair)
```

## Development Workflow

### TypeScript Packages
```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter "@orbit-core/sdk" build

# Watch mode
pnpm --filter "@orbit-core/sdk" dev
```

### Rust Contracts
```bash
# Build contract
cd contracts/counter
cargo build --target wasm32-unknown-unknown --release

# Run tests
cargo test

# Optimize WASM
wasm-opt -Oz target/wasm32-unknown-unknown/release/counter_contract.wasm -o counter_contract.wasm
```

### Web App
```bash
# Development
pnpm --filter "@orbit-core/web" dev

# Build for production
pnpm --filter "@orbit-core/web" build

# Start production server
pnpm --filter "@orbit-core/web" start
```

## Network Configuration

### Testnet (Default)
- RPC: `https://soroban-testnet.stellar.org`
- Horizon: `https://horizon-testnet.stellar.org`
- Passphrase: `Test SDF Network ; September 2015`

### Futurenet
- RPC: `https://rpc-futurenet.stellar.org`
- Horizon: `https://horizon-futurenet.stellar.org`
- Passphrase: `Test SDF Future Network ; October 2022`

### Mainnet
- RPC: `https://soroban.stellar.org`
- Horizon: `https://horizon.stellar.org`
- Passphrase: `Public Global Stellar Network ; September 2015`

## Troubleshooting

### Common Issues

1. **"No signer provided"** - Ensure you provide a keypair for write operations
2. **"Contract not initialized"** - Call `initialize` method first
3. **"Insufficient funds"** - Fund your testnet account using friendbot
4. **"Network timeout"** - Check network connectivity and RPC URL

### Getting Help

- Check the [Stellar Documentation](https://developers.stellar.org/)
- Review [Soroban Documentation](https://soroban.stellar.org/)
- Join the [Stellar Discord](https://discord.gg/stellar)

## Security Notes

- **Never commit private keys** to version control
- Use environment variables for sensitive configuration
- Test on testnet before deploying to mainnet
- Use proper key management in production
