"use client";

import TaskCard from "./TaskCard";

export default function Column({ column, tasks, onDrop, onDragStart }) {
  return (
    <div
      className={`flex-1 p-4 ${
        column.id === "waiting" ? "bg-gray-100" : "bg-white"
      }`}
      onDrop={(e) => onDrop(e, column)}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="font-semibold">{column.label}</h2>
        <span className="bg-gray-200 px-2 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* TASKS */}
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          draggable
          onDragStart={(e) => onDragStart(e, task)}
        />
      ))}
    </div>
  );
}