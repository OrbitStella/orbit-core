# Orbit CLI Reference

The Orbit CLI provides command-line tools for deploying and interacting with Stellar Soroban smart contracts.

## Installation

```bash
npm install -g @orbit-core/cli
```

## Commands

### orbit deploy

Deploy a Soroban smart contract to the Stellar network.

```bash
orbit deploy [options]
```

**Options:**

- `--wasm <path>` - Path to the compiled WASM file (required)
- `--key <path>` - Path to the private key file (required)
- `--network <network>` - Network to use: testnet, mainnet, futurenet (default: testnet)
- `--salt <string>` - Optional salt for contract deployment
- `--auth` - Enable authorization for deployment

**Example:**

```bash
orbit deploy \
  --wasm contracts/counter/target/wasm32-unknown-unknown/release/counter_contract.wasm \
  --key ~/.config/soroban/alice.key \
  --network testnet
```

### orbit invoke

Invoke a method on a deployed Soroban contract.

```bash
orbit invoke [options]
```

**Options:**

- `--contract <id>` - Contract ID to invoke (required)
- `--method <name>` - Method name to invoke (required)
- `--args <json>` - Arguments as JSON array (default: "[]")
- `--key <path>` - Path to private key file (required)
- `--network <network>` - Network to use: testnet, mainnet, futurenet (default: testnet)

**Example:**

```bash
orbit invoke \
  --contract CCB... \
  --method increment \
  --args '[]' \
  --key ~/.config/soroban/alice.key \
  --network testnet
```

### orbit account

Get account information from the Stellar network.

```bash
orbit account [options]
```

**Options:**

- `--public-key <key>` - Public key to query (required)
- `--network <network>` - Network to use: testnet, mainnet, futurenet (default: testnet)

**Example:**

```bash
orbit account \
  --public-key GABC... \
  --network testnet
```

### orbit status

Check the status of a deployed contract.

```bash
orbit status [options]
```

**Options:**

- `--contract-id <id>` - Contract ID to check (required)
- `--network <network>` - Network to use: testnet, mainnet, futurenet (default: testnet)

**Example:**

```bash
orbit status \
  --contract-id CCB... \
  --network testnet
```

## Environment Variables

The CLI supports the following environment variables:

- `ORBIT_NETWORK` - Default network to use (testnet, mainnet, futurenet)
- `ORBIT_RPC_URL` - Custom RPC URL for Soroban
- `ORBIT_HORIZON_URL` - Custom Horizon URL
- `ORBIT_KEY_PATH` - Default path to private key file

## Exit Codes

- `0` - Success
- `1` - General error
- `2` - Invalid arguments
- `3` - Network error
- `4` - Contract error

## Examples

### Deploy a contract with retry logic

```bash
orbit deploy \
  --wasm ./target/release/contract.wasm \
  --key ./private_key.txt \
  --network testnet
```

### Invoke a contract method

```bash
orbit invoke \
  --contract CCB... \
  --method get_value \
  --args '[]' \
  --key ./private_key.txt
```

### Check account balance

```bash
orbit account \
  --public-key GABC... \
  --network testnet
```

### Check contract status

```bash
orbit status \
  --contract-id CCB... \
  --network testnet
```

## Troubleshooting

### Network Connection Issues

If you encounter network connection issues, try:

1. Check your internet connection
2. Verify the network URL is correct
3. Check if the network is currently experiencing downtime

### Key File Issues

Ensure your private key file:
- Exists at the specified path
- Contains a valid Stellar private key
- Has appropriate permissions (read-only recommended)

### Contract Deployment Failures

Common causes:
- Insufficient account balance
- Invalid WASM file
- Network congestion
- Incorrect network passphrase

## See Also

- [SDK Documentation](./SDK_REFERENCE.md)
- [Quick Start Guide](../QUICK_START.md)
- [Contributing Guide](../CONTRIBUTING.md)
