'use client'

import { useState, useEffect } from 'react'
import { createOrbitClient, NETWORKS } from '@orbit-core/sdk'

interface AccountInfoProps {
  publicKey: string
}

export function AccountInfo({ publicKey }: AccountInfoProps) {
  const [account, setAccount] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const client = createOrbitClient({
          networkUrl: NETWORKS.TESTNET.networkUrl,
          rpcUrl: NETWORKS.TESTNET.rpcUrl,
          networkPassphrase: NETWORKS.TESTNET.networkPassphrase
        })
        
        const accountData = await client.getAccount(publicKey)
        setAccount(accountData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch account')
      } finally {
        setLoading(false)
      }
    }

    fetchAccount()
  }, [publicKey])

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-32 rounded"></div>
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
      <div className="space-y-2">
        <div>
          <span className="text-sm font-medium text-gray-500">Public Key:</span>
          <p className="text-sm text-gray-900 font-mono">{publicKey}</p>
        </div>
        {account && (
          <>
            <div>
              <span className="text-sm font-medium text-gray-500">Sequence:</span>
              <p className="text-sm text-gray-900">{account.sequenceNumber()}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Balance:</span>
              <p className="text-sm text-gray-900">
                {account.balances.map((b: any) => `${b.asset_type}: ${b.balance}`).join(', ')}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
