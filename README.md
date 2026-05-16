# Orbit Core

A TypeScript SDK and CLI toolkit for Stellar Soroban smart contract development and deployment.

## Overview

Orbit Core provides developer tools for building on the Stellar network, specifically focused on Soroban smart contracts. This monorepo includes:

- **packages/sdk** - TypeScript SDK for Stellar/Soroban contract interaction
- **packages/cli** - Command-line tool for contract deployment and interaction
- **packages/shared-utils** - Shared utility functions
- **contracts/counter** - Example Soroban smart contract (Rust)
- **apps/web** - Next.js web application for contract interaction

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Rust (for contract development)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment configuration
cp .env.example .env

# Build all packages
pnpm build

# Run development mode
pnpm dev
```

### Quick Start

1. **Setup Stellar Testnet Account:**
   ```bash
   soroban keys generate --global alice
   soroban keys fund alice --network testnet
   ```

2. **Build and Deploy Contract:**
   ```bash
   cd contracts/counter
   cargo build --target wasm32-unknown-unknown --release
   
   orbit deploy \
     --wasm target/wasm32-unknown-unknown/release/counter_contract.wasm \
     --key ~/.config/soroban/alice.key \
     --network testnet
   ```

3. **Start Web App:**
   ```bash
   pnpm --filter "@orbit-core/web" dev
   ```

See [QUICK_START.md](./QUICK_START.md) for detailed instructions.

## Documentation

- **[Quick Start Guide](./QUICK_START.md)** - Setup and usage instructions
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute
- **[Testing Guide](./TESTING.md)** - Testing and code quality

## Available Commands

### Makefile Commands (Recommended)
```bash
make help              # Show all available commands
make setup             # Setup development environment
make dev               # Start development mode
make build             # Build all packages
make test              # Run all tests
make lint              # Run linting
make format            # Format code
make deploy:contract   # Deploy contract to testnet
make status            # Show project status
make doctor            # Check development environment
```

### Package Scripts
- `pnpm build` - Build all packages in the monorepo
- `pnpm dev` - Run all packages in development mode
- `pnpm test` - Run all tests
- `pnpm lint` - Run ESLint across all packages
- `pnpm lint:fix` - Fix ESLint issues automatically
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm clean` - Clean build artifacts across all packages

### Contract Development
```bash
make build:contract   # Build Rust contract
make test:contract    # Test Rust contract
make deploy:contract  # Deploy contract to testnet
```

## Project Structure

```
orbit-core/
├── packages/
│   ├── sdk/           # TypeScript SDK for Stellar/Soroban
│   ├── cli/           # Command-line deployment tool
│   └── shared-utils/  # Shared utilities
├── contracts/
│   └── counter/       # Example Soroban contract
├── apps/
│   └── web/           # Next.js web interface
└── docs/              # Documentation
```

## Development Workflow

### Using the SDK

```typescript
import { createOrbitClient, NETWORKS } from '@orbit-core/sdk'

// Connect to testnet
const client = createOrbitClient({
  networkUrl: NETWORKS.TESTNET.networkUrl,
  rpcUrl: NETWORKS.TESTNET.rpcUrl,
  networkPassphrase: NETWORKS.TESTNET.networkPassphrase
})

// Deploy contract
const result = await client.deployContract(wasmCode, keypair)

// Invoke contract method
const invokeResult = await client.invokeContract('increment', [], keypair)
```

### Using the CLI

```bash
# Deploy a contract
orbit deploy --wasm contracts/counter/target/wasm32-unknown-unknown/release/counter_contract.wasm --key private_key.txt

# Invoke a contract method
orbit invoke --contract <CONTRACT_ID> --method increment

# Get account information
orbit account --public-key <PUBLIC_KEY>
```

### Building Contracts

```bash
cd contracts/counter
cargo build --target wasm32-unknown-unknown --release
```

## Code Quality

This monorepo enforces code quality through:

- **TypeScript** - Type safety and better developer experience
- **ESLint** - Code linting with TypeScript support
- **Prettier** - Consistent code formatting
- **Husky** (optional) - Git hooks for pre-commit checks

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Quick Steps
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm lint` and `pnpm typecheck`
5. Submit a pull request

### Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please read our [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

MIT License - see LICENSE file for details.
