'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface HospitalComparisonProps {
  timeRange: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semester' | 'yearly'
}

const hospitalComparison = [
  { name: 'City General', cases: 65, patients: 58 },
  { name: 'Provincial Med', cases: 48, patients: 42 },
  { name: 'Central Hospital', cases: 72, patients: 65 },
  { name: 'District Clinic', cases: 38, patients: 32 },
  { name: 'Regional Center', cases: 91, patients: 82 },
  { name: 'Community Health', cases: 45, patients: 40 },
  { name: 'Teaching Hospital', cases: 105, patients: 95 },
]

export default function HospitalComparison({ timeRange }: HospitalComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hospital Comparison</CardTitle>
        <CardDescription>Cases and patients by hospital ({timeRange})</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={hospitalComparison}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" angle={-45} textAnchor="end" height={100} />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="cases" fill="#0ea5e9" />
            <Bar dataKey="patients" fill="#06b6d4" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
