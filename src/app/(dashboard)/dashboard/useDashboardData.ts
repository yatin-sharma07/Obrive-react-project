import { useEffect, useState, useCallback } from 'react'
import type { UserRole } from '@/constants/dashboardConfig'
import type { ProjectItem } from '@/components/dashboard/ProjectCard'
import { apiFetch } from '@/lib/api'

const formatDateLabel = (value?: string | null) => {
  if (!value) return undefined

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const normalizeProgress = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.min(100, value))
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.min(100, parsed))
    }
  }

  return undefined
}

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
      const [projectsRes, eventsRes] = await Promise.all([
        apiFetch('/projects/user/projects', { method: 'GET' }),
        apiFetch('/events/nearest', { method: 'GET' })
      ])
      
      if (!projectsRes.ok) {
        if (projectsRes.status === 401) {
          throw new Error('Unauthorized: Please login again')
        }
        throw new Error(`Failed to fetch projects: ${projectsRes.status}`)
      }

      const projectsResult = await projectsRes.json()
      const eventsResult = await eventsRes.ok ? await eventsRes.json() : { success: false, data: [] }

      console.log('Projects API Response:', projectsResult)
      console.log('Events API Response:', eventsResult)
      
      if (projectsResult.success) {
          const mappedProjects: ProjectItem[] = projectsResult.data.map((p: any) => ({
            id: String(p.id),
            code: p.project_id || `PN${String(p.id).padStart(7, '0')}`,
            name: p.name,
            createdAtLabel: `Created ${new Date(p.created_at).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}`,
            priority: (p.priority?.charAt(0).toUpperCase() + p.priority?.slice(1).toLowerCase()) as any || 'Medium',
            allTasks: p.tasks ? p.tasks.length : 0,
            activeTasks: p.tasks ? p.tasks.filter((t: any) => t.status !== 'completed').length : 0,
            assignees: p.team_members?.map((member: any) => ({
              id: String(member.id),
              name: member.name,
              avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`,
              role: member.role,
            })) || [],
            extraAssigneesCount: Math.max(0, (p.team_members?.length || 0) - 2),
            description: p.description,
            status: p.status,
            progress: normalizeProgress(p.progress),
            completedTasks: p.tasks ? p.tasks.filter((t: any) => t.status === 'completed').length : p.completedTasks || 0,
            startDate: formatDateLabel(p.start_date ?? p.startDate ?? p.created_at),
            endDate: formatDateLabel(p.end_date ?? p.endDate ?? p.deadline),
            tasks: p.tasks || [] // Include tasks in the project item
          })) as any

          const mappedEvents = (eventsResult.data || []).map((e: any) => {
            // Calculate duration if both times exist
            let duration = undefined;
            if (e.event_time && e.end_time) {
              const start = new Date(`1970-01-01T${e.event_time}`);
              const end = new Date(`1970-01-01T${e.end_time}`);
              const diffMs = end.getTime() - start.getTime();
              if (diffMs > 0) {
                const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                duration = diffHrs > 0 ? `${diffHrs}h ${diffMins}m` : `${diffMins}m`;
              }
            }

            return {
              id: String(e.id),
              title: e.title,
              time: `${e.display_date}, ${e.formatted_time}`,
              priority: (e.priority || 'medium').toLowerCase() as 'high' | 'medium' | 'low',
              borderColor: e.priority === 'high' ? 'bg-blue-500' : 'bg-purple-500',
              duration: duration
            };
          })

          // Also try to get user info from localStorage as fallback for UI
          const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
          const user = userStr ? JSON.parse(userStr) : null

          setData({
            user: user,
            projects: mappedProjects,
            workloadMembers: [], 
            events: mappedEvents,
            activities: []
          })
        } else {
          throw new Error(projectsResult.message || 'Failed to fetch projects')
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
