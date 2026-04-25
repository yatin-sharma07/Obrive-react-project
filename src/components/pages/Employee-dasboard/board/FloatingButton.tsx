"use client";

export default function FloatingButton({ onClick, label = "Add Note +" }: any) {
  return (
    <button
      onClick={onClick}
      className="fixed top-8 z-10 right-10 bg-green-900 text-white px-4 py-2 rounded"
    >
      {label}
    </button>
  );
}
