'use client'

import { useState } from 'react'

interface ContractFormData {
  contractId: string
  method: string
  args: string
}

export function ContractForm() {
  const [formData, setFormData] = useState<ContractFormData>({
    contractId: '',
    method: '',
    args: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Simulate contract interaction
      await new Promise(resolve => setTimeout(resolve, 1000))
      setResult(`Successfully invoked ${formData.method} on contract ${formData.contractId}`)
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Contract Interaction</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contractId" className="block text-sm font-medium text-gray-700 mb-1">
            Contract ID
          </label>
          <input
            type="text"
            id="contractId"
            value={formData.contractId}
            onChange={(e) => setFormData({ ...formData, contractId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter contract ID"
            required
          />
        </div>

        <div>
          <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
            Method Name
          </label>
          <input
            type="text"
            id="method"
            value={formData.method}
            onChange={(e) => setFormData({ ...formData, method: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter method name"
            required
          />
        </div>

        <div>
          <label htmlFor="args" className="block text-sm font-medium text-gray-700 mb-1">
            Arguments (JSON array)
          </label>
          <textarea
            id="args"
            value={formData.args}
            onChange={(e) => setFormData({ ...formData, args: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder='["arg1", "arg2"]'
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Processing...' : 'Invoke Method'}
        </button>
      </form>

      {result && (
        <div className={`mt-4 p-4 rounded-md ${result.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {result}
        </div>
      )}
    </div>
  )
}
