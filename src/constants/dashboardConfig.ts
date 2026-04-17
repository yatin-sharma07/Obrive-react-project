export type UserRole = 'hr' | 'employee' | 'admin' | 'client'

export interface DashboardConfig {
  showWorkload: boolean
  showProjects: boolean
  showNearestEvents: boolean
  showActivityStream: boolean
  showProfileNotifications: boolean
  // Add more flags as needed
}

export const dashboardConfigs: Record<UserRole, DashboardConfig> = {
  hr: {
    showWorkload: true,
    showProjects: true,
    showNearestEvents: true,
    showActivityStream: true,
    showProfileNotifications: true,
  },
  employee: {
    showWorkload: false,
    showProjects: true,
    showNearestEvents: true,
    showActivityStream: true,
    showProfileNotifications: true,
  },
  admin: {
    showWorkload: true,
    showProjects: true,
    showNearestEvents: false,
    showActivityStream: true,
    showProfileNotifications: true,
  },
  client: {
    showWorkload: false,
    showProjects: true,
    showNearestEvents: false,
    showActivityStream: false,
    showProfileNotifications: true,
  },
}