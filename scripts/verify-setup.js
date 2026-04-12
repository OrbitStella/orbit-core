#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Verifying Orbit Core monorepo setup...\n');

// Check required directories
const requiredDirs = [
  'apps/web',
  'packages/sdk',
  'packages/cli', 
  'packages/shared-utils',
  'contracts/counter',
  'tooling',
  'scripts',
  'examples'
];

console.log('Checking directory structure:');
requiredDirs.forEach(dir => {
  const exists = fs.existsSync(dir);
  console.log(`  ${exists ? 'OK' : 'MISSING'}: ${dir}`);
});

// Check required files
const requiredFiles = [
  'package.json',
  'pnpm-workspace.yaml',
  'tsconfig.json',
  '.eslintrc.js',
  '.prettierrc',
  '.gitignore',
  'README.md'
];

console.log('\nChecking root configuration files:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? 'OK' : 'MISSING'}: ${file}`);
});

// Check package.json files
const packageFiles = [
  'packages/sdk/package.json',
  'packages/cli/package.json',
  'packages/shared-utils/package.json',
  'apps/web/package.json',
  'contracts/counter/package.json'
];

console.log('\nChecking package.json files:');
packageFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? 'OK' : 'MISSING'}: ${file}`);
});

// Check TypeScript files
const tsFiles = [
  'packages/sdk/src/index.ts',
  'packages/cli/src/cli.ts',
  'packages/shared-utils/src/index.ts',
  'apps/web/src/app/page.tsx'
];

console.log('\nChecking TypeScript files:');
tsFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? 'OK' : 'MISSING'}: ${file}`);
});

// Check Rust contract
const rustFiles = [
  'contracts/counter/Cargo.toml',
  'contracts/counter/src/lib.rs'
];

console.log('\nChecking Rust contract files:');
rustFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? 'OK' : 'MISSING'}: ${file}`);
});

console.log('\nVerification complete!');
console.log('\nNext steps:');
console.log('1. Install Node.js >= 18.0.0 and pnpm >= 8.0.0');
console.log('2. Run: pnpm install');
console.log('3. Run: pnpm build');
console.log('4. For contracts: Install Rust and run cargo build in contracts/counter');
