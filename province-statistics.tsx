'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ProvinceStatisticsProps {
  timeRange: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semester' | 'yearly'
}

const provinceData = [
  { period: 'Week 1', cases: 145, hospitals: 12 },
  { period: 'Week 2', cases: 168, hospitals: 12 },
  { period: 'Week 3', cases: 152, hospitals: 12 },
  { period: 'Week 4', cases: 189, hospitals: 12 },
]

export default function ProvinceStatistics({ timeRange }: ProvinceStatisticsProps) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Cases" value="654" change="+18%" color="blue" />
        <StatCard title="Active Hospitals" value="12" change="No change" color="green" />
        <StatCard title="Active Patients" value="589" change="+12%" color="purple" />
        <StatCard title="Avg Cases/Hospital" value="54.5" change="+2%" color="orange" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cases Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Province Cases Trend</CardTitle>
            <CardDescription>Breakdown by {timeRange}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={provinceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="cases" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hospital Participation */}
        <Card>
          <CardHeader>
            <CardTitle>Hospital Participation</CardTitle>
            <CardDescription>Cases by hospital</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={provinceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="cases" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, color }: { title: string; value: string; change: string; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200',
  }

  const textColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  }

  return (
    <Card className={`${colorClasses[color as keyof typeof colorClasses]}`}>
      <CardContent className="pt-6">
        <p className="text-sm text-slate-600 mb-2">{title}</p>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        <p className={`text-sm mt-2 ${textColors[color as keyof typeof textColors]}`}>{change}</p>
      </CardContent>
    </Card>
  )
}
