import { Command } from 'commander';
import chalk from 'chalk';
import { createOrbitClient, NETWORKS, log, getErrorSuggestion, isOrbitError } from '@orbit-core/sdk';
import { Keypair } from '@stellar/stellar-sdk';
import fs from 'fs/promises';
import path from 'path';

export const deployCommand = new Command('deploy')
  .description('Deploy a Soroban contract')
  .option('-w, --wasm <path>', 'Path to WASM file')
  .option('-k, --key <path>', 'Path to private key file')
  .option('-n, --network <network>', 'Network to use (testnet, futurenet, mainnet)', 'testnet')
  .option('-s, --salt <salt>', 'Salt for contract deployment')
  .option('--auth', 'Enable contract authorization')
  .action(async (options) => {
    try {
      log.operation('CLI Contract Deployment', {
        wasmPath: options.wasm,
        keyPath: options.key,
        network: options.network,
        options: { salt: options.salt, auth: options.auth }
      });

      console.log(chalk.blue('Deploying contract...'));

      // Validate inputs
      if (!options.wasm) {
        const error = 'WASM file path is required';
        console.error(chalk.red(`Error: ${error}`));
        log.error('CLI validation failed', new Error(error), { option: 'wasm' });
        process.exit(1);
      }

      if (!options.key) {
        const error = 'Private key file path is required';
        console.error(chalk.red(`Error: ${error}`));
        log.error('CLI validation failed', new Error(error), { option: 'key' });
        process.exit(1);
      }

      // Load WASM file
      const wasmPath = path.resolve(options.wasm);
      log.debug('Loading WASM file', { wasmPath });
      
      let wasmCode: Buffer;
      try {
        wasmCode = await fs.readFile(wasmPath);
        log.info('WASM file loaded successfully', { 
          wasmPath, 
          size: wasmCode.length 
        });
      } catch (error) {
        const errorMessage = `Failed to read WASM file: ${wasmPath}`;
        console.error(chalk.red(`Error: ${errorMessage}`));
        log.error('WASM file read failed', error as Error, { wasmPath });
        process.exit(1);
      }
      
      // Load private key
      const keyPath = path.resolve(options.key);
      log.debug('Loading private key', { keyPath });
      
      let keypair: Keypair;
      try {
        const privateKey = await fs.readFile(keyPath, 'utf-8');
        keypair = Keypair.fromSecret(privateKey.trim());
        log.info('Private key loaded successfully', { 
          publicKey: keypair.publicKey() 
        });
      } catch (error) {
        const errorMessage = `Failed to read private key file: ${keyPath}`;
        console.error(chalk.red(`Error: ${errorMessage}`));
        log.error('Private key file read failed', error as Error, { keyPath });
        process.exit(1);
      }

      // Get network configuration
      const network = NETWORKS[options.network.toUpperCase() as keyof typeof NETWORKS];
      if (!network) {
        const error = `Invalid network "${options.network}"`;
        console.error(chalk.red(`Error: ${error}`));
        console.error(chalk.yellow('Available networks: testnet, futurenet, mainnet'));
        log.error('Network validation failed', new Error(error), { network: options.network });
        process.exit(1);
      }

      log.info('Using network configuration', { 
        network: options.network,
        networkUrl: network.networkUrl,
        rpcUrl: network.rpcUrl
      });

      // Create client
      log.debug('Creating OrbitClient');
      const client = createOrbitClient({
        networkUrl: network.networkUrl,
        rpcUrl: network.rpcUrl,
        networkPassphrase: network.networkPassphrase
      });

      // Deploy contract
      console.log(chalk.yellow('Deploying contract...'));
      log.info('Starting contract deployment');
      
      const result = await client.deployContract(wasmCode, keypair, {
        salt: options.salt,
        auth: options.auth
      });

      console.log(chalk.green('Contract deployed successfully!'));
      console.log(chalk.cyan(`Contract ID: ${result.contractId}`));
      console.log(chalk.cyan(`Transaction ID: ${result.transactionId}`));
      
      log.success('CLI Contract Deployment', {
        contractId: result.contractId,
        transactionId: result.transactionId
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(chalk.red(`Deployment failed: ${errorMessage}`));
      
      if (isOrbitError(error)) {
        const suggestion = getErrorSuggestion(error);
        if (suggestion) {
          console.error(chalk.yellow(`Suggestion: ${suggestion}`));
        }
      }
      
      log.failure('CLI Contract Deployment', error as Error, {
        wasmPath: options.wasm,
        keyPath: options.key,
        network: options.network
      });
      
      process.exit(1);
    }
  });
