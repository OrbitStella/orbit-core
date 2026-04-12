'use client'

import { useState } from 'react'
import { ContractInteraction } from '@/components/ContractInteraction'
import { AccountInfo } from '@/components/AccountInfo'
import { useWallet } from '@/lib/useWallet'

export default function Home() {
  const { isConnected, publicKey } = useWallet()

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Orbit Core Dashboard
          </h2>
          
          {isConnected ? (
            <div className="space-y-6">
              <AccountInfo publicKey={publicKey!} />
              <ContractInteraction />
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Connect your wallet to get started
              </h3>
              <p className="text-gray-600">
                Connect your Stellar wallet to deploy and interact with contracts
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
