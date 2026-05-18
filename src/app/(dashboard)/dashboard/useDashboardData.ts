import { useEffect, useState, useCallback } from "react";
import type { UserRole } from "@/constants/dashboardConfig";
import type { ProjectItem } from "@/components/dashboard/ProjectCard";
import { apiFetch } from "@/lib/api";

const formatDateLabel = (value?: string | null) => {
  if (!value) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const normalizeProgress = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.min(100, value));
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.min(100, parsed));
    }
  }

  return undefined;
};

const startOfDay = (date: Date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const isWithinNextTwoDays = (value?: string | null) => {
  if (!value) return false;

  const targetDate = new Date(value);
  if (Number.isNaN(targetDate.getTime())) return false;

  const today = startOfDay(new Date());
  const target = startOfDay(targetDate);
  const diffInMs = target.getTime() - today.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  return diffInDays >= 0 && diffInDays <= 2;
};

const formatCalendarEventTime = (deadline?: string | null) => {
  const label = formatDateLabel(deadline);
  return label ? `${label}, Due date` : "Due soon";
};

interface DashboardData {
  workloadMembers?: any[];
  projects?: ProjectItem[];
  events?: any[];
  activities?: any[];
  me?: {
    id?: number | string;
    name?: string;
    email?: string;
    role?: string;
  };
  user?: {
    name: string;
    email: string;
    role: string;
  };
}

export function useDashboardData(userRole: UserRole) {
  const [data, setData] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const endpoints = userRole === 'supervisor'
        ? { projects: '/projects', events: '/events/nearest' }
        : { projects: '/projects/user/projects', events: '/events/nearest' }

      const [projectsRes, eventsRes, usersRes, meRes, calendarRes] = await Promise.all([
        apiFetch(endpoints.projects, { method: 'GET' }),
        apiFetch(endpoints.events, { method: 'GET' }),
        apiFetch('/auth/users', { method: 'GET' }),
        apiFetch('/auth/me', { method: 'GET' }),
        apiFetch('/calendar/tasks', { method: 'GET' }),
      ])

      if (!projectsRes.ok) {
        if (projectsRes.status === 401) throw new Error('Unauthorized')
        throw new Error(`Projects fetch failed: ${projectsRes.status}`)
      }

      const [projectsResult, eventsResult, usersResult, meResult, calendarResult] = await Promise.all([
        projectsRes.json(),
        eventsRes.json().catch(() => ({ success: false, data: [] })),
        usersRes.json().catch(() => ({ success: false, data: [] })),
        meRes.json().catch(() => ({ success: false, data: {} })),
        calendarRes.json().catch(() => ({ success: false, data: [] })),
      ])

      if (!projectsResult.success) throw new Error(projectsResult.message || 'Failed to fetch projects')

      const projectsData = Array.isArray(projectsResult.data) ? projectsResult.data : []

      const mappedProjects: ProjectItem[] = projectsData.map((p: any) => ({
        id: String(p.id),
        code: p.project_id || `PN${String(p.id).padStart(7, '0')}`,
        name: p.name,
        createdAtLabel: p.created_at ? `Created ${new Date(p.created_at).toLocaleDateString()}` : undefined,
        priority: (p.priority || 'medium').charAt(0).toUpperCase() + (p.priority || 'edium').slice(1),
        allTasks: p.tasks ? p.tasks.length : 0,
        activeTasks: p.tasks ? p.tasks.filter((t: any) => t.status !== 'completed').length : 0,
        assignees: (p.team_members || []).map((m: any) => ({
          id: String(m.id),
          name: m.name,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`,
          role: m.role,
        })),
        extraAssigneesCount: Math.max(0, (p.team_members?.length || 0) - 2),
        description: p.description,
        status: p.project_status || p.status,
        progress: normalizeProgress(p.progress),
        completedTasks: p.tasks ? p.tasks.filter((t: any) => t.status === 'completed').length : (p.completedTasks || 0),
        startDate: formatDateLabel(p.start_date ?? p.startDate ?? p.created_at),
        endDate: formatDateLabel(p.end_date ?? p.endDate ?? p.deadline),
        tasks: p.tasks || [],
      })) as any

      const mappedEvents = ((eventsResult.data || []) as any[]).map((e: any) => ({
        id: String(e.id),
        title: e.title,
        time: e.display_date ? `${e.display_date}, ${e.formatted_time || ''}` : (e.formatted_time || ''),
        priority: (e.priority || 'medium').toLowerCase(),
        borderColor: e.priority === 'high' ? 'bg-blue-500' : 'bg-purple-500',
        sortDate: e.event_date,
      }))

      const calendarTasks = (calendarResult.data || []).filter((t: any) => isWithinNextTwoDays(t.deadline)).map((t: any) => ({
        id: `calendar-${t.id}`,
        title: t.title,
        time: formatCalendarEventTime(t.deadline),
        priority: 'medium',
        borderColor: 'bg-purple-500',
        sortDate: t.deadline,
      }))

      const mergedEvents = [...mappedEvents, ...calendarTasks].sort((a: any, b: any) => {
        const aTime = a.sortDate ? new Date(a.sortDate).getTime() : Number.MAX_SAFE_INTEGER
        const bTime = b.sortDate ? new Date(b.sortDate).getTime() : Number.MAX_SAFE_INTEGER
        return aTime - bTime
      }).slice(0, 4)

      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
      const user = userStr ? JSON.parse(userStr) : undefined

      setData({
        user,
        me: meResult.data,
        projects: mappedProjects,
        workloadMembers: usersResult.data || [],
        events: mergedEvents,
        activities: [],
      })
    } catch (err: any) {
      setError(err?.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [userRole])

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...data,
    loading,
    error,
    refetch: fetchData,
  };
}
