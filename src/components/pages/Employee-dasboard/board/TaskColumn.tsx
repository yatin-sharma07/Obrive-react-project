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
      className={`flex-1  p-4 m-2 bg-gray-50 rounded-lg shadow-sm transition-colors duration-200 hover:bg-gray-100
      }`}
      onDrop={(e) => onDrop(e, column)}
      onDragOver={(e) => e.preventDefault()}
    >
      
      <div className="flex justify-between mb-4 items-center">
        <div className="bg-gray-100 h-10 w-50 flex justify-center items-center rounded-lg">
          <h2 className="font-semibold ">{column.label}</h2>
        </div>
        <div>
        <span className="bg-gray-200 px-2 rounded-full">
          {tasks.length}
        </span>
      </div>
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