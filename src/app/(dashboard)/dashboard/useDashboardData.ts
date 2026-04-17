import { useEffect, useState } from 'react'
import type { UserRole } from '@/constants/dashboardConfig'

interface DashboardData {
  workloadMembers?: any[]
  projects?: any[]
  events?: any[]
  activities?: any[]
}

export function useDashboardData(userRole: UserRole) {
  const [data, setData] = useState<DashboardData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/dashboard/${userRole}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`)
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        console.error('Failed to fetch dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userRole])

  return { 
    ...data,
    loading, 
    error 
  }
}