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

const statusStyles: Record<
  TaskStatus,
  {
    label: string;
    pill: string;
    select: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  pending: {
    label: "Pending",
    pill: "bg-amber-100 text-amber-700",
    select: "border-amber-200 text-amber-700",
    icon: Circle,
  },
  "in-progress": {
    label: "In Progress",
    pill: "bg-sky-100 text-sky-700",
    select: "border-sky-200 text-sky-700",
    icon: Clock3,
  },
  completed: {
    label: "Completed",
    pill: "bg-emerald-100 text-emerald-700",
    select: "border-emerald-200 text-emerald-700",
    icon: CheckCircle2,
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

      if (!res.ok) {
        throw new Error("Failed to update task status");
      }

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
        <p className="text-gray-400">Select a project to view tasks</p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-5 border-b border-gray-100 pb-4">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {project.code}
        </p>
        <h2 className="mt-1 text-2xl font-bold text-[#1a472a]">{project.name}</h2>
        <p className="mt-1 text-sm text-gray-500">Tasks assigned under this project</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {loading ? (
          <SkeletonLoading />
        ) : tasks.length === 0 ? (
          <p className="text-gray-400">No tasks found</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const status = statusStyles[task.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={task.id}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-400">{task.task_number}</p>
                        <h3 className="mt-1 text-base font-semibold text-[#1a472a]">
                          {task.title}
                        </h3>
                        {task.description ? (
                          <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                        ) : null}
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${status.pill}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="max-h-0 overflow-hidden border-t border-transparent px-4 opacity-0 transition-all duration-200 group-hover:max-h-28 group-hover:border-gray-100 group-hover:py-4 group-hover:opacity-100 group-focus-within:max-h-28 group-focus-within:border-gray-100 group-focus-within:py-4 group-focus-within:opacity-100">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <label
                        htmlFor={`task-status-${task.id}`}
                        className="text-sm font-medium text-gray-600"
                      >
                        Update status
                      </label>
                      <select
                        id={`task-status-${task.id}`}
                        value={task.status}
                        onChange={(event) =>
                          handleStatusChange(task.id, event.target.value as TaskStatus)
                        }
                        disabled={updatingTaskId === task.id}
                        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm font-medium outline-none transition sm:w-52 ${status.select} disabled:cursor-not-allowed disabled:opacity-70`}
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
