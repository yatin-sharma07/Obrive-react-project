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

	const emptyHint =
		mode === "notes" ? "No notes for this day" : "Drop task here";
	const addLabel = mode === "notes" ? "Add note" : "Add task";

	return (
		<div
			className="flex h-full min-h-0 min-w-0 w-full flex-1 flex-col rounded-[28px] border border-[#e6edf5] bg-[#f8fafc] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_28px_rgba(148,163,184,0.12)]"
			onDrop={(e) => onDrop(e, column)}
			onDragOver={(e) => e.preventDefault()}
		>
			<div
				className={`mb-4 flex flex-col items-center justify-center rounded-full border bg-[#f1f4f8] px-4 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] ${
					column.isToday
						? "border-[#9fc5eb] ring-2 ring-[#cfe6ff]/90 ring-offset-2 ring-offset-[#f8fafc]"
						: column.isYesterday
							? "border-amber-200/90 ring-1 ring-amber-200/70 ring-offset-2 ring-offset-[#f8fafc]"
							: "border-[#dde3ea]"
				}`}
			>
				<h2 className="text-sm font-semibold text-[#526274]">{column.label}</h2>
				{column.isToday ? (
					<span className="mt-1.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1a472a]">
						Today
					</span>
				) : column.isYesterday ? (
					<span className="mt-1.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
						Yesterday
					</span>
				) : null}
			</div>

			<div className="grid min-h-0 min-w-0 flex-1 auto-rows-max gap-3 overflow-y-auto overflow-x-hidden pr-1 scrollbar-hide">
				{tasks.length === 0 ? (
					<div className="flex min-h-[100px] items-center justify-center rounded-2xl border-2 border-dashed border-[#c7d8e8] bg-white/60 px-4 py-6 text-center">
						<span className="text-sm font-medium text-[#8aa0b6]">{emptyHint}</span>
					</div>
				) : (
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
				)}

				{handleAddCardOpen ? (
					<button
						type="button"
						className="flex min-h-[120px] w-full shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-[#c7d8e8] bg-white/70 px-3 py-4 text-[#627d98] transition duration-200 hover:border-[#073933]/40 hover:bg-white hover:text-[#073933] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#073933]"
						onClick={() => handleAddCardOpen()}
					>
						<span className="select-none text-2xl font-light leading-none">+</span>
						<span className="shrink-0 text-center text-sm font-medium leading-snug whitespace-nowrap">
							{addLabel}
						</span>
					</button>
				) : null}
			</div>
		</div>
	);
}
