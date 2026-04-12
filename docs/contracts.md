# Orbit Contracts Documentation

This guide covers developing Soroban smart contracts for the Orbit Core ecosystem using Rust.

## Quick Start

### Prerequisites

1. **Install Rust**
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source ~/.cargo/env
   ```

2. **Add WASM target**
   ```bash
   rustup target add wasm32-unknown-unknown
   ```

3. **Install Soroban CLI**
   ```bash
   cargo install soroban-cli
   ```

### Create a New Contract

```bash
# Navigate to contracts directory
cd contracts

# Create new contract
cargo new --lib my-contract
cd my-contract

# Add Soroban dependency
echo 'soroban-sdk = "20.0.0"' >> Cargo.toml
```

### Basic Contract Structure

```rust
#![no_std]
use soroban_sdk::{contractimpl, Address, Env};

pub struct MyContract;

#[contractimpl]
impl MyContract {
    pub fn initialize(env: Env, owner: Address) {
        // Contract initialization logic
    }
    
    pub fn my_method(env: Env, param: u32) -> u32 {
        // Contract method logic
        param * 2
    }
}
```

## Contract Development

### Project Structure

```
contracts/
|
+-- counter/                 # Example contract
|   +-- Cargo.toml          # Rust dependencies
|   +-- src/
|       +-- lib.rs          # Contract implementation
|       +-- test.rs         # Contract tests
|
+-- my-contract/            # Your new contract
    +-- Cargo.toml
    +-- src/
        +-- lib.rs
```

### Cargo.toml Configuration

```toml
[package]
name = "my-contract"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
soroban-sdk = "20.0.0"

[dev-dependencies]
soroban-sdk = { version = "20.0.0", features = ["testutils"] }

[profile.release]
opt-level = "z"
overflow-checks = true
debug = 0
strip = "symbols"
debug-assertions = false
panic = "abort"
codegen-units = 1
lto = true
```

### Building Contracts

```bash
# Build for release
cargo build --target wasm32-unknown-unknown --release

# Build output location
# target/wasm32-unknown-unknown/release/my_contract.wasm
```

### Testing Contracts

```bash
# Run tests
cargo test

# Run specific test
cargo test test_my_function

# Run tests with output
cargo test -- --nocapture
```

## Soroban SDK Basics

### Core Types

```rust
use soroban_sdk::{
    Env,           // Contract environment
    Address,       // Stellar address
    Symbol,        // Contract symbol
    Vec,           // Soroban vector
    Map,           // Soroban map
    Bytes,         // Byte array
    Uint256,       // 256-bit integer
};
```

### Storage

```rust
use soroban_sdk::{symbol_short, Env};

const COUNTER: Symbol = symbol_short!("COUNTER");
const OWNER: Symbol = symbol_short!("OWNER");

#[contractimpl]
impl MyContract {
    // Write to storage
    pub fn set_value(env: Env, value: u32) {
        env.storage().instance().set(&COUNTER, &value);
    }
    
    // Read from storage
    pub fn get_value(env: Env) -> u32 {
        env.storage().instance()
            .get(&COUNTER)
            .unwrap_or(0) // Default value
    }
    
    // Check if key exists
    pub fn has_value(env: Env) -> bool {
        env.storage().instance().has(&COUNTER)
    }
    
    // Remove from storage
    pub fn clear_value(env: Env) {
        env.storage().instance().remove(&COUNTER);
    }
}
```

### Access Control

```rust
#[contractimpl]
impl MyContract {
    pub fn protected_method(env: Env, caller: Address) {
        let owner: Address = env.storage()
            .instance()
            .get(&OWNER)
            .unwrap(); // Panic if no owner
        
        // Check caller is owner
        if caller != owner {
            panic_with_error!(env, 1); // Custom error code
        }
        
        // Protected operation
    }
}
```

### Error Handling

```rust
use soroban_sdk::panic_with_error;

// Error codes
pub const ERR_UNAUTHORIZED: u32 = 1;
pub const ERR_INSUFFICIENT_BALANCE: u32 = 2;
pub const ERR_INVALID_INPUT: u32 = 3;

#[contractimpl]
impl MyContract {
    pub fn transfer(env: Env, from: Address, to: Address, amount: u32) {
        // Check authorization
        if env.current_contract_address() != from {
            panic_with_error!(env, ERR_UNAUTHORIZED);
        }
        
        // Check amount
        if amount == 0 {
            panic_with_error!(env, ERR_INVALID_INPUT);
        }
        
        // Check balance
        let balance: u32 = env.storage()
            .instance()
            .get(&from)
            .unwrap_or(0);
            
        if balance < amount {
            panic_with_error!(env, ERR_INSUFFICIENT_BALANCE);
        }
        
        // Perform transfer
        env.storage().instance().set(&from, &(balance - amount));
        let to_balance: u32 = env.storage()
            .instance()
            .get(&to)
            .unwrap_or(0);
        env.storage().instance().set(&to, &(to_balance + amount));
    }
}
```

### Events

```rust
use soroban_sdk::{symbol_short, contracteventfn};

const TRANSFER_EVENT: Symbol = symbol_short!("TRANSFER");

#[contracteventfn]
fn transfer_event(from: Address, to: Address, amount: u32);

#[contractimpl]
impl MyContract {
    pub fn transfer(env: Env, from: Address, to: Address, amount: u32) {
        // Transfer logic...
        
        // Emit event
        transfer_event(env, from, to, amount);
    }
}
```

## Advanced Patterns

### Token Contract

```rust
use soroban_sdk::{
    Address, Env, Symbol, symbol_short, panic_with_error,
    contracteventfn
};

const TOKEN_SYMBOL: Symbol = symbol_short!("TOKEN");
const BALANCE: Symbol = symbol_short!("BALANCE");
const ALLOWANCE: Symbol = symbol_short!("ALLOWANCE");
const TOTAL_SUPPLY: Symbol = symbol_short!("TOTAL_SUPPLY");

const ERR_INSUFFICIENT_BALANCE: u32 = 1;
const ERR_INSUFFICIENT_ALLOWANCE: u32 = 2;

#[contracteventfn]
fn transfer_event(from: Address, to: Address, amount: u128);
#[contracteventfn]
fn approval_event(owner: Address, spender: Address, amount: u128);

pub struct TokenContract;

#[contractimpl]
impl TokenContract {
    pub fn initialize(env: Env, admin: Address, initial_supply: u128) {
        // Set total supply
        env.storage().instance().set(&TOTAL_SUPPLY, &initial_supply);
        
        // Give all supply to admin
        env.storage().instance().set(&BALANCE, &admin, &initial_supply);
    }
    
    pub fn transfer(env: Env, from: Address, to: Address, amount: u128) {
        let from_balance = env.storage()
            .instance()
            .get(&BALANCE, &from)
            .unwrap_or(0);
            
        if from_balance < amount {
            panic_with_error!(env, ERR_INSUFFICIENT_BALANCE);
        }
        
        env.storage().instance()
            .set(&BALANCE, &from, &(from_balance - amount));
            
        let to_balance = env.storage()
            .instance()
            .get(&BALANCE, &to)
            .unwrap_or(0);
            
        env.storage().instance()
            .set(&BALANCE, &to, &(to_balance + amount));
            
        transfer_event(env, from, to, amount);
    }
    
    pub fn approve(env: Env, owner: Address, spender: Address, amount: u128) {
        env.storage().instance()
            .set(&ALLOWANCE, &owner, &spender, &amount);
            
        approval_event(env, owner, spender, amount);
    }
    
    pub fn transfer_from(env: Env, spender: Address, from: Address, to: Address, amount: u128) {
        let allowance = env.storage()
            .instance()
            .get(&ALLOWANCE, &from, &spender)
            .unwrap_or(0);
            
        if allowance < amount {
            panic_with_error!(env, ERR_INSUFFICIENT_ALLOWANCE);
        }
        
        // Update allowance
        env.storage().instance()
            .set(&ALLOWANCE, &from, &spender, &(allowance - amount));
        
        // Perform transfer
        Self::transfer(env, from, to, amount);
    }
    
    pub fn balance(env: Env, account: Address) -> u128 {
        env.storage()
            .instance()
            .get(&BALANCE, &account)
            .unwrap_or(0)
    }
    
    pub fn allowance(env: Env, owner: Address, spender: Address) -> u128 {
        env.storage()
            .instance()
            .get(&ALLOWANCE, &owner, &spender)
            .unwrap_or(0)
    }
}
```

### Upgradable Contract

```rust
use soroban_sdk::{Address, Env, Bytes};

pub struct UpgradeableContract;

#[contractimpl]
impl UpgradeableContract {
    pub fn initialize(env: Env, admin: Address) {
        env.storage()
            .instance()
            .set(&symbol_short!("ADMIN"), &admin);
    }
    
    pub fn upgrade(env: Env, admin: Address, new_wasm: Bytes) {
        // Check authorization
        let stored_admin: Address = env.storage()
            .instance()
            .get(&symbol_short!("ADMIN"))
            .unwrap();
            
        if admin != stored_admin {
            panic_with_error!(env, 1); // Unauthorized
        }
        
        // Deploy new contract
        let new_contract_id = env.deployer()
            .deploy_contract(env.current_contract_address(), new_wasm);
            
        // Update storage to point to new contract
        env.storage()
            .instance()
            .set(&symbol_short!("IMPLEMENTATION"), &new_contract_id);
    }
}
```

### Factory Contract

```rust
use soroban_sdk::{Address, Env, Symbol, symbol_short, Bytes};

pub struct FactoryContract;

const COUNTER_CODE: Symbol = symbol_short!("COUNTER_CODE");
const COUNTERS: Symbol = symbol_short!("COUNTERS");

#[contractimpl]
impl FactoryContract {
    pub fn initialize(env: Env, admin: Address, counter_wasm: Bytes) {
        env.storage()
            .instance()
            .set(&symbol_short!("ADMIN"), &admin);
            
        env.storage()
            .instance()
            .set(&COUNTER_CODE, &counter_wasm);
    }
    
    pub fn create_counter(env: Env, creator: Address, salt: Bytes) -> Address {
        let counter_wasm: Bytes = env.storage()
            .instance()
            .get(&COUNTER_CODE)
            .unwrap();
            
        // Deploy new counter contract
        let counter_address = env.deployer()
            .deploy_contract_with_salt(
                env.current_contract_address(),
                counter_wasm,
                salt
            );
            
        // Initialize the counter
        let client = CounterContractClient::new(&env, &counter_address);
        client.initialize(&creator);
        
        // Track counter
        env.storage()
            .instance()
            .set(&COUNTERS, &creator, &counter_address);
            
        counter_address
    }
    
    pub fn get_counter(env: Env, creator: Address) -> Option<Address> {
        env.storage()
            .instance()
            .get(&COUNTERS, &creator)
    }
}
```

## Testing

### Unit Tests

```rust
#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{Address, Env};

    #[test]
    fn test_increment() {
        let env = Env::default();
        let contract_id = env.register_contract(None, MyContract);
        let client = MyContractClient::new(&env, &contract_id);

        // Test initial value
        assert_eq!(client.get_value(), 0);

        // Test increment
        client.increment();
        assert_eq!(client.get_value(), 1);

        // Test multiple increments
        client.increment();
        client.increment();
        assert_eq!(client.get_value(), 3);
    }

    #[test]
    #[should_panic(expected = "1")]
    fn test_unauthorized_access() {
        let env = Env::default();
        let contract_id = env.register_contract(None, MyContract);
        let client = MyContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let unauthorized = Address::generate(&env);

        client.initialize(&owner);

        // This should panic
        client.protected_method(&unauthorized);
    }
}
```

### Integration Tests

```rust
#[cfg(test)]
mod integration_test {
    use super::*;
    use soroban_sdk::{Address, Env};

    #[test]
    fn test_full_workflow() {
        let env = Env::default();
        let contract_id = env.register_contract(None, MyContract);
        let client = MyContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let user = Address::generate(&env);

        // Initialize
        client.initialize(&owner);

        // Test basic operations
        client.set_value(42);
        assert_eq!(client.get_value(), 42);

        // Test access control
        client.protected_method(&owner); // Should succeed
    }
}
```

## Deployment

### Build for Production

```bash
# Optimized build
cargo build --target wasm32-unknown-unknown --release

# Optional: Further optimize with wasm-opt
wasm-opt -Oz target/wasm32-unknown-unknown/release/my_contract.wasm -o my_contract.wasm
```

### Deploy with Orbit CLI

```bash
# Deploy contract
orbit deploy \
  --wasm target/wasm32-unknown-unknown/release/my_contract.wasm \
  --key ~/.config/soroban/alice.key \
  --network testnet

# Initialize contract
orbit invoke \
  --contract CONTRACT_ID \
  --method initialize \
  --args '["GABC...XYZ"]' \
  --key ~/.config/soroban/alice.key \
  --network testnet
```

### Deploy with Soroban CLI

```bash
# Deploy contract
soroban contract deploy \
  --wasm my_contract.wasm \
  --source alice \
  --network testnet

# Initialize contract
soroban contract invoke \
  --id CONTRACT_ID \
  --source alice \
  --network testnet \
  -- initialize \
  --address alice
```

## Best Practices

### 1. Security

- **Access Control**: Always check permissions for state-changing operations
- **Input Validation**: Validate all inputs and handle edge cases
- **Reentrancy**: Be careful with external calls
- **Overflow Protection**: Use checked arithmetic operations

```rust
// Good: Checked arithmetic
let new_value = value.checked_add(amount).unwrap();

// Bad: Unchecked arithmetic
let new_value = value + amount; // Can overflow
```

### 2. Gas Optimization

- **Storage Efficiency**: Use compact data structures
- **Lazy Operations**: Avoid unnecessary computations
- **Event Logging**: Use events instead of storage for logs

```rust
// Good: Use events for logging
transfer_event(env, from, to, amount);

// Bad: Store logs in storage
env.storage().instance().set(&log_key, &log_entry);
```

### 3. Upgradability

- **Proxy Pattern**: Use proxy contracts for upgradability
- **Storage Segregation**: Separate logic and storage
- **Version Management**: Track contract versions

### 4. Testing

- **Comprehensive Coverage**: Test all methods and edge cases
- **Property Testing**: Use property-based testing where appropriate
- **Integration Testing**: Test contract interactions

## Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   # Check Rust version
   rustc --version
   
   # Update Soroban SDK
   cargo update soroban-sdk
   ```

2. **WASM Size**
   ```bash
   # Check WASM size
   ls -lh target/wasm32-unknown-unknown/release/*.wasm
   
   # Optimize with wasm-opt
   wasm-opt -Oz input.wasm -o output.wasm
   ```

3. **Deployment Failures**
   ```bash
   # Check contract size limit
   soroban contract info --id CONTRACT_ID --network testnet
   
   # Check account balance
   soroban account --id ACCOUNT_ID --network testnet
   ```

### Debugging

1. **Use Test Environment**
   ```rust
   let env = Env::default();
   let contract_id = env.register_contract(None, MyContract);
   let client = MyContractClient::new(&env, &contract_id);
   ```

2. **Add Debug Logging**
   ```rust
   #[cfg(test)]
   fn debug_print<T: soroban_sdk::xdr::ScVal>(env: &Env, value: T) {
       env.log_value(&value.to_scval());
   }
   ```

3. **Step-by-Step Testing**
   ```rust
   #[test]
   fn test_step_by_step() {
       let env = Env::default();
       let client = create_client(&env);
       
       // Test each step individually
       client.step1();
       assert_eq!(client.get_state(), expected_state1);
       
       client.step2();
       assert_eq!(client.get_state(), expected_state2);
   }
   ```

## Examples

### Complete Counter Contract

```rust
#![no_std]
use soroban_sdk::{
    contractimpl, panic_with_error, symbol_short, Address, Env, Symbol
};

// Error codes
pub const ERR_NOT_INITIALIZED: u32 = 1;
pub const ERR_ALREADY_INITIALIZED: u32 = 2;
pub const ERR_NO_PERMISSION: u32 = 3;

// Storage keys
const COUNTER: Symbol = symbol_short!("COUNTER");
const OWNER: Symbol = symbol_short!("OWNER");

pub struct CounterContract;

#[contractimpl]
impl CounterContract {
    /// Initialize the contract with an owner
    pub fn initialize(env: Env, owner: Address) {
        if env.storage().instance().has(&OWNER) {
            panic_with_error!(env, ERR_ALREADY_INITIALIZED);
        }

        env.storage().instance().set(&OWNER, &owner);
        env.storage().instance().set(&COUNTER, &0u32);
    }

    /// Increment the counter by 1
    pub fn increment(env: Env) -> u32 {
        if !env.storage().instance().has(&OWNER) {
            panic_with_error!(env, ERR_NOT_INITIALIZED);
        }

        let mut count: u32 = env.storage()
            .instance()
            .get(&COUNTER)
            .unwrap_or(0);
        
        count = count.checked_add(1).unwrap_or(0);
        env.storage().instance().set(&COUNTER, &count);
        
        count
    }

    /// Get the current counter value
    pub fn get(env: Env) -> u32 {
        if !env.storage().instance().has(&OWNER) {
            panic_with_error!(env, ERR_NOT_INITIALIZED);
        }

        env.storage()
            .instance()
            .get(&COUNTER)
            .unwrap_or(0)
    }

    /// Reset the counter to 0 (only owner can do this)
    pub fn reset(env: Env, caller: Address) {
        if !env.storage().instance().has(&OWNER) {
            panic_with_error!(env, ERR_NOT_INITIALIZED);
        }

        let owner: Address = env.storage()
            .instance()
            .get(&OWNER)
            .unwrap();
            
        if caller != owner {
            panic_with_error!(env, ERR_NO_PERMISSION);
        }

        env.storage().instance().set(&COUNTER, &0u32);
    }

    /// Get the contract owner
    pub fn get_owner(env: Env) -> Address {
        if !env.storage().instance().has(&OWNER) {
            panic_with_error!(env, ERR_NOT_INITIALIZED);
        }

        env.storage()
            .instance()
            .get(&OWNER)
            .unwrap()
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{Address, Env};

    #[test]
    fn test_counter_workflow() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CounterContract);
        let client = CounterContractClient::new(&env, &contract_id);

        // Initialize
        let owner = Address::generate(&env);
        client.initialize(&owner);

        // Test initial value
        assert_eq!(client.get(), 0);

        // Test increment
        assert_eq!(client.increment(), 1);
        assert_eq!(client.get(), 1);

        // Test reset
        client.reset(&owner);
        assert_eq!(client.get(), 0);

        // Test owner
        assert_eq!(client.get_owner(), owner);
    }
}
```

This documentation provides a comprehensive guide to developing Soroban contracts for the Orbit Core ecosystem. For more examples and advanced patterns, see the project examples and Soroban documentation.
