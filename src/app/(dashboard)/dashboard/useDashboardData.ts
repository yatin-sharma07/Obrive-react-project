import { useEffect, useState, useCallback } from 'react'
import type { UserRole } from '@/constants/dashboardConfig'
import type { ProjectItem } from '@/components/dashboard/ProjectCard'
import { apiFetch } from '@/lib/api'

interface DashboardData {
  workloadMembers?: any[]
  projects?: ProjectItem[]
  events?: any[]
  activities?: any[]
  user?: {
    name: string;
    email: string;
    role: string;
  }
}

export function useDashboardData(userRole: UserRole) {
  const [data, setData] = useState<DashboardData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Fetching projects for role:', userRole)

      // Use apiFetch which handles BASE_URL and credentials (cookies)
      const response = await apiFetch('/projects', {
        method: 'GET'
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Please login again')
        }
        throw new Error(`Failed to fetch projects: ${response.status}`)
      }

      const result = await response.json()
      console.log('API Response:', result)
      
      if (result.success) {
          const mappedProjects: ProjectItem[] = result.data.map((p: any) => ({
            id: String(p.id),
            code: p.project_id || `PN${String(p.id).padStart(7, '0')}`,
            name: p.name,
            createdAtLabel: `Created ${new Date(p.created_at).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}`,
            priority: (p.priority?.charAt(0).toUpperCase() + p.priority?.slice(1).toLowerCase()) as any || 'Medium',
            allTasks: Math.max(0, Number(p.total_tasks) || 0),
            activeTasks: Math.max(0, (Number(p.total_tasks) || 0) - (Number(p.completed_tasks) || 0)),
            assignees: [], // Backend doesn't return names yet
            extraAssigneesCount: Math.max(0, Number(p.assignees_count) || 0)
          }))

          // Also try to get user info from localStorage as fallback for UI
          const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
          const user = userStr ? JSON.parse(userStr) : null

          setData({
            user: user,
            projects: mappedProjects,
            workloadMembers: [], 
            events: [],
            activities: []
          })
        } else {
          throw new Error(result.message || 'Failed to fetch projects')
        }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }, [userRole])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { 
    ...data,
    loading, 
    error,
    refetch: fetchData
  }
}