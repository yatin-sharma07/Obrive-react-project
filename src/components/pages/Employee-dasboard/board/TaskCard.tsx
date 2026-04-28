"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { CheckCircle2, Circle, Clock3, Trash } from "lucide-react";
import ConfirmationAlert from "@/components/ConfirmationAlert";

type Task = {
  id: string;
  title: string;
  note_date?: string;
  color?: string;
  position?: number;
  user_id?: string;
  status?: "pending" | "in-progress" | "completed";
  description?: string;
  task_number?: string;
};

type Props = {
  task: Task;
  userId: string | null;
  onDelete: (id: string) => void;
  mode?: "notes" | "tasks";
} & React.HTMLAttributes<HTMLDivElement>;

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Circle,
    badge: "bg-amber-100 text-amber-700",
    border: "#f59e0b",
  },
  "in-progress": {
    label: "In Progress",
    icon: Clock3,
    badge: "bg-sky-100 text-sky-700",
    border: "#0ea5e9",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    badge: "bg-emerald-100 text-emerald-700",
    border: "#10b981",
  },
};

export default function TaskCard({
  task,
  userId,
  onDelete,
  mode = "notes",
  ...props
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      await apiFetch(`/sticky-notes/${task.id}`, {
        method: "DELETE",
      });

      onDelete(task.id);
      setShowConfirm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to delete note");
    } finally {
      setLoading(false);
    }
  };

  const taskStatus = task.status && statusConfig[task.status];
  const StatusIcon = taskStatus?.icon;
  const borderLeftColor =
    mode === "tasks" && taskStatus ? taskStatus.border : task.color || "#d1d5db";

  return (
    <>
      <div
        {...props}
        className="relative mb-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
        style={{ borderLeft: `4px solid ${borderLeftColor}` }}
      >
        {mode === "tasks" ? (
          <>
            {task.task_number ? (
              <p className="mb-2 text-xs text-gray-400">{task.task_number}</p>
            ) : null}
            <p className="font-semibold text-[#1a472a]">{task.title}</p>
            {task.description ? (
              <p className="mt-1 text-sm text-gray-500">{task.description}</p>
            ) : null}
            {taskStatus && StatusIcon ? (
              <span
                className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${taskStatus.badge}`}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                {taskStatus.label}
              </span>
            ) : null}
          </>
        ) : (
          <>
            <p className="mb-2 text-xs text-gray-400">{task.note_date}</p>
            <p className="font-semibold">{task.title}</p>

            {userId && task.user_id && userId == task.user_id ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
              >
                <Trash className="h-4 w-4" />
              </button>
            ) : null}
          </>
        )}
      </div>

      {mode === "notes" && showConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-[300px] space-y-3 rounded bg-white p-4">
            <ConfirmationAlert
              title="Delete Note"
              description="Are you sure you want to delete this note?"
              type="warning"
              onClose={() => setShowConfirm(false)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded bg-gray-200 px-3 py-1"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="rounded bg-red-500 px-3 py-1 text-white"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
