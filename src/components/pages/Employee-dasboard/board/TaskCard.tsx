"use client";

type Task = {
  id: string;
  title: string;
  description: string;
  duration: string;
  column: string;
  color: string;
  status: "Urgent" | "Medium" | "Low";
};

type TaskCardProps = {
  task: Task;
} & React.HTMLAttributes<HTMLDivElement>;

export default function TaskCard({ task, ...dragProps }: TaskCardProps) {
  return (
    <div
      {...dragProps}
      className="relative p-5 rounded-[28px] mb-4 cursor-grab border border-gray-200 shadow-sm bg-gray-50 flex flex-col justify-between h-[160px] border-l-8 border-${task.color}"
          style={{ borderLeftColor: task.color }}
      
    >
      {/* Curved Left Strip */}
      <div
        className=""
      >

      {/* Top Section */}
      <div className="space-y-2">
        {/* Label */}
        <p className="text-xs tracking-widest text-gray-400 font-semibold">
          {task.column.toUpperCase()}
        </p>

        {/* Title */}
        <p className="font-semibold text-gray-900 text-lg leading-snug">
          {task.title}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-snug">
          {task.description}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between mt-4">
        {/* Avatars */}
        <div className="flex -space-x-2">
          <img
            src="https://i.pravatar.cc/40?img=1"
            className="w-7 h-7 rounded-full border-2 border-white"
          />
          <img
            src="https://i.pravatar.cc/40?img=2"
            className="w-7 h-7 rounded-full border-2 border-white"
          />
        </div>

        {/* Status Badge */}
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            task.status === "Urgent"
              ? "bg-red-100 text-red-500"
              : task.status === "Medium"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {task.status}
        </span>
      </div>
    </div>
    </div>
  );
}