# Contributing to Orbit Core

Welcome to Orbit Core! We're excited to have you contribute to this Stellar Soroban development platform. This guide will help you get started and make your first contribution.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Development Workflow](#development-workflow)
- [Running Contracts](#running-contracts)
- [Using the SDK](#using-the-sdk)
- [Using the CLI](#using-the-cli)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Code Style](#code-style)
- [Getting Help](#getting-help)

## Prerequisites

Before you start, make sure you have:

1. **Node.js >= 18.0.0**
2. **pnpm >= 8.0.0**
3. **Rust** (for contract development)
4. **Git**
5. **GitHub account**

### Installation Commands

```bash
# Install Node.js and pnpm
npm install -g pnpm

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Install WASM target
rustup target add wasm32-unknown-unknown

# Install Soroban CLI
cargo install soroban-cli
```

## Project Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/orbit-core.git
cd orbit-core

# Add the original repository as upstream
git remote add upstream https://github.com/ORIGINAL_OWNER/orbit-core.git
```

### 2. Install Dependencies

```bash
# Install all dependencies
pnpm install

# Copy environment configuration
cp .env.example .env

# Build all packages
pnpm build
```

### 3. Setup Testnet Account

```bash
# Create a test account
soroban config network --global testnet
soroban keys generate --global alice
soroban keys fund alice --network testnet

# Get your public key and add to .env
soroban keys address alice
```

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `docs/*` - Documentation updates

### Making Changes

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Write code
   - Add tests
   - Update documentation

3. **Test your changes:**
   ```bash
   # Run tests
   pnpm test
   
   # Run linting
   pnpm lint
   
   # Check types
   pnpm typecheck
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create a pull request:**
   ```bash
   git push origin feature/your-feature-name
   ```

## Running Contracts

### Building Contracts

```bash
# Navigate to contract directory
cd contracts/counter

# Build for WASM
cargo build --target wasm32-unknown-unknown --release

# Run tests
cargo test

# Optimize WASM (optional)
wasm-opt -Oz target/wasm32-unknown-unknown/release/counter_contract.wasm -o counter_contract.wasm
```

### Deploying Contracts

```bash
# Deploy using Orbit CLI
orbit deploy \
  --wasm contracts/counter/target/wasm32-unknown-unknown/release/counter_contract.wasm \
  --key ~/.config/soroban/alice.key \
  --network testnet

# Or using Soroban CLI directly
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/counter_contract.wasm \
  --source alice \
  --network testnet
```

### Testing Contracts

```bash
# Initialize contract
orbit invoke \
  --contract CONTRACT_ID \
  --method initialize \
  --args '["YOUR_PUBLIC_KEY"]' \
  --key ~/.config/soroban/alice.key \
  --network testnet

# Test increment
orbit invoke \
  --contract CONTRACT_ID \
  --method increment \
  --key ~/.config/soroban/alice.key \
  --network testnet

# Get value
orbit invoke \
  --contract CONTRACT_ID \
  --method get \
  --network testnet
```

## Using the SDK

### Basic Usage

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

### Development Mode

```bash
# Watch SDK for changes
pnpm --filter "@orbit-core/sdk" dev

# Test SDK changes
cd packages/sdk
npm test
```

## Using the CLI

### Building CLI

```bash
# Build CLI package
pnpm --filter "@orbit-core/cli" build

# Make CLI available globally
npm link -g

# Or use directly
node packages/cli/dist/cli.js --help
```

### CLI Commands

```bash
# Deploy contract
orbit deploy --wasm <path> --key <keyfile> --network testnet

# Invoke contract
orbit invoke --contract <id> --method <name> --args '[...]' --key <keyfile>

# Get account info
orbit account --public-key <key> --network testnet
```

### CLI Development

```bash
# Watch for changes
pnpm --filter "@orbit-core/cli" dev

# Test CLI
cd packages/cli
npm test
```

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter "@orbit-core/sdk" test

# Run contract tests
cd contracts/counter
cargo test

# Run with coverage
pnpm test:coverage
```

### Writing Tests

#### TypeScript Tests

```typescript
// Example SDK test
import { createOrbitClient } from '@orbit-core/sdk'

describe('OrbitClient', () => {
  it('should connect to testnet', async () => {
    const client = createOrbitClient({
      networkUrl: 'https://horizon-testnet.stellar.org',
      rpcUrl: 'https://soroban-testnet.stellar.org',
      networkPassphrase: 'Test SDF Network ; September 2015'
    })
    
    expect(client).toBeDefined()
  })
})
```

#### Rust Tests

```rust
// Example contract test
#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_counter_increment() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CounterContract);
        let client = CounterContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        client.initialize(&owner);
        
        assert_eq!(client.get(), 0);
        assert_eq!(client.increment(), 1);
        assert_eq!(client.get(), 1);
    }
}
```

## Submitting Changes

### Pull Request Process

1. **Update Documentation**
   - README.md if needed
   - API documentation
   - Comments in code

2. **Add Tests**
   - Unit tests for new features
   - Integration tests for workflows
   - Update existing tests

3. **Quality Checks**
   ```bash
   # Run all checks
   pnpm lint
   pnpm typecheck
   pnpm test
   
   # Format code
   pnpm format
   ```

4. **Create Pull Request**
   - Use descriptive title
   - Fill out PR template
   - Link relevant issues
   - Add screenshots for UI changes

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Manual testing completed
- [ ] Integration tested

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## Code Style

### TypeScript

- Use TypeScript strict mode
- Prefer explicit return types
- Use interfaces over types when extending
- Follow naming conventions:
  - Classes: PascalCase
  - Functions/variables: camelCase
  - Constants: UPPER_SNAKE_CASE

### Rust

- Use `rustfmt` for formatting
- Follow Rust naming conventions
- Add proper error handling
- Include documentation comments

### General

- Keep functions small and focused
- Write clear, descriptive commit messages
- Add comments for complex logic
- Update README for user-facing changes

## Getting Help

### Resources

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Documentation](https://soroban.stellar.org/)
- [Rust Book](https://doc.rust-lang.org/book/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Community

- [Stellar Discord](https://discord.gg/stellar)
- [GitHub Discussions](https://github.com/stellar/stellar-sdk/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/stellar)

### Project Maintainers

- Create an issue for questions
- Tag maintainainers for urgent issues
- Join our Discord community

## Stellar Wave Program

This project participates in the Stellar Wave program! 

### Wave Contributors

- Look for issues labeled `good first issue` and `wave`
- Start with smaller issues to get familiar
- Join the Wave Discord channel
- Attend Wave office hours

### Wave Recognition

- Contributors are recognized in our README
- Top contributors get special roles
- Wave completion certificates available

### Wave Support

- Dedicated mentorship available
- Weekly office hours
- Priority issue resolution
- Code review assistance

Thank you for contributing to Orbit Core and the Stellar ecosystem! :rocket:
