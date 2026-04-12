import { Command } from 'commander';
import chalk from 'chalk';
import { createOrbitClient, NETWORKS } from '@orbit-core/sdk';

export const accountCommand = new Command('account')
  .description('Get account information')
  .option('-p, --public-key <key>', 'Stellar public key')
  .option('-n, --network <network>', 'Network to use (testnet, futurenet, mainnet)', 'testnet')
  .action(async (options) => {
    try {
      console.log(chalk.blue('Fetching account information...'));

      // Validate inputs
      if (!options.publicKey) {
        console.error(chalk.red('Error: Public key is required'));
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
        networkPassphrase: network.networkPassphrase
      });

      // Get account
      console.log(chalk.yellow('Fetching account...'));
      const account = await client.getAccount(options.publicKey);

      console.log(chalk.green('Account information:'));
      console.log(chalk.cyan(`Public Key: ${account.accountId()}`));
      console.log(chalk.cyan(`Sequence: ${account.sequenceNumber()}`));
      console.log(chalk.cyan(`Balance: ${account.balances.map(b => `${b.asset_type}: ${b.balance}`).join(', ')}`));
      
      if (account.subentries.length > 0) {
        console.log(chalk.cyan(`Subentries: ${account.subentries.length}`));
      }

      if (account.signers.length > 0) {
        console.log(chalk.cyan('Signers:'));
        account.signers.forEach(signer => {
          console.log(chalk.white(`  - ${signer.key}: ${signer.weight}`));
        });
      }

      if (account.data) {
        console.log(chalk.cyan('Data:'));
        Object.entries(account.data).forEach(([key, value]) => {
          console.log(chalk.white(`  - ${key}: ${value}`));
        });
      }

    } catch (error) {
      console.error(chalk.red(`Failed to get account: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }
  });
