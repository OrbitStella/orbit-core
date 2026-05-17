import { Command } from 'commander';
import chalk from 'chalk';
import { createOrbitClient, NETWORKS } from '@orbit-core/sdk';

export const statusCommand = new Command('status')
  .description('Check the status of a deployed contract')
  .option('--contract-id <id>', 'Contract ID to check')
  .option('--network <network>', 'Network to use (testnet, mainnet, futurenet)', 'testnet')
  .action(async (options) => {
    try {
      const network = NETWORKS[options.network.toUpperCase() as keyof typeof NETWORKS];
      if (!network) {
        console.error(chalk.red(`Invalid network: ${options.network}`));
        process.exit(1);
      }

      const client = createOrbitClient(network);
      
      if (!options.contractId) {
        console.error(chalk.red('Contract ID is required'));
        console.log(chalk.yellow('Usage: orbit status --contract-id <CONTRACT_ID>'));
        process.exit(1);
      }

      console.log(chalk.blue(`Checking contract status for: ${options.contractId}`));
      console.log(chalk.gray(`Network: ${options.network}`));
      
      // Get contract data
      try {
        const contractData = await client.getContractData('status', options.contractId);
        
        console.log(chalk.green('\n✓ Contract is active'));
        console.log(chalk.white(`Contract ID: ${options.contractId}`));
        console.log(chalk.white(`Network: ${options.network}`));
        
        if (contractData) {
          console.log(chalk.white(`Contract Data: ${JSON.stringify(contractData, null, 2)}`));
        }
      } catch (error) {
        console.log(chalk.red('\n✗ Contract not found or inactive'));
        console.log(chalk.gray(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }
  });
