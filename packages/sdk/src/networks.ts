/**
 * Network configuration presets for Stellar networks
 */

import { Networks as StellarNetworks } from '@stellar/stellar-sdk';
import type { NetworkConfig } from './types';

export const NETWORK_PRESETS: Record<string, NetworkConfig> = {
  testnet: {
    networkUrl: 'https://horizon-testnet.stellar.org',
    rpcUrl: 'https://soroban-testnet.stellar.org',
    networkPassphrase: StellarNetworks.TESTNET,
    friendbotUrl: 'https://friendbot.stellar.org'
  },
  mainnet: {
    networkUrl: 'https://horizon.stellar.org',
    rpcUrl: 'https://soroban.stellar.org',
    networkPassphrase: StellarNetworks.PUBLIC
  },
  futurenet: {
    networkUrl: 'https://horizon-futurenet.stellar.org',
    rpcUrl: 'https://rpc-futurenet.stellar.org',
    networkPassphrase: StellarNetworks.FUTURENET,
    friendbotUrl: 'https://friendbot-futurenet.stellar.org'
  },
  standalone: {
    networkUrl: 'http://localhost:8000',
    rpcUrl: 'http://localhost:8000/soroban/rpc',
    networkPassphrase: 'Standalone Network ; February 2017'
  }
};

export function getNetworkConfig(networkName: string): NetworkConfig {
  const config = NETWORK_PRESETS[networkName.toLowerCase()];
  if (!config) {
    throw new Error(`Unknown network: ${networkName}. Available networks: ${Object.keys(NETWORK_PRESETS).join(', ')}`);
  }
  return config;
}

export function listAvailableNetworks(): string[] {
  return Object.keys(NETWORK_PRESETS);
}
