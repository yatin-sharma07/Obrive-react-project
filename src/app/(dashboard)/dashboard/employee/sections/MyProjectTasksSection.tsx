"use client";

import { ProjectItem } from "@/components/dashboard/ProjectCard";
import SkeletonLoading from "@/components/SkelitonLoading";
import { apiFetch } from "@/lib/api";
import { CheckCircle2, Circle, Clock3, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const statusStyles = {
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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [updateText, setUpdateText] = useState("");

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update task status");

      const json = await res.json();
      if (json?.data) {
        setTasks((current) =>
          current.map((task) =>
            task.id === taskId ? { ...task, ...json.data } : task
          )
        );
      }
    } catch (err) {
      console.error(err);
      setTasks(previousTasks);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-gray-400 text-sm">
          Select a project to view tasks
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full gap-4 overflow-hidden">

      {/* MAIN */}
      <div className="flex-1 rounded-2xl bg-[#f5f9ff] p-4 sm:p-6  min-h-0 overflow-y-auto scrollbar-hide">

        <h2 className="mb-5 text-xl font-bold text-[#1a472a]">
          {project.name}
        </h2>

        <div className="space-y-3">
          {tasks.map((task) => {
            const status = statusStyles[task.status];
            const isActive = selectedTask?.id === task.id;

            return (
              <motion.div layout key={task.id}>

                <div
                  onClick={() => setSelectedTask(task)}
                  className="cursor-pointer rounded-2xl bg-white px-4 py-4 sm:px-5 scrollbar-hide"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 ">

                    <div>
                      <p className="text-[10px] text-gray-400">Task Title</p>
                      <p className="text-xs font-medium text-gray-800">
                        {task.title}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-400">Task ID</p>
                      <p className="text-xs font-medium text-gray-800">
                        {task.task_number}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-400">Created At</p>
                      <p className="text-xs font-medium text-gray-800">
                        {formatDateTime(task.created_at)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-400">Deadline</p>
                      <p className="text-xs font-medium text-gray-800">
                        {formatDateTime(task.deadline)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-400">Status</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${status.pill}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* EXPANDED */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-white px-4 pb-4 rounded-b-2xl"
                    >
                      <label htmlFor="" className="font-bold text-[]">Description</label>
                      <p className="text-sm text-gray-600 mt-3">
                        {task.description}
                      </p>

                      {/* RECENT ACTIVITY */}
                      <div className="mt-6">
                        <p className="text-xs text-gray-400 mb-2">
                          Recent Activity
                        </p>

                        <div className="space-y-3">

                          {/* dummy users */}
                          {[
                            { name: "Oscar Holloway", role: "UI/UX", text: "Updated task UI", img: "https://i.pravatar.cc/40?img=1" },
                            { name: "Emily Tyler", role: "Copywriter", text: "Added content changes", img: "https://i.pravatar.cc/40?img=2" },
                          ].map((u, i) => (
                            <div key={i} className="flex gap-3 items-start">
                              <img src={u.img} className="w-8 h-8 rounded-full" />
                              <div>
                                <p className="text-sm font-medium">{u.name}</p>
                                <p className="text-[11px] text-gray-400">{u.role}</p>
                                <p className="text-sm bg-gray-100 px-3 py-1 rounded mt-1">
                                  {u.text}
                                </p>
                              </div>
                            </div>
                          ))}

                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="w-[300px] bg-white rounded-2xl p-4 shadow-lg relative"
          >
            <button
              onClick={() => setSelectedTask(null)}
              className="absolute top-3 right-3"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-semibold mb-4">Task Info</h3>

            <p className="text-xs text-gray-400">Deadline</p>
            <p className="text-sm mb-4">{selectedTask.deadline}</p>

            <p className="text-xs text-gray-400 mb-1">Update Status</p>
            <select
              value={selectedTask.status}
              onChange={(e) =>
                handleStatusChange(selectedTask.id, e.target.value as TaskStatus)
              }
              className={`w-full mb-4 border rounded-lg px-2 py-2 text-sm ${
                statusStyles[selectedTask.status].select
              }`}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* ADD UPDATE */}
            <p className="text-xs text-gray-400 mb-1">Add Update</p>
            <textarea
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              placeholder="Describe changes..."
              className="w-full border rounded-lg p-2 text-sm"
            />

            <button
              className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg text-sm"
              onClick={() => {
                console.log(updateText);
                setUpdateText("");
              }}
            >
              Save Update
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyProjectTasksSection;