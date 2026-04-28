"use client";

import { useEffect, useState } from "react";

import Board from "@/components/pages/Employee-dasboard/board/Board";
import { apiFetch } from "@/lib/api";
import { ProjectItem } from "@/components/dashboard/ProjectCard";
import { Task, TaskStatus } from "./MyProjectTasksSection";

const statusColumns = [
  { id: "pending", label: "Pending" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

type Props = {
  project: (ProjectItem & { tasks?: Task[] }) | null;
};

export default function TaskDragDrop({ project }: Props) {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const projectId = project?.id ? Number(project.id) : null;

    if (!projectId) {
      setTasks([]);
      return;
    }

    if (project?.tasks) {
      setTasks(project.tasks.map((task) => ({ ...task, id: String(task.id) })));
    }

    const fetchTasks = async () => {
      try {
        const res = await apiFetch(`/tasks/project/${projectId}`);
        if (res.ok) {
          const json = await res.json();
          const nextTasks = Array.isArray(json.data)
            ? json.data.map((task: Task) => ({ ...task, id: String(task.id) }))
            : [];
          setTasks(nextTasks);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error("Failed to fetch project tasks:", error);
        setTasks([]);
      }
    };

    fetchTasks();
  }, [project]);

  const handleTaskDrop = async (task: any, nextStatus: string) => {
    const res = await apiFetch(`/tasks/${task.id}`, {
      method: "PUT",
      body: JSON.stringify({
        status: nextStatus as TaskStatus,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to update task status");
    }

    const json = await res.json();
    return json?.data
      ? { ...json.data, id: String(json.data.id) }
      : { ...task, status: nextStatus };
  };

  if (!project) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-gray-400">Select a project to view board</p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl bg-white p-6 shadow-sm">
     

      <div className="min-h-0 flex-1">
        <Board
          mode="tasks"
          tasks={tasks}
          setTasks={setTasks}
          columns={statusColumns}
          getTaskColumnId={(task) => task.status}
          onTaskDrop={handleTaskDrop}
          showAddTask={false}
        />
      </div>
    </div>
  );
}
