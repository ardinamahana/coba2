'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LoginPageProps {
  onLogin: (role: 'hospital' | 'health-service', hospitalName?: string, userName?: string) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<'hospital' | 'health-service' | null>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password && selectedRole) {
      const hospitalName = selectedRole === 'hospital' ? 'City General Hospital' : undefined
      onLogin(selectedRole, hospitalName, email.split('@')[0])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-blue-600 text-white mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Haemodialysis Reporting</h1>
          <p className="text-slate-600 mt-2">Provincial Case Management System</p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setSelectedRole('hospital')}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedRole === 'hospital'
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="text-2xl mb-2">🏥</div>
            <div className="font-semibold text-sm text-slate-900">Hospital</div>
            <div className="text-xs text-slate-500">Data Entry</div>
          </button>

          <button
            onClick={() => setSelectedRole('health-service')}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedRole === 'health-service'
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="text-2xl mb-2">🏛️</div>
            <div className="font-semibold text-sm text-slate-900">Health Service</div>
            <div className="text-xs text-slate-500">Province Overview</div>
          </button>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              {selectedRole === 'hospital'
                ? 'Enter your hospital credentials'
                : selectedRole === 'health-service'
                  ? 'Enter your health service credentials'
                  : 'Select a role to continue'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!selectedRole}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!selectedRole}
                />
              </div>
              <Button type="submit" className="w-full" disabled={!selectedRole || !email || !password}>
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Note */}
        <p className="text-center text-xs text-slate-500 mt-4">
          Use any email and password to demo the system (e.g., hospital@test.com / password123)
        </p>
      </div>
    </div>
  )
}
