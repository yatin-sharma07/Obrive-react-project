"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import ProjectCard, { type ProjectItem } from "@/components/dashboard/ProjectCard";
import { apiFetch } from "@/lib/api";

type ProjectCardVariant = "dashboard" | "projects";

const DUMMY_PROJECTS: ProjectItem[] = [
  {
    id: "1",
    code: "PROJ-001",
    name: "Website Redesign",
    createdAtLabel: "Jan 15, 2025",
    priority: "High",
    allTasks: 24,
    activeTasks: 8,
    assignees: [
      { id: "1", name: "John Doe", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
      { id: "2", name: "Jane Smith", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" },
    ],
    extraAssigneesCount: 2,
  },
  {
    id: "2",
    code: "PROJ-002",
    name: "Mobile App Development",
    createdAtLabel: "Feb 3, 2025",
    priority: "Medium",
    allTasks: 18,
    activeTasks: 5,
    assignees: [
      { id: "3", name: "Alex Johnson", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    ],
  },
  {
    id: "3",
    code: "PROJ-003",
    name: "Database Optimization",
    createdAtLabel: "Mar 10, 2025",
    priority: "Medium",
    allTasks: 12,
    activeTasks: 3,
    assignees: [
      { id: "4", name: "Sarah Wilson", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
      { id: "5", name: "Mike Brown", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
    ],
  },
  {
    id: "4",
    code: "PROJ-004",
    name: "API Integration",
    createdAtLabel: "Mar 22, 2025",
    priority: "Low",
    allTasks: 8,
    activeTasks: 2,
    assignees: [
      { id: "6", name: "Tom Harris", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom" },
    ],
  },
];

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
}: ProjectsProps) {
  const [myProjects, setMyProjects] = useState<ProjectItem[]>([]);

  // 🔥 Fetch only for "projects" page - COMMENTED OUT FOR NOW, WILL USE DUMMY DATA
  // TODO: Uncomment when API is ready
  /*
  useEffect(() => {
    if (variant !== "projects") return;

    const fetchMyProjects = async () => {
      try {
        const res = await apiFetch("/my-projects");

        if (res.ok) {
          const json = await res.json();

          const mapped = json.data.map((p: any) => ({
            id: p.id.toString(),
            project_id: p.project_id,
            name: p.name,
            description: p.description,
            priority: p.priority,
            created_at: p.created_at,
          }));

          setMyProjects(mapped);
        } else {
          // Use dummy data as fallback
          setMyProjects(DUMMY_PROJECTS);
        }
      } catch (err) {
        console.error("Failed to fetch my projects", err);
        // Use dummy data as fallback on error
        setMyProjects(DUMMY_PROJECTS);
      }
    };

    fetchMyProjects();
  }, [variant]);*/

  // Initialize with dummy data
  useEffect(() => {
    if (variant === "projects") {
      setMyProjects(DUMMY_PROJECTS);
    }
  }, [variant]);

  const displayProjects =
    variant === "projects" ? myProjects : projects;


  if (variant === "dashboard") {
    return (
      <section className="bg-transparent">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-extrabold text-[#1a472a]">
            Projects
          </h2>

          <button
            type="button"
            onClick={onViewAll}
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
      <div className="bg-transparent">
        <div className="flex items-center justify-center mb-3 border-b-1 p-2 border-[#1a472a]">
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
    );
  }

  return null;
}