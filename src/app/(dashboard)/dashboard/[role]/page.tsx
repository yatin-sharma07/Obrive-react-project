'use client'

import { useParams } from 'next/navigation'
import { dashboardConfigs, type UserRole } from '@/constants/dashboardConfig'

export default function RolePage() {
  const params = useParams()
  const role = params.role as UserRole

  // Validate role exists
  if (!dashboardConfigs[role]) {
    return <div className="p-4 text-red-500">Invalid role: {role}</div>
  }

  // Page is empty - layout handles everything
  // Just here for routing purposes
  return null
}