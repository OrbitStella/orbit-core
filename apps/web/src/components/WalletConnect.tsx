'use client'

import { useState } from 'react'
import { useWallet } from '@/lib/useWallet'

export function WalletConnect() {
  const { isConnected, publicKey, connect, disconnect } = useWallet()

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">
          {publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}
        </span>
        <button
          onClick={disconnect}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={connect}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Connect Wallet
    </button>
  )
}
