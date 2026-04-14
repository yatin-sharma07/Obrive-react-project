"use client";

import TaskCard from "./TaskCard";

type Task = {
  id: string;
  title: string;
  duration: string;
  column: string;
  color: string;
};

type ColumnType = {
  id: string;
  label: string;
};

type ColumnProps = {
  column: ColumnType;
  tasks: Task[];
  onDrop: (
    e: React.DragEvent<HTMLDivElement>,
    column: ColumnType
  ) => void;
  onDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    task: Task
  ) => void;
};

export default function Column({
  column,
  tasks,
  onDrop,
  onDragStart,
}: ColumnProps) {
  return (
    <div
      className={`flex-1 p-4 ${
        column.id === "waiting" ? "bg-gray-100" : "bg-white"
      }`}
      onDrop={(e) => onDrop(e, column)}
      onDragOver={(e) => e.preventDefault()}
    >
      
      <div className="flex justify-between mb-4">
        <h2 className="font-semibold">{column.label}</h2>
        <span className="bg-gray-200 px-2 rounded-full">
          {tasks.length}
        </span>
      </div>

      
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