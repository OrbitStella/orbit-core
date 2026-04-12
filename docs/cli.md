# Orbit CLI Documentation

The Orbit CLI is a command-line tool that provides a convenient interface for interacting with Stellar and Soroban contracts.

## Installation

The CLI is included in the Orbit Core monorepo. After building the project:

```bash
# Build the CLI
pnpm --filter "@orbit-core/cli" build

# Use the CLI
node packages/cli/dist/cli.js --help

# Or add to PATH
export PATH="$PWD/packages/cli/dist:$PATH"
orbit --help
```

## Quick Start

### 1. Setup Testnet Account

```bash
# Create a testnet account
soroban keys generate --global alice
soroban keys fund alice --network testnet

# Get your public key
soroban keys address alice
```

### 2. Deploy a Contract

```bash
# Build the contract
make build:contract

# Deploy to testnet
orbit deploy \
  --wasm contracts/counter/target/wasm32-unknown-unknown/release/counter_contract.wasm \
  --key ~/.config/soroban/alice.key \
  --network testnet
```

### 3. Interact with Contract

```bash
# Initialize contract (replace CONTRACT_ID)
orbit invoke \
  --contract CONTRACT_ID \
  --method initialize \
  --args '["GABC...XYZ"]' \
  --key ~/.config/soroban/alice.key \
  --network testnet

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

## Commands

### orbit deploy

Deploys a Soroban contract to the specified network.

#### Usage

```bash
orbit deploy [options]
```

#### Options

| Option | Short | Description | Required |
|--------|-------|-------------|----------|
| `--wasm` | `-w` | Path to WASM file | Yes |
| `--key` | `-k` | Path to private key file | Yes |
| `--network` | `-n` | Network (testnet, futurenet, mainnet) | No (default: testnet) |
| `--salt` | `-s` | Salt for contract deployment | No |
| `--auth` | | Enable contract authorization | No |

#### Examples

```bash
# Basic deployment
orbit deploy \
  --wasm contract.wasm \
  --key ~/.config/soroban/alice.key

# With custom salt and authorization
orbit deploy \
  --wasm contract.wasm \
  --key ~/.config/soroban/alice.key \
  --salt "my-contract-salt" \
  --auth

# Deploy to different network
orbit deploy \
  --wasm contract.wasm \
  --key ~/.config/soroban/alice.key \
  --network futurenet
```

#### Output

```
Deploying contract...
Contract deployed successfully!
Contract ID: CD3XS...U7M
Transaction ID: a1b2c3d4e5f6...
```

### orbit invoke

Invokes a method on a deployed contract.

#### Usage

```bash
orbit invoke [options]
```

#### Options

| Option | Short | Description | Required |
|--------|-------|-------------|----------|
| `--contract` | `-c` | Contract ID | Yes |
| `--method` | `-m` | Method name to invoke | Yes |
| `--args` | `-a` | Arguments (JSON array) | No (default: []) |
| `--key` | `-k` | Path to private key file | No (for read-only methods) |
| `--network` | `-n` | Network (testnet, futurenet, mainnet) | No (default: testnet) |

#### Examples

```bash
# Read-only method (no key needed)
orbit invoke \
  --contract CD3XS...U7M \
  --method get_counter

# Write method (requires key)
orbit invoke \
  --contract CD3XS...U7M \
  --method increment \
  --key ~/.config/soroban/alice.key

# Method with arguments
orbit invoke \
  --contract CD3XS...U7M \
  --method set_value \
  --args '[42, "hello", true]' \
  --key ~/.config/soroban/alice.key

# Complex arguments
orbit invoke \
  --contract CD3XS...U7M \
  --method transfer \
  --args '[{"address": "GABC...XYZ", "amount": 100}]' \
  --key ~/.config/soroban/alice.key
```

#### Argument Format

Arguments must be provided as a JSON array:

```bash
# Simple types
--args '["string", 42, true]'

# Arrays
--args '[[1, 2, 3], ["a", "b", "c"]]'

# Objects
--args '[{"key": "value", "number": 42}]'

# Mixed types
--args '["hello", 42, [1, 2, 3], {"nested": true}]'
```

#### Output

```
Invoking method: increment...
Method invoked successfully!
Transaction ID: f6e5d4c3b2a1...
Result: 5
```

### orbit account

Retrieves account information from the Stellar network.

#### Usage

```bash
orbit account [options]
```

#### Options

| Option | Short | Description | Required |
|--------|-------|-------------|----------|
| `--public-key` | `-p` | Stellar public key | Yes |
| `--network` | `-n` | Network (testnet, futurenet, mainnet) | No (default: testnet) |

#### Examples

```bash
# Get account information
orbit account --public-key GABC...XYZ

# From different network
orbit account \
  --public-key GABC...XYZ \
  --network mainnet
```

#### Output

```
Fetching account information...
Account information:
Public Key: GABC...XYZ
Sequence: 123456789
Balance: native: 1000.0000000
Subentries: 0
Signers: 1
  - GABC...XYZ: 1
Data: 0 entries
```

## Configuration

### Environment Variables

You can set environment variables to avoid repeating common options:

```bash
# Default network
export ORBIT_NETWORK=testnet

# Default key file
export ORBIT_KEY_FILE=~/.config/soroban/alice.key

# Default contract ID
export ORBIT_CONTRACT_ID=CD3XS...U7M
```

### Configuration File

Create a configuration file at `~/.orbit/config.json`:

```json
{
  "network": "testnet",
  "keyFile": "~/.config/soroban/alice.key",
  "contractId": "CD3XS...U7M",
  "logLevel": "info"
}
```

## Error Handling

The CLI provides detailed error messages and suggestions:

### Common Errors

#### File Not Found
```
Error: Failed to read WASM file: contract.wasm
Suggestion: Please check the file path and ensure the file exists.
```

#### Invalid Network
```
Error: Invalid network "prodnet"
Available networks: testnet, futurenet, mainnet
Suggestion: Please use a valid network name.
```

#### Contract Not Found
```
Error: Contract not found: CD3XS...U7M
Suggestion: Please verify the contract ID is correct and deployed on the selected network.
```

#### Insufficient Balance
```
Error: Account has insufficient balance for transaction
Suggestion: Please ensure the account has sufficient balance for the transaction.
```

### Debug Mode

Enable debug logging for more detailed information:

```bash
# Set log level
export ORBIT_LOG_LEVEL=debug

# Or use in command
orbit deploy --log-level debug --wasm contract.wasm --key key.txt
```

## Advanced Usage

### Working with Multiple Networks

```bash
# Deploy to testnet
orbit deploy --wasm contract.wasm --key key.txt --network testnet

# Deploy to futurenet
orbit deploy --wasm contract.wasm --key key.txt --network futurenet

# Deploy to mainnet
orbit deploy --wasm contract.wasm --key key.txt --network mainnet
```

### Batch Operations

Use shell scripting for batch operations:

```bash
#!/bin/bash
# deploy-and-test.sh

CONTRACT_ID=$(orbit deploy \
  --wasm contract.wasm \
  --key key.txt \
  --network testnet \
  | grep "Contract ID:" | cut -d' ' -f3)

echo "Deployed contract: $CONTRACT_ID"

# Initialize
orbit invoke \
  --contract $CONTRACT_ID \
  --method initialize \
  --args '["GABC...XYZ"]' \
  --key key.txt \
  --network testnet

# Test increment
orbit invoke \
  --contract $CONTRACT_ID \
  --method increment \
  --key key.txt \
  --network testnet

# Verify
orbit invoke \
  --contract $CONTRACT_ID \
  --method get \
  --network testnet
```

### Integration with Other Tools

```bash
# Use with soroban CLI
CONTRACT_ID=$(orbit deploy --wasm contract.wasm --key key.txt | grep "Contract ID:" | cut -d' ' -f3)

# Get contract info with soroban
soroban contract info --id $CONTRACT_ID --network testnet

# Simulate transaction
soroban contract simulate \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- increment
```

## Best Practices

### 1. Key Management

- Store private keys securely
- Use environment variables for sensitive data
- Never commit keys to version control

```bash
# Good: Use environment variable
export CONTRACT_KEY=~/.config/soroban/alice.key
orbit deploy --wasm contract.wasm --key $CONTRACT_KEY

# Bad: Hardcode key in scripts
orbit deploy --wasm contract.wasm --key /path/to/secret.key
```

### 2. Network Selection

- Use testnet for development
- Test thoroughly before deploying to mainnet
- Always specify network explicitly in scripts

```bash
# Good: Explicit network
orbit deploy --wasm contract.wasm --key key.txt --network testnet

# Risky: Rely on defaults
orbit deploy --wasm contract.wasm --key key.txt
```

### 3. Error Handling

- Check return codes in scripts
- Handle network errors gracefully
- Use appropriate retry logic

```bash
#!/bin/bash
# deploy-with-retry.sh

MAX_RETRIES=3
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if orbit deploy --wasm contract.wasm --key key.txt --network testnet; then
    echo "Deployment successful!"
    exit 0
  else
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "Deployment failed, retrying... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 5
  fi
done

echo "Deployment failed after $MAX_RETRIES attempts"
exit 1
```

### 4. Argument Validation

- Validate arguments before invoking methods
- Use proper JSON formatting
- Test with small amounts first

```bash
# Validate JSON syntax
echo '["hello", 42, true]' | jq .

# Test with dry run (if supported)
orbit invoke --contract ID --method test --args '["test"]' --dry-run
```

## Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   chmod 600 ~/.config/soroban/alice.key
   ```

2. **Network Timeout**
   ```bash
   # Increase timeout
   export ORBIT_TIMEOUT=30000
   ```

3. **Invalid Key Format**
   ```bash
   # Ensure key starts with 'S'
   soroban keys show alice
   ```

4. **Contract Not Found**
   ```bash
   # Verify contract exists
   soroban contract info --id CONTRACT_ID --network testnet
   ```

### Debug Information

Get detailed debug information:

```bash
# Enable debug logging
export ORBIT_LOG_LEVEL=debug

# Show version
orbit --version

# Show configuration
orbit config show
```

### Getting Help

- Use `--help` flag for any command
- Check error messages for suggestions
- Review logs for detailed information
- Join the community Discord for support

## Examples

### Complete Deployment Script

```bash
#!/bin/bash
# deploy-contract.sh

set -e

# Configuration
WASM_FILE="contracts/counter/target/wasm32-unknown-unknown/release/counter_contract.wasm"
KEY_FILE="$HOME/.config/soroban/alice.key"
NETWORK="testnet"

echo "Deploying contract..."
echo "WASM: $WASM_FILE"
echo "Key: $KEY_FILE"
echo "Network: $NETWORK"

# Check files exist
if [ ! -f "$WASM_FILE" ]; then
    echo "Error: WASM file not found: $WASM_FILE"
    exit 1
fi

if [ ! -f "$KEY_FILE" ]; then
    echo "Error: Key file not found: $KEY_FILE"
    exit 1
fi

# Build contract if needed
if [ ! -f "$WASM_FILE" ]; then
    echo "Building contract..."
    make build:contract
fi

# Deploy contract
echo "Deploying to $NETWORK..."
DEPLOY_OUTPUT=$(orbit deploy \
    --wasm "$WASM_FILE" \
    --key "$KEY_FILE" \
    --network "$NETWORK")

# Extract contract ID
CONTRACT_ID=$(echo "$DEPLOY_OUTPUT" | grep "Contract ID:" | cut -d' ' -f3)

if [ -z "$CONTRACT_ID" ]; then
    echo "Error: Failed to extract contract ID"
    echo "Output: $DEPLOY_OUTPUT"
    exit 1
fi

echo "Contract deployed successfully!"
echo "Contract ID: $CONTRACT_ID"

# Initialize contract
echo "Initializing contract..."
PUBLIC_KEY=$(soroban keys address alice)

orbit invoke \
    --contract "$CONTRACT_ID" \
    --method initialize \
    --args "[\"$PUBLIC_KEY\"]" \
    --key "$KEY_FILE" \
    --network "$NETWORK"

echo "Contract initialized!"

# Test contract
echo "Testing contract..."
orbit invoke \
    --contract "$CONTRACT_ID" \
    --method increment \
    --key "$KEY_FILE" \
    --network "$NETWORK"

RESULT=$(orbit invoke \
    --contract "$CONTRACT_ID" \
    --method get \
    --network "$NETWORK")

echo "Test result: $RESULT"

echo "Deployment and testing complete!"
echo "Contract ID: $CONTRACT_ID"
```

### Contract Interaction Script

```bash
#!/bin/bash
# interact-with-contract.sh

CONTRACT_ID="$1"
COMMAND="$2"
NETWORK="testnet"
KEY_FILE="$HOME/.config/soroban/alice.key"

if [ -z "$CONTRACT_ID" ]; then
    echo "Usage: $0 <contract-id> <command>"
    echo "Commands: increment, get, reset"
    exit 1
fi

case "$COMMAND" in
    "increment")
        echo "Incrementing counter..."
        orbit invoke \
            --contract "$CONTRACT_ID" \
            --method increment \
            --key "$KEY_FILE" \
            --network "$NETWORK"
        ;;
    "get")
        echo "Getting counter value..."
        orbit invoke \
            --contract "$CONTRACT_ID" \
            --method get \
            --network "$NETWORK"
        ;;
    "reset")
        echo "Resetting counter..."
        PUBLIC_KEY=$(soroban keys address alice)
        orbit invoke \
            --contract "$CONTRACT_ID" \
            --method reset \
            --args "[\"$PUBLIC_KEY\"]" \
            --key "$KEY_FILE" \
            --network "$NETWORK"
        ;;
    *)
        echo "Unknown command: $COMMAND"
        echo "Available commands: increment, get, reset"
        exit 1
        ;;
esac
```

This documentation provides a comprehensive guide to using the Orbit CLI. For more examples and advanced usage, see the project examples and test files.
