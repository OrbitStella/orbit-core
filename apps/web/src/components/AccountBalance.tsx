'use client'

import { useState, useEffect } from 'react'

interface AccountBalanceProps {
  publicKey: string
}

interface BalanceInfo {
  xlm: number
  usd: number
  lastUpdated: Date
}

export function AccountBalance({ publicKey }: AccountBalanceProps) {
  const [balance, setBalance] = useState<BalanceInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching balance
    const fetchBalance = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setBalance({
        xlm: 1000.5,
        usd: 150.75,
        lastUpdated: new Date()
      })
      setIsLoading(false)
    }

    fetchBalance()
  }, [publicKey])

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    )
  }

  if (!balance) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Unable to load balance</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Account Balance</h2>
        <span className="text-sm text-gray-500">
          Last updated: {balance.lastUpdated.toLocaleString()}
        </span>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <p className="text-sm opacity-80 mb-1">XLM Balance</p>
          <p className="text-3xl font-bold">{balance.xlm.toFixed(2)} XLM</p>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">USD Value</p>
            <p className="text-lg font-semibold text-gray-900">${balance.usd.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Exchange Rate</p>
            <p className="text-lg font-semibold text-gray-900">$0.15</p>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          <p>Public Key: {publicKey.slice(0, 8)}...{publicKey.slice(-8)}</p>
        </div>
      </div>
    </div>
  )
}
