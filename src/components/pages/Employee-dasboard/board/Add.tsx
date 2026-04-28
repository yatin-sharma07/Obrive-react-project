"use client";

import { useState } from "react";
import { getNext3Days } from "../constants/dates";
import { apiFetch } from "@/lib/api";

const COLORS = ["yellow", "blue", "red", "green", "purple", "orange"];

export default function AddTaskModal({ isOpen, onClose, onAdd }: any) {
  const dates = getNext3Days();

  const [title, setTitle] = useState("");
  const [noteDate, setNoteDate] = useState(dates[0].id);
  const [color, setColor] = useState("yellow");
  const [openDate, setOpenDate] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title.trim()) return;

    try {
      const res = await apiFetch("/sticky-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ important
        },
        body: JSON.stringify({
          content: title,
          note_date: noteDate,
          color,
          position: 0,
        }),
      });

      const json = await res.json();
      const saved = json.data;

      // ✅ update UI instantly
      onAdd({
        id: saved.id.toString(),
        title: saved.content,
        note_date: new Date(saved.note_date).toLocaleDateString("en-CA"),
        color: saved.color,
        position: saved.position,
         user_id: saved.user_id, 
      });

      // ✅ reset form
      setTitle("");
      setColor("yellow");
      setNoteDate(dates[0].id);

      // ✅ close modal
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add task");
    }
  };

  return (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white w-[360px] rounded-2xl shadow-2xl p-6 space-y-5 animate-fadeIn">
      
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800">
        Add New Note
      </h2>

      {/* Input */}
      <div className="space-y-1">
        <label className="text-sm text-gray-500">Task</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your task..."
          className="w-full border border-gray-200 focus:border-black focus:ring-1 focus:ring-black rounded-lg p-2 outline-none transition"
        />
      </div>

      {/* Date */}
     <div className="relative">
  <label className="text-sm text-gray-500">Date</label>

  {/* Trigger */}
  <button
    onClick={() => setOpenDate(!openDate)}
    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg flex justify-between items-center hover:border-black transition"
  >
    <span>
      {dates.find((d) => d.id === noteDate)?.label}
    </span>
    <span className={`transition-transform ${openDate ? "rotate-180" : ""}`}>
      ▼
    </span>
  </button>

  {/* Dropdown */}
  <div
    className={`absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-200 z-50 ${
      openDate ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
    }`}
  >
    {dates.map((d) => (
      <button
        key={d.id}
        onClick={() => {
          setNoteDate(d.id);
          setOpenDate(false);
        }}
        className={`w-full text-left px-3 py-2 hover:bg-gray-100 transition ${
          noteDate === d.id ? "bg-gray-100 font-medium" : ""
        }`}
      >
        {d.label}
      </button>
    ))}
  </div>
</div>

      {/* Color */}
      <div className="space-y-2">
        <label className="text-sm text-gray-500">Color</label>

        <div className="flex gap-2 flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full border-2 transition ${
                color === c
                  ? "border-black scale-110"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-sm rounded-lg bg-black text-white hover:bg-gray-800 transition"
        >
          Add Note
        </button>
      </div>
    </div>
  </div>
);
}