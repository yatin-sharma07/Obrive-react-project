"use client";

import { useState } from "react";

export default function AddTaskModal({ isOpen, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [column, setColumn] = useState("today");
  const [color, setColor] = useState("#A8D5BA");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title,
      duration,
      column,
      color,
    };

    onAdd(newTask);

    // reset
    setTitle("");
    setDuration("");
    setColumn("today");
    setColor("#A8D5BA");

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[300px] space-y-3">
        <h2 className="font-semibold">Add Task</h2>

        <input
          className="w-full border p-2"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="w-full border p-2"
          placeholder="Duration (e.g 0:20h)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        {/* DATE SELECT (ONLY 3 OPTIONS) */}
        <select
          className="w-full border p-2"
          value={column}
          onChange={(e) => setColumn(e.target.value)}
        >
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="dayAfterTomorrow">Day After Tomorrow</option>
        </select>

        {/* COLOR PICKER */}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white p-2 rounded"
        >
          Add Task
        </button>

        <button
          onClick={onClose}
          className="w-full border p-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}