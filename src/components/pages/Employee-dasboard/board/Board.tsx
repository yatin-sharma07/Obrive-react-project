"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";
import { getNext3Days } from "../constants/dates";
import Column from "./TaskColumn";
import FloatingButton from "./FloatingButton";
import AddTaskModal from "./Add";

type BoardColumn = {
  id: string;
  label: string;
};

type BoardTask = {
  id: string;
  title: string;
  note_date?: string;
  status?: string;
  color?: string;
  position?: number;
  user_id?: string;
  description?: string;
  task_number?: string;
};

type BoardProps = {
  mode?: "notes" | "tasks";
  tasks?: BoardTask[];
  setTasks?: React.Dispatch<React.SetStateAction<any[]>>;
  columns?: BoardColumn[];
  getTaskColumnId?: (task: BoardTask) => string;
  onTaskDrop?: (task: BoardTask, columnId: string) => Promise<BoardTask | void> | BoardTask | void;
  showAddTask?: boolean;
  addButtonLabel?: string;
};

export default function Board({
  mode = "notes",
  tasks: propTasks,
  setTasks: propSetTasks,
  columns: propColumns,
  getTaskColumnId,
  onTaskDrop,
  showAddTask,
  addButtonLabel,
}: BoardProps) {
  const columns = propColumns ?? getNext3Days();
  const [draggedTask, setDraggedTask] = useState<BoardTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [localTasks, setLocalTasks] = useState<any[]>([]);
  const tasks = propTasks !== undefined ? propTasks : localTasks;
  const setTasks = propSetTasks !== undefined ? propSetTasks : setLocalTasks;
  const shouldShowAddTask = showAddTask ?? mode === "notes";
  const taskColumnId =
    getTaskColumnId ??
    ((task: BoardTask) => (mode === "tasks" ? task.status || "" : task.note_date || ""));

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await apiFetch("/employee/me");
        if (res.ok) {
          const json = await res.json();
          const fetchedUserId = json.data.id || json.data.userid;
          setUserId(String(fetchedUserId));
        }
      } catch (err) {
        throw new Error("Failed to fetch user ID");
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (mode !== "notes" || propTasks !== undefined) {
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await apiFetch("/sticky-notes");
        if (res.ok) {
          const json = await res.json();
          const formattedTasks = json.data.map((task: any) => ({
            id: task.id.toString(),
            title: task.content,
            note_date: new Date(task.note_date).toLocaleDateString("en-CA"),
            color: task.color,
            position: task.position,
            user_id: task.user_id,
          }));
          setTasks(formattedTasks);
        }
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };
    fetchTasks();
  }, [mode, propTasks, setTasks]);

  const handleAddCardOpen = () => {
    setIsModalOpen(true);
  };

  const handleDrop = async (e: any, column: BoardColumn) => {
    e.preventDefault();
    if (!draggedTask) return;

    const nextColumnId = column.id;
    const previousTasks = tasks;

    setTasks((prev: any[]) =>
      prev.map((t) =>
        t.id === draggedTask.id
          ? {
              ...t,
              ...(mode === "tasks" ? { status: nextColumnId } : { note_date: nextColumnId }),
            }
          : t
      )
    );

    try {
      if (onTaskDrop) {
        const updatedTask = await onTaskDrop(draggedTask, nextColumnId);
        if (updatedTask) {
          setTasks((prev: any[]) =>
            prev.map((t) => (t.id === draggedTask.id ? { ...t, ...updatedTask } : t))
          );
        }
      } else if (mode === "notes") {
        await apiFetch(`/sticky-notes/${draggedTask.id}`, {
          method: "PUT",
          body: JSON.stringify({
            note_date: nextColumnId,
          }),
        });
      }
    } catch (error) {
      console.error("Failed to update task after drop:", error);
      setTasks(previousTasks);
    } finally {
      setDraggedTask(null);
    }
  };

  const handleDelete = (id: string) => {
    setTasks((prev: any[]) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = (task: any) => {
    setTasks((prev: any[]) => [...prev, task]);
  };

  return (
    <div className="flex h-full min-h-0 gap-3 overflow-x-auto pb-2">
      {userId !== null &&
        columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            tasks={tasks.filter((t: any) => taskColumnId(t) === col.id)}
            onDrop={handleDrop}
            onDelete={handleDelete}
            onDragStart={(task: BoardTask) => setDraggedTask(task)}
            userId={userId}
            handleAddCardOpen={shouldShowAddTask ? handleAddCardOpen : undefined}
            mode={mode}
          />
        ))}

      {shouldShowAddTask ? (
        <>
          <FloatingButton onClick={handleAddCardOpen} label={addButtonLabel || "Add Note +"} />
          <AddTaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAdd={handleAddTask}
          />
        </>
      ) : null}
    </div>
  );
}
