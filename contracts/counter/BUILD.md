# Building and Deploying the Counter Contract

## Prerequisites

1. Install Rust:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source ~/.cargo/env
   ```

2. Install the Soroban CLI:
   ```bash
   cargo install soroban-cli
   ```

3. Add the WASM target:
   ```bash
   rustup target add wasm32-unknown-unknown
   ```

## Building the Contract

```bash
# Navigate to the contract directory
cd contracts/counter

# Build the contract for WASM
cargo build --target wasm32-unknown-unknown --release

# The compiled WASM file will be at:
# target/wasm32-unknown-unknown/release/counter_contract.wasm
```

## Testing the Contract

```bash
# Run the unit tests
cargo test

# Run a specific test
cargo test test_counter
```

## Deploying the Contract

### 1. Generate a Test Account

```bash
# Create a new test account on Stellar testnet
soroban config network --global testnet
soroban keys generate --global alice
soroban keys fund alice --network testnet
```

### 2. Deploy Using the Orbit CLI

```bash
# From the project root
orbit deploy \
  --wasm contracts/counter/target/wasm32-unknown-unknown/release/counter_contract.wasm \
  --key ~/.config/soroban/alice.key \
  --network testnet
```

### 3. Initialize the Contract

```bash
# Replace CONTRACT_ID with the ID from deployment
orbit invoke \
  --contract CONTRACT_ID \
  --method initialize \
  --args '["YOUR_PUBLIC_KEY"]' \
  --key ~/.config/soroban/alice.key \
  --network testnet
```

### 4. Interact with the Contract

```bash
# Increment the counter
orbit invoke \
  --contract CONTRACT_ID \
  --method increment \
  --key ~/.config/soroban/alice.key \
  --network testnet

# Get the counter value
orbit invoke \
  --contract CONTRACT_ID \
  --method get \
  --network testnet

# Reset the counter (owner only)
orbit invoke \
  --contract CONTRACT_ID \
  --method reset \
  --args '["YOUR_PUBLIC_KEY"]' \
  --key ~/.config/soroban/alice.key \
  --network testnet
```

## Using Soroban CLI Directly

```bash
# Deploy using soroban CLI
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/counter_contract.wasm \
  --source alice \
  --network testnet

# Initialize
soroban contract invoke \
  --id CONTRACT_ID \
  --source alice \
  --network testnet \
  -- initialize \
  --address alice

# Increment
soroban contract invoke \
  --id CONTRACT_ID \
  --source alice \
  --network testnet \
  -- increment

# Get value
soroban contract invoke \
  --id CONTRACT_ID \
  --network testnet \
  -- get
```

## Contract Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `initialize` | `owner: Address` | Initialize contract with owner |
| `increment` | none | Increment counter by 1 |
| `get` | none | Get current counter value |
| `reset` | `caller: Address` | Reset counter to 0 (owner only) |
| `get_owner` | none | Get contract owner |

## Error Codes

- `1`: Contract not initialized
- `2`: Contract already initialized  
- `3`: No permission (owner-only operation)

## Optimization

The contract is built with optimization settings for production:

- `opt-level = "z"`: Size optimization
- `lto = true`: Link-time optimization
- `codegen-units = 1`: Maximum optimization
- `panic = "abort"`: Smaller binary size

For development, you can build without optimizations:

```bash
cargo build --target wasm32-unknown-unknown
```
