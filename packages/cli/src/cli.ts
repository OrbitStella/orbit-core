#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { deployCommand } from './commands/deploy';
import { invokeCommand } from './commands/invoke';
import { accountCommand } from './commands/account';

const program = new Command();

program
  .name('orbit')
  .description('CLI tool for Orbit Core deployment and interaction')
  .version('1.0.0');

// Add commands
program.addCommand(deployCommand);
program.addCommand(invokeCommand);
program.addCommand(accountCommand);

// Global error handler
program.configureOutput({
  writeErr: (str: string) => process.stderr.write(chalk.red(str)),
  writeOut: (str: string) => process.stdout.write(str)
});

program.parse();
