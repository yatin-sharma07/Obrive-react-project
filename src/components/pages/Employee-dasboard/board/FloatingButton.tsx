"use client";

export default function FloatingButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-black text-white text-2xl shadow-lg"
    >
      +
    </button>
  );
}