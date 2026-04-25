"use client";

import TaskCard from "./TaskCard";

export default function Column({
  column,
  tasks,
  onDrop,
  onDragStart,
  userId,
  onDelete,
  handleAddCardOpen
  
}: any) {
  return (
    <div
      className="flex-1 p-4 m-2 bg-gray-50 rounded-lg flex flex-col h-full"
      onDrop={(e) => onDrop(e, column)}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* Header */}
      <div className="flex justify-center mb-4 border-b pb-2 border-gray-300">
        <h2 className="font-semibold text-xl">{column.label}</h2>
      </div>

      {/* Scrollable task list */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
        {tasks.map((task: any) => (
          <TaskCard
            key={task.id}
            task={task}
            draggable
            onDragStart={() => onDragStart(task)}
            userId={userId}
            onDelete={onDelete}
          />
        ))}

         <div
        className="
          mt-3
          border-2 border-dashed border-gray-300
          rounded-xl
          flex items-center justify-center
          py-4
          text-gray-400
          cursor-pointer
          transition-all duration-200
          hover:border-blue-500
          hover:text-blue-500
        "
        onClick={() => handleAddCardOpen()}
      >
        <span className="text-lg mr-2">+</span>
        <span className="font-medium">Add task</span>
      </div>
      </div>

      {/* Add Task Box */}
     
    </div>
  );
}