'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ProvinceStatistics from '@/components/statistics/province-statistics'
import HospitalComparison from '@/components/statistics/hospital-comparison'
import Navigation from '@/components/navigation/navigation'

interface User {
  role: 'hospital' | 'health-service'
  hospital?: string
  name: string
}

interface HealthServiceDashboardProps {
  user: User
  onLogout: () => void
}

export default function HealthServiceDashboard({ user, onLogout }: HealthServiceDashboardProps) {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semester' | 'yearly'>(
    'monthly',
  )

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar Navigation */}
      <Navigation user={user} onLogout={onLogout} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Provincial Overview</h1>
              <p className="text-slate-600 mt-1">Health Services Administrator</p>
            </div>
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>

          {/* Time Range Filter */}
          <div className="flex gap-2 flex-wrap">
            {(['daily', 'weekly', 'monthly', 'quarterly', 'semester', 'yearly'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <ProvinceStatistics timeRange={timeRange} />
            <HospitalComparison timeRange={timeRange} />
          </div>
        </div>
      </div>
    </div>
  )
}
