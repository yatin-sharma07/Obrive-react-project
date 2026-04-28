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
  showLabel = true,
}: any) {
  if (mode === "tasks") {
    return (
      <div
        className="flex min-w-0 flex-1 flex-col gap-4"
        onDrop={(e) => onDrop(e, column)}
        onDragOver={(e) => e.preventDefault()}
      >
        {showLabel ? (
          <div className="rounded-2xl bg-white p-1 shadow-sm">
            <div className="flex min-h-12 w-full items-center justify-center rounded-full border border-[#dde3ea] bg-[#f1f4f8] px-6 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_24px_rgba(148,163,184,0.12)]">
              <h2 className="text-sm font-semibold text-[#526274]">{column.label}</h2>
            </div>
          </div>
        ) : null}

        <div className="flex min-h-0 flex-1 flex-col rounded-[28px] border border-[#e6edf5] bg-[#f8fafc] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_32px_rgba(148,163,184,0.14)]">
          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {tasks.length > 0 ? (
              tasks.map((task: any) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  draggable
                  onDragStart={() => onDragStart(task)}
                  userId={userId}
                  onDelete={onDelete}
                  mode={mode}
                />
              ))
            ) : (
              <div className="flex min-h-[140px] items-center justify-center rounded-[24px] border-2 border-dashed border-[#c7d8e8] bg-[#f9fbfd] px-4 py-6 text-center">
                <span className="text-sm font-medium text-[#8aa0b6]">Drop task here</span>
              </div>
            )}

            <div className="flex min-h-[140px] items-center justify-center rounded-[24px] border-2 border-dashed border-[#d3deea] bg-[#fbfcfe] px-4 py-6 text-center">
              <span className="text-sm font-medium text-[#9caec0]">Empty slot</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-w-0 flex-1 flex-col rounded-2xl bg-gray-50 p-4"
      onDrop={(e) => onDrop(e, column)}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="mb-4 flex justify-center border-b border-gray-300 pb-2">
        <h2 className="text-lg font-semibold">{column.label}</h2>
      </div>

      <div className="grid flex-1 auto-rows-max gap-3 overflow-y-auto pr-1 scrollbar-hide">
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
            className="flex min-h-[128px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-4 text-gray-400 transition-all duration-200 hover:border-blue-500 hover:text-blue-500"
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
