"use client";

type FloatingButtonProps = {
  onClick: () => void;
};

export default function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-37 right-10 w-45 h-10 bg-green-900 text-white text-xl shadow-lg rounded-lg"
    >
     Add Note +
    </button>
  );
}