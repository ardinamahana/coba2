'use client'

import { useState } from 'react'

interface User {
  role: 'hospital' | 'health-service'
  hospital?: string
  name: string
}

interface NavigationProps {
  user: User
  onLogout: () => void
}

export default function Navigation({ user, onLogout }: NavigationProps) {
  const [expanded, setExpanded] = useState(true)

  const isHospital = user.role === 'hospital'

  return (
    <div className={`${expanded ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {expanded && <h2 className="font-bold text-lg">Haemodialysis</h2>}
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 hover:bg-slate-800 rounded transition-colors"
        >
          {expanded ? '←' : '→'}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {isHospital ? (
          <>
            <NavItem icon="📊" label="Overview" expanded={expanded} />
            <NavItem icon="📝" label="Input Data" expanded={expanded} />
            <NavItem icon="📋" label="Reports" expanded={expanded} />
            <NavItem icon="⚙️" label="Settings" expanded={expanded} />
          </>
        ) : (
          <>
            <NavItem icon="🌍" label="Province View" expanded={expanded} />
            <NavItem icon="🏥" label="Hospitals" expanded={expanded} />
            <NavItem icon="📈" label="Analytics" expanded={expanded} />
            <NavItem icon="⚙️" label="Settings" expanded={expanded} />
          </>
        )}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-700 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          {expanded && (
            <div className="text-sm">
              <p className="font-medium">{user.name}</p>
              <p className="text-slate-400 text-xs">{user.role === 'hospital' ? 'Hospital' : 'Health Service'}</p>
            </div>
          )}
        </div>
        <button
          onClick={onLogout}
          className="w-full text-left text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1"
        >
          {expanded ? 'Logout' : '↓'}
        </button>
      </div>
    </div>
  )
}

function NavItem({ icon, label, expanded }: { icon: string; label: string; expanded: boolean }) {
  return (
    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm">
      <span className="text-lg">{icon}</span>
      {expanded && <span>{label}</span>}
    </button>
  )
}
