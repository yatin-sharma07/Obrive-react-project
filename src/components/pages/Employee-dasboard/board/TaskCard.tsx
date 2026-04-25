"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Trash} from "lucide-react";
import ConfirmationAlert from "@/components/ConfirmationAlert";

type Task = {
  id: string;
  title: string;
  note_date: string;
  color: string;
  position: number;
  user_id: string;
};

type Props = {
  task: Task;
  userId: string |null
  onDelete: (id: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export default function TaskCard({
  task,
  userId,
  onDelete,
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

      onDelete(task.id); // update UI
      setShowConfirm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to delete note");
    } finally {
      setLoading(false);
    }
  };
console.log("task user:", task.user_id, "logged user:", userId);
  return (
    <>
      <div
        {...props}
        className="relative p-4 mb-3 bg-white rounded shadow border-l-4"
        style={{ borderLeftColor: task.color }}
      >
        <p className="text-xs text-gray-400 mb-2">{task.note_date}</p>

        <p className="font-semibold">{task.title}</p>

        {userId && task.user_id && userId == task.user_id && (
          <button
            onClick={() => setShowConfirm(true)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          >
            <Trash className="w-4 h-4"  />
          </button>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white p-4 rounded w-[300px] space-y-3">
            <ConfirmationAlert
              title="Delete Note"
              description="Are you sure you want to delete this note?"
              type="warning"
              onClose={() => setShowConfirm(false)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}