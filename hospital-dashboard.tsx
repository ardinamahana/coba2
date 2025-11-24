'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DataInputForm from '@/components/forms/data-input-form'
import HospitalStatistics from '@/components/statistics/hospital-statistics'
import PatientTable from '@/components/tables/patient-table'
import Navigation from '@/components/navigation/navigation'

interface User {
  role: 'hospital' | 'health-service'
  hospital?: string
  name: string
}

interface HospitalDashboardProps {
  user: User
  onLogout: () => void
}

export default function HospitalDashboard({ user, onLogout }: HospitalDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'input' | 'reports'>('overview')

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
              <h1 className="text-3xl font-bold text-slate-900">{user.hospital}</h1>
              <p className="text-slate-600 mt-1">Welcome back, {user.name}</p>
            </div>
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('input')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'input'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Input Data
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'reports'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Reports
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && <HospitalStatistics />}
          {activeTab === 'input' && <DataInputForm hospital={user.hospital || ''} />}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Cases Report</CardTitle>
                  <CardDescription>View and export all recorded patient cases</CardDescription>
                </CardHeader>
                <CardContent>
                  <PatientTable />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
