"use client";

export default function TaskCard({ task, ...dragProps }) {
  return (
    <div
      {...dragProps}
      className="p-4 rounded-lg mb-3 cursor-grab"
      style={{ backgroundColor: task.color }}
    >
      <p className="font-medium">{task.title}</p>
      <span className="text-sm opacity-70">{task.duration}</span>
    </div>
  );
}