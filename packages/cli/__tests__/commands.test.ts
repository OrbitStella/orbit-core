import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Command } from 'commander'
import chalk from 'chalk'

// Mock dependencies
vi.mock('@orbit-core/sdk', () => ({
  createOrbitClient: vi.fn(),
  NETWORKS: {
    TESTNET: {
      networkUrl: 'https://horizon-testnet.stellar.org',
      rpcUrl: 'https://soroban-testnet.stellar.org',
      networkPassphrase: 'Test SDF Network ; September 2015'
    }
  }
}))

vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn()
}))

vi.mock('path', () => ({
  resolve: vi.fn((path: string) => `resolved/${path}`),
  join: vi.fn((...paths: string[]) => paths.join('/'))
}))

// Mock console methods to avoid noise in tests
const originalConsole = global.console
beforeEach(() => {
  global.console = {
    ...originalConsole,
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn()
  }
  vi.clearAllMocks()
})

describe('CLI Commands', () => {
  describe('Deploy Command', () => {
    it('should validate required options', async () => {
      const { deployCommand } = await import('../src/commands/deploy')
      
      // Mock process.exit to prevent actual exit
      const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called')
      })

      // Test without wasm file
      await expect(deployCommand.action({})).rejects.toThrow('process.exit called')
      expect(global.console.error).toHaveBeenCalledWith(chalk.red('Error: WASM file path is required'))

      // Test without key file
      await expect(deployCommand.action({ wasm: 'test.wasm' })).rejects.toThrow('process.exit called')
      expect(global.console.error).toHaveBeenCalledWith(chalk.red('Error: Private key file path is required'))

      mockExit.mockRestore()
    })

    it('should handle invalid network', async () => {
      const { deployCommand } = await import('../src/commands/deploy')
      
      const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called')
      })

      await expect(deployCommand.action({ 
        wasm: 'test.wasm', 
        key: 'test.key', 
        network: 'invalid' 
      })).rejects.toThrow('process.exit called')
      
      expect(global.console.error).toHaveBeenCalledWith(chalk.red('Error: Invalid network "invalid"'))

      mockExit.mockRestore()
    })
  })

  describe('Invoke Command', () => {
    it('should validate required options', async () => {
      const { invokeCommand } = await import('../src/commands/invoke')
      
      const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called')
      })

      // Test without contract ID
      await expect(invokeCommand.action({})).rejects.toThrow('process.exit called')
      expect(global.console.error).toHaveBeenCalledWith(chalk.red('Error: Contract ID is required'))

      // Test without method name
      await expect(invokeCommand.action({ contract: 'test-contract' })).rejects.toThrow('process.exit called')
      expect(global.console.error).toHaveBeenCalledWith(chalk.red('Error: Method name is required'))

      mockExit.mockRestore()
    })

    it('should handle invalid arguments format', async () => {
      const { invokeCommand } = await import('../src/commands/invoke')
      
      const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called')
      })

      await expect(invokeCommand.action({ 
        contract: 'test-contract', 
        method: 'test_method',
        args: 'invalid-json'
      })).rejects.toThrow('process.exit called')
      
      expect(global.console.error).toHaveBeenCalledWith(chalk.red('Error: Invalid arguments format. Expected JSON array.'))

      mockExit.mockRestore()
    })

    it('should parse valid arguments', async () => {
      const { invokeCommand } = await import('../src/commands/invoke')
      
      const mockFs = await import('fs/promises')
      vi.mocked(mockFs.readFile).mockResolvedValue('test-key-content')
      
      // Mock SDK client
      const mockSdk = await import('@orbit-core/sdk')
      const mockClient = {
        invokeContract: vi.fn().mockResolvedValue({
          result: 'test-result',
          transactionId: 'test-tx-id'
        })
      }
      vi.mocked(mockSdk.createOrbitClient).mockReturnValue(mockClient)

      // Mock Keypair
      const mockStellar = await import('@stellar/stellar-sdk')
      vi.mocked(mockStellar.Keypair.fromSecret).mockReturnValue({ publicKey: () => 'test-public-key' } as any)

      await invokeCommand.action({
        contract: 'test-contract',
        method: 'test_method',
        args: '["string", 42, true]'
      })

      expect(mockClient.invokeContract).toHaveBeenCalledWith('test_method', ['string', 42, true], expect.any(Object))
    })
  })

  describe('Account Command', () => {
    it('should validate public key', async () => {
      const { accountCommand } = await import('../src/commands/account')
      
      const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called')
      })

      await expect(accountCommand.action({})).rejects.toThrow('process.exit called')
      expect(global.console.error).toHaveBeenCalledWith(chalk.red('Error: Public key is required'))

      mockExit.mockRestore()
    })

    it('should handle invalid network', async () => {
      const { accountCommand } = await import('../src/commands/account')
      
      const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called')
      })

      await expect(accountCommand.action({ 
        publicKey: 'test-key',
        network: 'invalid'
      })).rejects.toThrow('process.exit called')
      
      expect(global.console.error).toHaveBeenCalledWith(chalk.red('Error: Invalid network "invalid"'))

      mockExit.mockRestore()
    })

    it('should fetch account information', async () => {
      const { accountCommand } = await import('../src/commands/account')
      
      // Mock SDK client
      const mockSdk = await import('@orbit-core/sdk')
      const mockClient = {
        getAccount: vi.fn().mockResolvedValue({
          accountId: () => 'test-account-id',
          sequenceNumber: () => '12345',
          balances: [{ asset_type: 'native', balance: '1000.0000000' }],
          subentries: [],
          signers: [],
          data: {}
        })
      }
      vi.mocked(mockSdk.createOrbitClient).mockReturnValue(mockClient)

      await accountCommand.action({
        publicKey: 'test-key',
        network: 'testnet'
      })

      expect(mockClient.getAccount).toHaveBeenCalledWith('test-key')
      expect(global.console.log).toHaveBeenCalledWith(chalk.green('Account information:'))
    })

    it('should handle account fetch errors', async () => {
      const { accountCommand } = await import('../src/commands/account')
      
      const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called')
      })

      // Mock SDK client with error
      const mockSdk = await import('@orbit-core/sdk')
      const mockClient = {
        getAccount: vi.fn().mockRejectedValue(new Error('Account not found'))
      }
      vi.mocked(mockSdk.createOrbitClient).mockReturnValue(mockClient)

      await expect(accountCommand.action({
        publicKey: 'invalid-key',
        network: 'testnet'
      })).rejects.toThrow('process.exit called')
      
      expect(global.console.error).toHaveBeenCalledWith(chalk.red('Failed to get account: Account not found'))

      mockExit.mockRestore()
    })
  })
})

describe('CLI Integration', () => {
  it('should have all required commands', async () => {
    const { deployCommand, invokeCommand, accountCommand } = await import('../src/commands')
    
    expect(deployCommand).toBeDefined()
    expect(invokeCommand).toBeDefined()
    expect(accountCommand).toBeDefined()
    
    expect(deployCommand.name()).toBe('deploy')
    expect(invokeCommand.name()).toBe('invoke')
    expect(accountCommand.name()).toBe('account')
  })

  it('should have proper command descriptions', async () => {
    const { deployCommand, invokeCommand, accountCommand } = await import('../src/commands')
    
    expect(deployCommand.description()).toBe('Deploy a Soroban contract')
    expect(invokeCommand.description()).toBe('Invoke a contract method')
    expect(accountCommand.description()).toBe('Get account information')
  })

  it('should have proper command options', async () => {
    const { deployCommand } = await import('../src/commands')
    
    const options = deployCommand.options
    expect(options).toContainEqual(expect.objectContaining({ flags: '-w, --wasm <path>' }))
    expect(options).toContainEqual(expect.objectContaining({ flags: '-k, --key <path>' }))
    expect(options).toContainEqual(expect.objectContaining({ flags: '-n, --network <network>' }))
  })
})
