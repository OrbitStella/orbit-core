import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock the SDK
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

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Components', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('WalletConnect', async () => {
    const { WalletConnect } = await import('../src/components/WalletConnect')
    
    it('should show connect button when not connected', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      render(<WalletConnect />)
      
      const connectButton = screen.getByText('Connect Wallet')
      expect(connectButton).toBeInTheDocument()
      expect(connectButton).toHaveClass('px-4', 'py-2', 'bg-blue-600', 'text-white')
    })

    it('should show wallet info when connected', () => {
      localStorageMock.getItem.mockReturnValue('true')
      localStorageMock.getItem.mockReturnValue('GABC...XYZ')
      
      render(<WalletConnect />)
      
      const publicKey = screen.getByText(/GABC/)
      const disconnectButton = screen.getByText('Disconnect')
      
      expect(publicKey).toBeInTheDocument()
      expect(disconnectButton).toBeInTheDocument()
      expect(disconnectButton).toHaveClass('bg-red-600', 'text-white')
    })

    it('should connect wallet when button clicked', async () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      render(<WalletConnect />)
      
      const connectButton = screen.getByText('Connect Wallet')
      fireEvent.click(connectButton)
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('walletConnected', 'true')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('publicKey', 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF')
    })

    it('should disconnect wallet when button clicked', async () => {
      localStorageMock.getItem.mockReturnValue('true')
      localStorageMock.getItem.mockReturnValue('GABC...XYZ')
      
      render(<WalletConnect />)
      
      const disconnectButton = screen.getByText('Disconnect')
      fireEvent.click(disconnectButton)
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('walletConnected')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('publicKey')
    })
  })

  describe('AccountInfo', async () => {
    const { AccountInfo } = await import('../src/components/AccountInfo')
    
    it('should show loading state initially', () => {
      render(<AccountInfo publicKey="test-public-key" />)
      
      const loadingElement = screen.getByText('Loading...')
      expect(loadingElement).toBeInTheDocument()
    })

    it('should show account information when loaded', async () => {
      const mockSdk = await import('@orbit-core/sdk')
      const mockClient = {
        getAccount: vi.fn().mockResolvedValue({
          accountId: () => 'test-account-id',
          sequenceNumber: () => '12345',
          balances: [
            { asset_type: 'native', balance: '1000.0000000' },
            { asset_type: 'credit_alphanum4:USD', balance: '500.0000000' }
          ],
          subentries: [],
          signers: [
            { key: 'GABC...XYZ', weight: 1 }
          ],
          data: {
            'key1': 'value1',
            'key2': 'value2'
          }
        })
      }
      vi.mocked(mockSdk.createOrbitClient).mockReturnValue(mockClient)
      
      render(<AccountInfo publicKey="test-public-key" />)
      
      await waitFor(() => {
        expect(screen.getByText('test-account-id')).toBeInTheDocument()
        expect(screen.getByText('12345')).toBeInTheDocument()
        expect(screen.getByText(/native: 1000.0000000/)).toBeInTheDocument()
        expect(screen.getByText(/USD: 500.0000000/)).toBeInTheDocument()
        expect(screen.getByText('GABC...XYZ')).toBeInTheDocument()
        expect(screen.getByText('value1')).toBeInTheDocument()
        expect(screen.getByText('value2')).toBeInTheDocument()
      })
    })

    it('should show error when account fetch fails', async () => {
      const mockSdk = await import('@orbit-core/sdk')
      const mockClient = {
        getAccount: vi.fn().mockRejectedValue(new Error('Account not found'))
      }
      vi.mocked(mockSdk.createOrbitClient).mockReturnValue(mockClient)
      
      render(<AccountInfo publicKey="invalid-public-key" />)
      
      await waitFor(() => {
        const errorElement = screen.getByText(/Error: Account not found/)
        expect(errorElement).toBeInTheDocument()
      })
    })
  })

  describe('ContractInteraction', async () => {
    const { ContractInteraction } = await import('../src/components/ContractInteraction')
    
    it('should render form inputs', () => {
      render(<ContractInteraction />)
      
      expect(screen.getByPlaceholderText('Enter contract ID')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter method name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('["hello", 42, true]')).toBeInTheDocument()
      expect(screen.getByText('Invoke Contract')).toBeInTheDocument()
    })

    it('should show error when required fields are missing', async () => {
      render(<ContractInteraction />)
      
      const invokeButton = screen.getByText('Invoke Contract')
      fireEvent.click(invokeButton)
      
      await waitFor(() => {
        const errorElement = screen.getByText(/Contract ID and method are required/)
        expect(errorElement).toBeInTheDocument()
      })
    })

    it('should show error for invalid arguments format', async () => {
      render(<ContractInteraction />)
      
      const contractIdInput = screen.getByPlaceholderText('Enter contract ID')
      const methodInput = screen.getByPlaceholderText('Enter method name')
      const argsInput = screen.getByPlaceholderText('["hello", 42, true]')
      
      fireEvent.change(contractIdInput, { target: { value: 'test-contract' } })
      fireEvent.change(methodInput, { target: { value: 'test_method' } })
      fireEvent.change(argsInput, { target: { value: 'invalid-json' } })
      
      const invokeButton = screen.getByText('Invoke Contract')
      fireEvent.click(invokeButton)
      
      await waitFor(() => {
        const errorElement = screen.getByText(/Invalid arguments format. Use JSON array./)
        expect(errorElement).toBeInTheDocument()
      })
    })

    it('should invoke contract successfully', async () => {
      const mockSdk = await import('@orbit-core/sdk')
      const mockClient = {
        invokeContract: vi.fn().mockResolvedValue({
          result: 'success',
          transactionId: 'test-tx-id'
        })
      }
      vi.mocked(mockSdk.createOrbitClient).mockReturnValue(mockClient)
      
      render(<ContractInteraction />)
      
      const contractIdInput = screen.getByPlaceholderText('Enter contract ID')
      const methodInput = screen.getByPlaceholderText('Enter method name')
      const argsInput = screen.getByPlaceholderText('["hello", 42, true]')
      
      fireEvent.change(contractIdInput, { target: { value: 'test-contract' } })
      fireEvent.change(methodInput, { target: { value: 'test_method' } })
      fireEvent.change(argsInput, { target: { value: '["arg1", 42]' } })
      
      const invokeButton = screen.getByText('Invoke Contract')
      fireEvent.click(invokeButton)
      
      await waitFor(() => {
        expect(screen.getByText(/Invocation Successful!/)).toBeInTheDocument()
        expect(screen.getByText(/Transaction ID: test-tx-id/)).toBeInTheDocument()
        expect(screen.getByText(/Result: "success"/)).toBeInTheDocument()
      })
      
      expect(mockClient.invokeContract).toHaveBeenCalledWith('test_method', ['arg1', 42])
    })

    it('should show loading state during invocation', async () => {
      const mockSdk = await import('@orbit-core/sdk')
      const mockClient = {
        invokeContract: vi.fn(() => new Promise(resolve => setTimeout(() => resolve({
          result: 'success',
          transactionId: 'test-tx-id'
        }), 100)))
      }
      vi.mocked(mockSdk.createOrbitClient).mockReturnValue(mockClient)
      
      render(<ContractInteraction />)
      
      const contractIdInput = screen.getByPlaceholderText('Enter contract ID')
      const methodInput = screen.getByPlaceholderText('Enter method name')
      
      fireEvent.change(contractIdInput, { target: { value: 'test-contract' } })
      fireEvent.change(methodInput, { target: { value: 'test_method' } })
      
      const invokeButton = screen.getByText('Invoke Contract')
      fireEvent.click(invokeButton)
      
      // Should show loading state
      expect(screen.getByText('Invoking...')).toBeInTheDocument()
      expect(invokeButton).toBeDisabled()
      
      // Wait for completion
      await waitFor(() => {
        expect(screen.getByText(/Invocation Successful!/)).toBeInTheDocument()
      }, { timeout: 200 })
    })
  })
})
