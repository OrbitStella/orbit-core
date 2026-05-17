'use client'

import { useState } from 'react'

interface DashboardStats {
  totalContracts: number
  activeContracts: number
  totalTransactions: number
  networkStatus: 'online' | 'offline'
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalContracts: 0,
    activeContracts: 0,
    totalTransactions: 0,
    networkStatus: 'online'
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Contracts"
        value={stats.totalContracts}
        icon="📦"
        color="blue"
      />
      <StatCard
        title="Active Contracts"
        value={stats.activeContracts}
        icon="✅"
        color="green"
      />
      <StatCard
        title="Total Transactions"
        value={stats.totalTransactions}
        icon="📊"
        color="purple"
      />
      <StatCard
        title="Network Status"
        value={stats.networkStatus}
        icon={stats.networkStatus === 'online' ? '🟢' : '🔴'}
        color={stats.networkStatus === 'online' ? 'green' : 'red'}
      />
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number | string
  icon: string
  color: 'blue' | 'green' | 'purple' | 'red'
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    red: 'bg-red-50 border-red-200'
  }

  return (
    <div className={`p-6 rounded-lg border-2 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
