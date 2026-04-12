/**
 * Example usage of Orbit Core SDK
 */

import { createOrbitClient, NETWORKS } from '@orbit-core/sdk';

async function example() {
  // Create a client connected to testnet
  const client = createOrbitClient({
    networkUrl: NETWORKS.TESTNET.networkUrl,
    networkPassphrase: NETWORKS.TESTNET.networkPassphrase
  });

  try {
    // Get account information
    const publicKey = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF';
    const account = await client.getAccount(publicKey);
    
    console.log('Account:', account.accountId());
    console.log('Balance:', account.balances.map(b => `${b.asset_type}: ${b.balance}`).join(', '));

    // Set a contract ID for interaction
    const contractId = 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAA';
    client.setContractId(contractId);

    // Invoke a contract method (would need a deployed contract)
    // const result = await client.invokeContract('get_counter');
    // console.log('Contract result:', result);

  } catch (error) {
    console.error('Example failed:', error);
  }
}

// Run the example
if (require.main === module) {
  example().catch(console.error);
}

export { example };
