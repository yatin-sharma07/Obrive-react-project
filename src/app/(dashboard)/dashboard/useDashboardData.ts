import { type UserRole } from '@/constants/dashboardConfig'
import { useEffect, useState } from 'react'

interface DashboardData {
  workloadMembers?: any[]
  projects?: any[]
  events?: any[]
  activities?: any[]
}

export function useDashboardData(userRole: UserRole) {
  const [data, setData] = useState<DashboardData>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch different data based on role
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/dashboard/${userRole}`)
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userRole])

  return { ...data, loading }
}