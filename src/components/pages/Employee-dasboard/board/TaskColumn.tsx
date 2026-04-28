"use client";

import TaskCard from "./TaskCard";

export default function Column({
  column,
  tasks,
  onDrop,
  onDragStart,
  userId,
  onDelete,
  handleAddCardOpen,
  mode = "notes",
}: any) {
  return (
    <div
      className="flex min-w-[280px] flex-1 flex-col rounded-2xl bg-gray-50 p-4"
      onDrop={(e) => onDrop(e, column)}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="mb-4 flex justify-center border-b border-gray-300 pb-2">
        <h2 className="text-lg font-semibold">{column.label}</h2>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1 scrollbar-hide">
        {tasks.map((task: any) => (
          <TaskCard
            key={task.id}
            task={task}
            draggable
            onDragStart={() => onDragStart(task)}
            userId={userId}
            onDelete={onDelete}
            mode={mode}
          />
        ))}

        {handleAddCardOpen ? (
          <div
            className="mt-3 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 py-4 text-gray-400 transition-all duration-200 hover:border-blue-500 hover:text-blue-500"
            onClick={() => handleAddCardOpen()}
          >
            <span className="mr-2 text-lg">+</span>
            <span className="font-medium">Add task</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
