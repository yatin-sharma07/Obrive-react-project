"use client";

import { useState } from "react";

import Column from "./TaskColumn";
import FloatingButton from "./FloatingButton";
import AddTaskModal from "./Add";
import { dummyTasks } from "../data/dummyData";
import { getNext3Days } from "../constants/dates";

type Task = {
  id: string;
  title: string;
  duration: string;
  column: string;
  color: string;
};
export default function Board() {
  const columns = getNext3Days();

  const [tasks, setTasks] = useState<Task[]>(dummyTasks);
const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

const handleDragStart = (
  e: React.DragEvent<HTMLDivElement>,
  task: Task
) => {
  setDraggedTask(task);
};

const handleDrop = (
  e: React.DragEvent<HTMLDivElement>,
  column: { id: string }
) => {
  e.preventDefault();

  if (!draggedTask) return; // safety

  setTasks((prev) =>
    prev.map((t) =>
      t.id === draggedTask.id
        ? { ...t, column: column.id }
        : t
    )
  );
};

  //  ADD TASK FUNCTION
 const handleAddTask = (newTask: Task) => {
  setTasks((prev) => [...prev, newTask]);
};

  return (
    <div className="flex h-screen relative">

      {columns.map((col) => (
        <Column
          key={col.id}
          column={col}
          tasks={tasks.filter((t) => t.column === col.id)}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
        />
      ))}

      <FloatingButton onClick={() => setIsModalOpen(true)} />

   
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
}