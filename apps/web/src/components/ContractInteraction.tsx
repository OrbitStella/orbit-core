'use client'

import { useState } from 'react'
import { createOrbitClient, NETWORKS } from '@orbit-core/sdk'

export function ContractInteraction() {
  const [contractId, setContractId] = useState('')
  const [method, setMethod] = useState('')
  const [args, setArgs] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInvoke = async () => {
    if (!contractId || !method) {
      setError('Contract ID and method are required')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const client = createOrbitClient({
        networkUrl: NETWORKS.TESTNET.networkUrl,
        rpcUrl: NETWORKS.TESTNET.rpcUrl,
        networkPassphrase: NETWORKS.TESTNET.networkPassphrase,
        contractId
      })

      // Parse arguments
      let parsedArgs: any[] = []
      if (args) {
        try {
          parsedArgs = JSON.parse(args)
        } catch (e) {
          throw new Error('Invalid arguments format. Use JSON array.')
        }
      }

      const invokeResult = await client.invokeContract(method, parsedArgs)
      setResult(invokeResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invocation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Interaction</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contract ID
          </label>
          <input
            type="text"
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
            placeholder="Enter contract ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Method Name
          </label>
          <input
            type="text"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            placeholder="Enter method name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Arguments (JSON array)
          </label>
          <textarea
            value={args}
            onChange={(e) => setArgs(e.target.value)}
            placeholder='["hello", 42, true]'
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleInvoke}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Invoking...' : 'Invoke Contract'}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium mb-2">Invocation Successful!</p>
            <p className="text-green-700 text-sm">
              Transaction ID: {result.transactionId}
            </p>
            <p className="text-green-700 text-sm mt-1">
              Result: {JSON.stringify(result.result)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
