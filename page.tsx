'use client'

import { useState } from 'react'
import LoginPage from '@/components/auth/login-page'
import HospitalDashboard from '@/components/dashboards/hospital-dashboard'
import HealthServiceDashboard from '@/components/dashboards/health-service-dashboard'

type UserRole = 'hospital' | 'health-service' | null

export default function Home() {
  const [currentUser, setCurrentUser] = useState<{ role: UserRole; hospital?: string; name: string } | null>(null)

  const handleLogin = (role: UserRole, hospitalName?: string, userName?: string) => {
    setCurrentUser({ role, hospital: hospitalName, name: userName || '' })
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div>
      {currentUser.role === 'hospital' && (
        <HospitalDashboard user={currentUser} onLogout={handleLogout} />
      )}
      {currentUser.role === 'health-service' && (
        <HealthServiceDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  )
}
