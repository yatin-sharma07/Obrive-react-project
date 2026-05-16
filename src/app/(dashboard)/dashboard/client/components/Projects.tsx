"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import ProjectCard, { type ProjectItem } from "@/components/dashboard/ProjectCard";
import { apiFetch } from "@/lib/api";


type ProjectCardVariant = "dashboard" | "projects";

const formatDateLabel = (value?: string | null) => {
  if (!value) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  return date.toLocaleDateString();
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


interface ProjectsProps {
  projects?: ProjectItem[];
  onViewAll?: () => void;
  variant?: ProjectCardVariant;
  onSelectProject?: (project: ProjectItem) => void;
}

export default function Projects({
  projects = [],
  onViewAll,
  variant,
  onSelectProject,
  setActiveSection
}: ProjectsProps) {
  const [myProjects, setMyProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    if (variant !== "projects") return;

    const fetchMyProjects = async () => {
      try {
        const res = await apiFetch("/projects/client/projects");

        if (res.ok) {
          const json = await res.json();

          const mapped = json.data.map((p: any) => ({
            id: p.id.toString(),
            code: p.code || p.project_id || `PROJ-${p.id}`,
            name: p.name,
            description: p.description,
            priority: p.priority,
            createdAtLabel: new Date(p.created_at).toLocaleDateString(),
            allTasks: Array.isArray(p.tasks) ? p.tasks.length : p.allTasks || 0,
            activeTasks: Array.isArray(p.tasks)
              ? p.tasks.filter((task: any) => task.status !== "completed").length
              : p.activeTasks || 0,
            assignees: p.team_members?.map((member: any) => ({
              id: member.id.toString(),
              name: member.name,
              avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`,
              role: member.role,
            })) || [],
            extraAssigneesCount: Math.max(0, (p.team_members?.length || 0) - 2),
            status: p.project_status,
            progress: normalizeProgress(p.progress),
            completedTasks: Array.isArray(p.tasks)
              ? p.tasks.filter((task: any) => task.status === "completed").length
              : p.completedTasks || 0,
            startDate: formatDateLabel(p.start_date ?? p.startDate ?? p.created_at),
            endDate: formatDateLabel(p.end_date ?? p.endDate ?? p.deadline),
            tasks: Array.isArray(p.tasks) ? p.tasks : [],
          }));

          setMyProjects(mapped);
        } else {
          console.error("Failed to fetch projects from API");
        }
      } catch (err) {
        console.error("Failed to fetch my projects", err);
      }
    };

    fetchMyProjects();
  }, [variant]);

  const displayProjects = variant === "projects" ? myProjects : projects;


  if (variant === "dashboard") {
    return (
      <section className="bg-transparent">

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-extrabold text-[#1a472a]">
            Projects
          </h2>

          <button
            type="button"
            onClick={()=>setActiveSection("projects")}
            className="text-sm font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
          >
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {displayProjects.map((p) => (
            <ProjectCard key={p.id} project={p} variant={variant} onSelectProject={onSelectProject} />
          ))}
        </div>
      </section>
    );
  }


  if (variant === "projects") {
    return (

      <div className="flex flex-col gap-6 h-full">

          
          <div className="bg-transparent">
            <div className="flex items-center justify-center mb-3 border-b p-2 border-[#d6d4d4]">
              <h2 className="text-base font-extrabold text-[#1a472a]">
                Current Projects
              </h2>
            </div>

            <div className="space-y-4">
              {displayProjects.map((p) => (
                <ProjectCard key={p.id} project={p} variant={variant} onSelectProject={onSelectProject} />
              ))}
            </div>
          </div>
  </div>
  

    );
  }

  return null;
}
