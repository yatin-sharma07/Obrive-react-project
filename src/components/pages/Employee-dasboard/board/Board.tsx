"use client";

import { useState ,useEffect} from "react";

import { apiFetch } from "@/lib/api";
import { getNext3Days } from "../constants/dates";
import Column from "./TaskColumn";
import FloatingButton from "./FloatingButton";
import AddTaskModal from "./Add";

export default function Board({ tasks: propTasks, setTasks: propSetTasks }: any) {
  const columns = getNext3Days();
  const [draggedTask, setDraggedTask] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Initialize tasks state if not provided as props
  const [localTasks, setLocalTasks] = useState<any[]>([]);
  const tasks = propTasks !== undefined ? propTasks : localTasks;
  const setTasks = propSetTasks !== undefined ? propSetTasks : setLocalTasks;

useEffect(()=>{
  const fetchUserId=async()=>{
try{
  const res = await apiFetch("/employee/me")
if(res.ok){
  const json = await res.json();
  const userId = json.data.id || json.data.userid;
  setUserId(String(userId));
  
}  }catch(err){
 throw new Error("Failed to fetch user ID")
}
  }
  fetchUserId();
}, [])

useEffect(() => {
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
}, [setTasks]);

const handleAddCardOpen=()=>{
  setIsModalOpen(true)
}

  const handleDrop = async (e: any, column: any) => {
    e.preventDefault();
    if (!draggedTask) return;

    setTasks((prev: any[]) =>
      prev.map((t) =>
        t.id === draggedTask.id
          ? { ...t, note_date: column.id }
          : t
      )
    );

    await apiFetch(`/sticky-notes/${draggedTask.id}`, {
      method: "PUT",
      body: JSON.stringify({
        note_date: column.id,
      }),
    });

    setDraggedTask(null);
  };
  const handleDelete = (id: string) => {
  setTasks((prev: any[]) => prev.filter((t) => t.id !== id));
};

const handleAddTask = (task: any) => {
  setTasks((prev: any[]) => [...prev, task]);
};

  return (
    <div className="flex h-screen p-3">
    {userId !== null && (
  columns.map((col) => (
    <Column
      key={col.id}
      column={col}
      tasks={tasks.filter((t: any) => t.note_date === col.id)}
      onDrop={handleDrop}
      onDelete={handleDelete}
      onDragStart={(task: any) => setDraggedTask(task)}
      userId={userId}
      handleAddCardOpen={handleAddCardOpen}
    />
  ))
)}

      <FloatingButton onClick={handleAddCardOpen} />

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
}