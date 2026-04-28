"use client";

import { ProjectItem } from "@/components/dashboard/ProjectCard";
import SkeletonLoading from "@/components/SkelitonLoading";
import { apiFetch } from "@/lib/api";
import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import React, { useEffect, useState } from "react";

export type TaskStatus = "pending" | "in-progress" | "completed";

export type Task = {
  id: number;
  project_id: number;
  task_number: string;
  title: string;
  description?: string;
  deadline?: string;
  status: TaskStatus;
  created_at?: string;
};

type Props = {
  project: (ProjectItem & { tasks?: Task[] }) | null;
};

const formatDateTime = (value?: string) => {
  if (!value) return "Not set";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const statusStyles: Record<
  TaskStatus,
  {
    label: string;
    pill: string;
    select: string;
    icon: React.ComponentType<{ className?: string }>;
    progress: number;
  }
> = {
  pending: {
    label: "Pending",
    pill: "bg-amber-100 text-amber-700",
    select: "border-amber-200 text-amber-700",
    icon: Circle,
    progress: 33,
  },
  "in-progress": {
    label: "In Progress",
    pill: "bg-sky-100 text-sky-700",
    select: "border-sky-200 text-sky-700",
    icon: Clock3,
    progress: 50,
  },
  completed: {
    label: "Completed",
    pill: "bg-emerald-100 text-emerald-700",
    select: "border-emerald-200 text-emerald-700",
    icon: CheckCircle2,
    progress: 100,
  },
};

const MyProjectTasksSection = ({ project }: Props) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);

  useEffect(() => {
    const projectId = project?.id ? Number(project.id) : null;

    if (!projectId) {
      setTasks([]);
      return;
    }

    if (project?.tasks) {
      setTasks(project.tasks);
    }

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await apiFetch(`/tasks/project/${projectId}`);

        if (res.ok) {
          const json = await res.json();
          setTasks(Array.isArray(json.data) ? json.data : []);
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error("Cannot fetch tasks", err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [project]);

  const handleStatusChange = async (taskId: number, status: TaskStatus) => {
    const previousTasks = tasks;

    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, status } : task))
    );
    setUpdatingTaskId(taskId);

    try {
      const res = await apiFetch(`/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update task status");

      const json = await res.json();
      if (json?.data) {
        setTasks((current) =>
          current.map((task) => (task.id === taskId ? { ...task, ...json.data } : task))
        );
      }
    } catch (err) {
      console.error("Cannot update task status", err);
      setTasks(previousTasks);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (!project) {
    return (
      <div className="flex h-full min-h-0 w-full items-center justify-center rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-gray-400 text-sm">Select a project to view tasks</p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-2xl bg-[#f5f9ff] p-6 shadow-sm">
      <div className="mb-5 border-b border-gray-100 pb-4 flex justify-between">
       
        <h2 className="mt-1 text-xl font-bold text-[#1a472a] group-hover:text-2xl transition-all">
          {project.name}
        </h2>
        
      
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {loading ? (
          <SkeletonLoading />
        ) : tasks.length === 0 ? (
          <p className="text-gray-400 text-sm">No tasks found</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const status = statusStyles[task.status];

              return (
                <div
                  key={task.id}
                  className="group rounded-2xl bg-white px-5 py-4 transition-all duration-200"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 items-center">
                    
                    <div>
                      <p className="text-[10px] text-gray-400">Task</p>
                      <p className="text-xs font-medium text-gray-800 truncate group-hover:text-sm transition-all">
                        {task.title}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-400">ID</p>
                      <p className="text-xs font-medium text-gray-800 group-hover:text-sm transition-all">
                        {task.task_number}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-400">Created</p>
                      <p className="text-xs font-medium text-gray-800 group-hover:text-sm transition-all">
                        {formatDateTime(task.created_at)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-400">Deadline</p>
                      <p className="text-xs font-medium text-gray-800 group-hover:text-sm transition-all">
                        {formatDateTime(task.deadline)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium group-hover:text-xs transition-all ${status.pill}`}>
                        {status.label}
                      </span>

                      <div className="relative w-6 h-6 group-hover:w-6 group-hover:h-6 transition-all">
                        <svg className="w-full h-full rotate-[-90deg]">
                          <circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth="2" fill="none" />
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray={2 * Math.PI * 10}
                            strokeDashoffset={2 * Math.PI * 10 * (1 - status.progress / 100)}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:max-h-24 group-hover:opacity-100 group-hover:mt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <label className="text-xs text-gray-600 font-medium">
                        Update status
                      </label>

                      <select
                        value={task.status}
                        onChange={(event) =>
                          handleStatusChange(task.id, event.target.value as TaskStatus)
                        }
                        disabled={updatingTaskId === task.id}
                        className={`w-full sm:w-52 rounded-lg border bg-white px-3 py-2 text-xs font-medium outline-none ${status.select}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjectTasksSection;