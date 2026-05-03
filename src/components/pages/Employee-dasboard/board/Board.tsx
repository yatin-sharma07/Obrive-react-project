"use client";

import { Fragment, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getNext3Days } from "../constants/dates";
import Column from "./TaskColumn";
import FloatingButton from "./FloatingButton";
import AddTaskModal from "./Add";

export type BoardColumn = {
	id: string;
	label: string;
	isToday?: boolean;
	isYesterday?: boolean;
};

type BoardTask = {
	id: string;
	title: string;
	note_date?: string;
	status?: string;
	color?: string;
	position?: number;
	user_id?: string;
	description?: string;
	task_number?: string;
};

type BoardProps = {
	mode?: "notes" | "tasks";
	tasks?: BoardTask[];
	setTasks?: React.Dispatch<React.SetStateAction<any[]>>;
	columns?: BoardColumn[];
	getTaskColumnId?: (task: BoardTask) => string;
	onTaskDrop?: (
		task: BoardTask,
		columnId: string,
	) => Promise<BoardTask | void> | BoardTask | void;
	showAddTask?: boolean;
	addButtonLabel?: string;
};

export default function Board({
	mode = "notes",
	tasks: propTasks,
	setTasks: propSetTasks,
	columns: propColumns,
	getTaskColumnId,
	onTaskDrop,
	showAddTask,
	addButtonLabel,
}: BoardProps) {
	const columns = propColumns ?? getNext3Days();
	const NOTES_BOARD_GRID =
		"grid min-h-0 min-w-0 w-full max-w-full flex-1 grid-cols-2 gap-3 overflow-x-hidden overflow-y-auto pb-2 [grid-auto-rows:minmax(0,1fr)] sm:grid-cols-3 lg:grid-cols-6";
	const NOTES_COLUMN_SHELL =
		"flex h-full min-h-0 min-w-0 flex-1 flex-col basis-0 overflow-hidden";

	const [draggedTask, setDraggedTask] = useState<BoardTask | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [userId, setUserId] = useState<string | null>(null);

	const [localTasks, setLocalTasks] = useState<any[]>([]);
	const tasks = propTasks !== undefined ? propTasks : localTasks;
	const setTasks = propSetTasks !== undefined ? propSetTasks : setLocalTasks;
	const shouldShowAddTask = showAddTask ?? mode === "notes";
	const taskColumnId =
		getTaskColumnId ??
		((task: BoardTask) => (mode === "tasks" ? task.status || "" : task.note_date || ""));

	useEffect(() => {
		const fetchUserId = async () => {
			try {
				const res = await apiFetch("/employee/me");
				if (res.ok) {
					const json = await res.json();
					const fetchedUserId = json.data.id || json.data.userid;
					setUserId(String(fetchedUserId));
				}
			} catch (err) {
				console.error("Failed to fetch user ID");
			}
		};
		fetchUserId();
	}, []);

	useEffect(() => {
		if (mode !== "notes" || propTasks !== undefined) return;

		const fetchTasks = async () => {
			try {
				const res = await apiFetch("/sticky-notes");
				if (res.ok) {
					const json = await res.json();
					const formattedTasks = json.data.map((task: any) => ({
						id: task.id.toString(),
						title: task.content,
						note_date: new Date(task.note_date).toLocaleDateString("en-CA"),
						color: task.color,
						position: task.position,
						user_id: task.user_id != null ? String(task.user_id) : undefined,
					}));
					setTasks(formattedTasks);
				}
			} catch (err) {
				console.error("Failed to fetch tasks:", err);
			}
		};
		fetchTasks();
	}, [mode, propTasks, setTasks]);

	const handleAddCardOpen = () => setIsModalOpen(true);

	const handleDrop = async (e: any, column: BoardColumn) => {
		e.preventDefault();
		if (!draggedTask) return;

		const nextColumnId = column.id;
		const previousTasks = tasks;

		setTasks((prev: any[]) =>
			prev.map((t) =>
				t.id === draggedTask.id
					? {
							...t,
							...(mode === "tasks" ? { status: nextColumnId } : { note_date: nextColumnId }),
						}
					: t,
			),
		);

		try {
			if (onTaskDrop) {
				const updatedTask = await onTaskDrop(draggedTask, nextColumnId);
				if (updatedTask) {
					setTasks((prev: any[]) =>
						prev.map((t) => (t.id === draggedTask.id ? { ...t, ...updatedTask } : t)),
					);
				}
			} else if (mode === "notes") {
				await apiFetch(`/sticky-notes/${draggedTask.id}`, {
					method: "PUT",
					body: JSON.stringify({ note_date: nextColumnId }),
				});
			}
		} catch (error) {
			setTasks(previousTasks);
		} finally {
			setDraggedTask(null);
		}
	};

	const handleDelete = (id: string) => {
		setTasks((prev: any[]) => prev.filter((t) => t.id !== id));
	};

	const handleAddTask = (task: any) => {
		setTasks((prev: any[]) => [...prev, task]);
	};

	return (
		<div
			className={
				mode === "tasks"
					? "flex h-full min-h-0 flex-col gap-4 overflow-hidden"
					: "flex h-full min-h-0 flex-col overflow-hidden"
			}
		>
			{mode === "tasks" ? (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{columns.map((col) => (
						<div
							key={col.id}
							className="mx-auto inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#dde3ea] bg-[#f1f4f8] px-6 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_24px_rgba(148,163,184,0.12)]"
						>
							<h2 className="text-sm font-semibold text-[#526274]">{col.label}</h2>
						</div>
					))}
				</div>
			) : null}

			{mode === "tasks" ? (
				<div className="rounded-[22px] bg-[#e3e8ef] px-6 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_10px_24px_rgba(148,163,184,0.18)]">
					<h2 className="text-sm font-semibold tracking-[0.18em] text-[#5f6f83] uppercase">
						Active Tasks
					</h2>
				</div>
			) : null}

			<div
				className={
					mode === "tasks"
						? "grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-x-auto pb-2 md:grid-cols-3"
						: NOTES_BOARD_GRID
				}
			>
				{userId !== null &&
					columns.map((col) => {
						const columnEl = (
							<Column
								column={col}
								tasks={tasks.filter((t: any) => taskColumnId(t) === col.id)}
								onDrop={handleDrop}
								onDelete={handleDelete}
								onDragStart={(task: BoardTask) => setDraggedTask(task)}
								userId={userId}
								handleAddCardOpen={shouldShowAddTask ? handleAddCardOpen : undefined}
								mode={mode}
								showLabel={mode !== "tasks"}
							/>
						);

						if (mode === "notes") {
							return (
								<div key={col.id} className={NOTES_COLUMN_SHELL}>
									{columnEl}
								</div>
							);
						}

						return <Fragment key={col.id}>{columnEl}</Fragment>;
					})}
			</div>

			{mode === "tasks" ? (
				<div className="rounded-[22px] bg-[#e3e8ef] px-6 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_10px_24px_rgba(148,163,184,0.18)]">
					<h2 className="text-sm font-semibold tracking-[0.18em] text-[#5f6f83] uppercase">
						Backlog
					</h2>
				</div>
			) : null}

			{shouldShowAddTask && (
				<>
					<div className="pointer-events-none fixed bottom-6 right-4 z-50 sm:bottom-8 sm:right-8">
						<div className="pointer-events-auto shrink-0">
							<FloatingButton
								onClick={handleAddCardOpen}
								label={addButtonLabel || "Add note"}
							/>
						</div>
					</div>
					<AddTaskModal
						isOpen={isModalOpen}
						onClose={() => setIsModalOpen(false)}
						onAdd={handleAddTask}
						dateOptions={columns.map(({ id, label }) => ({ id, label }))}
					/>
				</>
			)}
		</div>
	);
}
