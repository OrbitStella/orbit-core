# Counter Contract

A simple Soroban smart contract that implements a counter with increment and reset functionality.

## Features

- **Initialize**: Set the contract owner and initialize counter to 0
- **Increment**: Increment the counter by 1
- **Get**: Read the current counter value
- **Reset**: Reset counter to 0 (owner only)
- **Get Owner**: Retrieve the contract owner

## Usage

### Building the Contract

```bash
# Install Rust and Soroban CLI first
cargo build --target wasm32-unknown-unknown --release
```

### Testing

```bash
cargo test
```

### Deployment

Use the Orbit CLI to deploy:

```bash
orbit deploy --wasm target/wasm32-unknown-unknown/release/counter_contract.wasm --key private_key.txt
```

### Interaction

#### Initialize
```bash
orbit invoke --contract <CONTRACT_ID> --method initialize --args '["<OWNER_ADDRESS>"]'
```

#### Increment
```bash
orbit invoke --contract <CONTRACT_ID> --method increment
```

#### Get Counter
```bash
orbit invoke --contract <CONTRACT_ID> --method get
```

#### Reset (owner only)
```bash
orbit invoke --contract <CONTRACT_ID> --method reset --args '["<OWNER_ADDRESS>"]'
```

## Error Codes

- `1`: Contract not initialized
- `2`: Contract already initialized  
- `3`: No permission (owner-only operation)

## Storage

- `COUNTER`: Current counter value (u32)
- `OWNER`: Contract owner address
