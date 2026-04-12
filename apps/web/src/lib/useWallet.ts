'use client'

import { useState, useEffect, createContext, useContext } from 'react'

interface WalletContextType {
  isConnected: boolean
  publicKey: string | null
  connect: () => void
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | null>(null)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)

  const connect = () => {
    // Mock wallet connection - in a real app, this would integrate with Freighter, Rabet, etc.
    const mockPublicKey = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF'
    setPublicKey(mockPublicKey)
    setIsConnected(true)
    localStorage.setItem('walletConnected', 'true')
    localStorage.setItem('publicKey', mockPublicKey)
  }

  const disconnect = () => {
    setPublicKey(null)
    setIsConnected(false)
    localStorage.removeItem('walletConnected')
    localStorage.removeItem('publicKey')
  }

  useEffect(() => {
    // Check for existing wallet connection on mount
    const connected = localStorage.getItem('walletConnected')
    const storedPublicKey = localStorage.getItem('publicKey')
    
    if (connected === 'true' && storedPublicKey) {
      setPublicKey(storedPublicKey)
      setIsConnected(true)
    }
  }, [])

  return (
    <WalletContext.Provider value={{ isConnected, publicKey, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
