"use client";

import { useState } from "react";

import Column from "./TaskColumn";
import FloatingButton from "./FloatingButton";
import AddTaskModal from "./Add";
import { dummyTasks } from "../data/dummyData";
import { getNext3Days } from "../constants/dates";

export default function Board() {
  const columns = getNext3Days();

  const [tasks, setTasks] = useState(dummyTasks);
  const [draggedTask, setDraggedTask] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
  };

  const handleDrop = (e, column) => {
    e.preventDefault();

    setTasks((prev) =>
      prev.map((t) =>
        t.id === draggedTask.id
          ? { ...t, column: column.id }
          : t
      )
    );
  };

  //  ADD TASK FUNCTION
  const handleAddTask = (newTask) => {
    setTasks((prev) => [...prev, newTask]);

    //  BACKEND CALL (later)
    // await createTask(newTask);
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