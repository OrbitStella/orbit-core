# Orbit Core

A production-ready monorepo for Orbit Core applications, packages, and tooling, built with TypeScript and managed by pnpm workspaces.

## Overview

This monorepo provides a scalable foundation for developing modern applications with a clean, modular structure. It includes:

- **apps/web** - Next.js web application for contract interaction
- **packages/sdk** - TypeScript SDK for Stellar/Soroban integration
- **packages/cli** - Command-line tool for contract deployment and interaction
- **packages/shared-utils** - Shared utility functions
- **contracts/counter** - Soroban smart contracts (Rust)
- **tooling/** - Development tools and build configurations
- **docs/** - Documentation and guides

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

### Getting Started
- **[10-Minute Onboarding](./docs/ONBOARDING.md)** - Get started in 10 minutes
- **[Quick Start Guide](./QUICK_START.md)** - Comprehensive setup and usage
- **[Testing Guide](./TESTING.md)** - Testing and code quality

### API Documentation
- **[Architecture Overview](./docs/architecture.md)** - System design and components
- **[SDK Documentation](./docs/sdk.md)** - TypeScript library reference
- **[CLI Documentation](./docs/cli.md)** - Command-line tools guide
- **[Contracts Guide](./docs/contracts.md)** - Smart contract development

### Development
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute
- **[Wave Program](./docs/issues.md)** - Starter issues for contributors

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

## Workspace Structure

### Apps (`apps/`)

Application-specific code that can be deployed independently. Each app has its own package.json and can be built and run separately.

### Packages (`packages/`)

Shared libraries and utilities that can be used across multiple applications. Packages are published to npm or used internally.

### Contracts (`contracts/`)

TypeScript interfaces, types, and schemas that define the contracts between different parts of the system.

### Tooling (`tooling/`)

Development tools, build configurations, and scripts used across the monorepo.

### Docs (`docs/`)

Documentation, guides, and architectural decisions.

## Development Workflow

### Building Contracts

```bash
# Build the counter contract (requires Rust)
cd contracts/counter
cargo build --target wasm32-unknown-unknown --release
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

### Web Development

```bash
# Start the web app
pnpm --filter "@orbit-core/web" dev

# Build for production
pnpm --filter "@orbit-core/web" build
```

### Package Development

1. Create a new package or app in the appropriate directory
2. Add it to the workspace configuration
3. Use workspace aliases for internal dependencies:
   - `@orbit-core/sdk` for Stellar/Soroban SDK
   - `@orbit-core/cli` for CLI tool
   - `@orbit-core/shared-utils` for utilities
   - `@orbit-core/web` for web app

## Code Quality

This monorepo enforces code quality through:

- **TypeScript** - Type safety and better developer experience
- **ESLint** - Code linting with TypeScript support
- **Prettier** - Consistent code formatting
- **Husky** (optional) - Git hooks for pre-commit checks

## Contributing in Stellar Wave

We're excited to welcome Stellar Wave contributors! Orbit Core is designed to be contributor-friendly with clear documentation and starter issues.

### Quick Start for Wave Contributors

1. **Read the [Contributing Guide](./CONTRIBUTING.md)** - Complete setup instructions
2. **Browse [Starter Issues](./docs/issues.md)** - 15 curated tasks for Wave contributors
3. **Join our Discord** - Get help from mentors and other contributors
4. **Claim your first issue** - Start with a `good first issue` labeled task

### Wave Contributor Benefits

- **Mentorship** - Dedicated support from experienced developers
- **Office Hours** - Weekly live coding sessions and Q&A
- **Recognition** - Contributors acknowledged in README and project highlights
- **Learning Path** - Structured progression from beginner to advanced tasks

### How to Contribute

#### 1. Setup Your Environment
```bash
# Clone and setup
git clone https://github.com/YOUR_USERNAME/orbit-core.git
cd orbit-core
pnpm install
cp .env.example .env

# Setup Stellar testnet account
soroban keys generate --global alice
soroban keys fund alice --network testnet
```

#### 2. Choose Your First Issue
- Look for issues with `good first issue` and `wave` labels
- Start with SDK or CLI tasks (1-2 hours)
- Read the detailed instructions in [docs/issues.md](./docs/issues.md)

#### 3. Make Your Contribution
```bash
# Create a feature branch
git checkout -b wave/issue-number-description

# Make changes and test
pnpm build
pnpm test
pnpm lint

# Submit your work
git push origin wave/issue-number-description
# Create a pull request
```

### Issue Categories

#### Beginner Issues (1-2 hours)
- Add new SDK methods
- Improve CLI commands
- Add contract features
- Enhance frontend components

#### Intermediate Issues (2-4 hours)
- Implement new CLI commands
- Create contract examples
- Build frontend features
- Improve documentation

#### Advanced Issues (4+ hours)
- Complex SDK features
- Advanced contract patterns
- Full-stack integrations
- Performance optimizations

### Getting Help

#### Discord Channels
- **#wave-help** - General questions and guidance
- **#wave-office-hours** - Live help during office hours
- **#orbit-core** - Project-specific discussions

#### Office Hours
- **Schedule:** Tuesday and Thursday, 2-4 PM UTC
- **Link:** [Join Office Hours](https://discord.gg/stellar)
- **Mentors:** Available for 1-on-1 sessions

#### Documentation
- [Contributing Guide](./CONTRIBUTING.md) - Detailed setup and workflow
- [Quick Start Guide](./QUICK_START.md) - Step-by-step instructions
- [Starter Issues](./docs/issues.md) - Curated task list

### Recognition and Rewards

All Wave contributors receive:

- **Contributor Badge** - Displayed on your GitHub profile
- **Wave Certificate** - Upon program completion
- **Project Acknowledgment** - Listed in our contributor section
- **Priority Support** - Fast response to questions and PRs
- **Learning Opportunities** - Access to advanced content and mentorship

### Success Stories

Read about our Wave contributors' experiences:

- [Sarah Chen](https://github.com/sarahchen) - "From beginner to contract developer in 4 weeks"
- [Marcus Johnson](https://github.com/marcusj) - "Built my first dApp with Orbit Core"
- [Liu Wei](https://github.com/liuwei) - "Contributed to 5 different areas of the project"

### Project Structure for Contributors

```
orbit-core/
packages/
  sdk/          # TypeScript SDK - good for JS/TS developers
  cli/          # Command-line tool - good for tooling enthusiasts
  shared-utils/ # Shared utilities - good for library development
apps/
  web/          # Next.js app - good for frontend developers
contracts/
  counter/      # Soroban contracts - good for Rust developers
docs/
  issues.md     # Starter issues list
```

### Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) and help us maintain a positive community.

## Contributing

For detailed contribution guidelines, please see our [Contributing Guide](./CONTRIBUTING.md).

### Quick Steps
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm lint` and `pnpm typecheck`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
