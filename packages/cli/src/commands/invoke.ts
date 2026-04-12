import { Command } from 'commander';
import chalk from 'chalk';
import { createOrbitClient, NETWORKS } from '@orbit-core/sdk';
import { Keypair } from '@stellar/stellar-sdk';
import fs from 'fs/promises';
import path from 'path';

export const invokeCommand = new Command('invoke')
  .description('Invoke a contract method')
  .option('-c, --contract <id>', 'Contract ID')
  .option('-m, --method <name>', 'Method name to invoke')
  .option('-a, --args <args>', 'Arguments (JSON array)', '[]')
  .option('-k, --key <path>', 'Path to private key file')
  .option('-n, --network <network>', 'Network to use (testnet, futurenet, mainnet)', 'testnet')
  .action(async (options) => {
    try {
      console.log(chalk.blue('Invoking contract method...'));

      // Validate inputs
      if (!options.contract) {
        console.error(chalk.red('Error: Contract ID is required'));
        process.exit(1);
      }

      if (!options.method) {
        console.error(chalk.red('Error: Method name is required'));
        process.exit(1);
      }

      // Load private key
      let keypair: Keypair | undefined;
      if (options.key) {
        const keyPath = path.resolve(options.key);
        const privateKey = await fs.readFile(keyPath, 'utf-8');
        keypair = Keypair.fromSecret(privateKey.trim());
      }

      // Parse arguments
      let args: any[] = [];
      try {
        const parsedArgs = JSON.parse(options.args);
        args = parsedArgs;
      } catch (error) {
        console.error(chalk.red('Error: Invalid arguments format. Expected JSON array.'));
        process.exit(1);
      }

      // Get network configuration
      const network = NETWORKS[options.network.toUpperCase() as keyof typeof NETWORKS];
      if (!network) {
        console.error(chalk.red(`Error: Invalid network "${options.network}"`));
        process.exit(1);
      }

      // Create client
      const client = createOrbitClient({
        networkUrl: network.networkUrl,
        rpcUrl: network.rpcUrl,
        networkPassphrase: network.networkPassphrase,
        contractId: options.contract
      });

      // Invoke contract
      console.log(chalk.yellow(`Invoking method "${options.method}"...`));
      const result = await client.invokeContract(options.method, args, keypair);

      console.log(chalk.green('Method invoked successfully!'));
      console.log(chalk.cyan(`Transaction ID: ${result.transactionId}`));
      console.log(chalk.cyan(`Result: ${JSON.stringify(result.result)}`));

    } catch (error) {
      console.error(chalk.red(`Invocation failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }
  });
