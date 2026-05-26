"use client";

import { useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import ConfirmationAlert from "@/components/ConfirmationAlert";
import StickyNoteCard, { StickyNoteDetailModal } from "./StickyNoteCard";

type Task = {
	id: string;
	title: string;
	note_date?: string;
	color?: string;
	position?: number;
	user_id?: string;
	author_name?: string;
	status?: "pending" | "in-progress" | "completed";
	description?: string;
	task_number?: string;
};

type Props = {
	task: Task;
	userId: string | null;
	onDelete: (id: string) => void;
	mode?: "notes" | "tasks";
} & React.HTMLAttributes<HTMLDivElement>;

const statusConfig = {
	pending: {
		label: "Pending",
		icon: Circle,
		badge: "bg-amber-100 text-amber-700",
		border: "#f59e0b",
	},
	"in-progress": {
		label: "In Progress",
		icon: Clock3,
		badge: "bg-sky-100 text-sky-700",
		border: "#0ea5e9",
	},
	completed: {
		label: "Completed",
		icon: CheckCircle2,
		badge: "bg-emerald-100 text-emerald-700",
		border: "#10b981",
	},
};

function readableNoteFooter(noteDateKey: string) {
	if (/^\d{4}-\d{2}-\d{2}$/.test(noteDateKey)) {
		const d = new Date(`${noteDateKey}T12:00:00`);
		if (!Number.isNaN(d.getTime())) {
			return d.toLocaleDateString("en-US", {
				weekday: "short",
				month: "short",
				day: "numeric",
				year: "numeric",
			});
		}
	}
	return noteDateKey;
}

const TAP_SQ_DIST = 10 * 10;

export default function TaskCard({
	task,
	userId,
	onDelete,
	mode = "notes",
	className,
	...props
}: Props) {
	const [showConfirm, setShowConfirm] = useState(false);
	const [detailOpen, setDetailOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorAlert, setErrorAlert] = useState<{ isOpen: boolean; message: string }>(
		{ isOpen: false, message: "" },
	);
	const pointerOriginRef = useRef<{ x: number; y: number } | null>(null);

	const handleDelete = async () => {
		try {
			setLoading(true);

			const res = await apiFetch(`/sticky-notes/${task.id}`, {
				method: "DELETE",
			});

			if (!res.ok) {
				const json = await res.json();
				throw new Error(json.message || "Failed to delete note");
			}

			onDelete(task.id);
			setShowConfirm(false);
		} catch (err: unknown) {
			console.error(err);
			setErrorAlert({
				isOpen: true,
				message: err instanceof Error ? err.message : "Failed to delete note",
			});
		} finally {
			setLoading(false);
		}
	};

	const taskStatus = task.status && statusConfig[task.status];
	const StatusIcon = taskStatus?.icon;

	const canDelete = Boolean(
		userId && task.user_id && String(userId) === String(task.user_id),
	);

	return (
		<>
			<div
				{...props}
				className={[
					mode === "tasks"
						? "relative mb-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
						: "relative mb-3 cursor-grab select-none active:cursor-grabbing",
					className,
				]
					.filter(Boolean)
					.join(" ")}
				onPointerDown={(e) => {
					if (mode === "notes") {
						pointerOriginRef.current = { x: e.clientX, y: e.clientY };
					}
					props.onPointerDown?.(e);
				}}
				onDragStart={(e) => {
					pointerOriginRef.current = null;
					props.onDragStart?.(e);
				}}
				onClick={(e) => {
					props.onClick?.(e);
					if (mode !== "notes") return;
					const start = pointerOriginRef.current;
					pointerOriginRef.current = null;
					if (!start) return;
					const dx = e.clientX - start.x;
					const dy = e.clientY - start.y;
					if (dx * dx + dy * dy > TAP_SQ_DIST) return;
					setDetailOpen(true);
				}}
			>
				{mode === "tasks" ? (
					<>
						{task.task_number ? (
							<p className="mb-2 text-[10px] text-gray-400">{task.task_number}</p>
						) : null}
						<p className="font-semibold text-[13px] text-[#1a472a]">{task.title}</p>
						{task.description ? (
							<p className="mt-1 text-[10px] text-gray-500">{task.description}</p>
						) : null}
						{taskStatus && StatusIcon ? (
							<span
								className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${taskStatus.badge}`}
							>
								<StatusIcon className="h-3.5 w-3.5" />
								{taskStatus.label}
							</span>
						) : null}
					</>
				) : (
					<StickyNoteCard
						noteId={task.id}
						content={task.title}
						noteDateKey={task.note_date ?? ""}
						displayDate={readableNoteFooter(task.note_date ?? "")}
						color={task.color}
						position={task.position}
						canDelete={canDelete}
						onDeletePress={() => setShowConfirm(true)}
						authorName={task.author_name}
					/>
				)}
			</div>

			{mode === "notes" ? (
				<StickyNoteDetailModal
					open={detailOpen}
					onClose={() => setDetailOpen(false)}
					noteId={task.id}
					content={task.title}
					noteDateKey={task.note_date ?? ""}
					displayDate={readableNoteFooter(task.note_date ?? "")}
					color={task.color}
					position={task.position}
					canDelete={canDelete}
					onDeletePress={() => setShowConfirm(true)}
					authorName={task.author_name}
				/>
			) : null}

			{mode === "notes" && showConfirm ? (
				<div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30">
					<div className="w-[300px] space-y-3 rounded bg-white p-4">
						<div className="space-y-1">
							<h3 className="text-lg font-semibold text-gray-900">Delete note</h3>
							<p className="text-sm text-gray-600">
								Are you sure you want to delete this note?
							</p>
						</div>

						<div className="flex justify-end gap-2">
							<button
								onClick={() => setShowConfirm(false)}
								className="rounded bg-gray-200 px-3 py-1"
							>
								Cancel
							</button>

							<button
								onClick={handleDelete}
								disabled={loading}
								className="rounded bg-red-500 px-3 py-1 text-white"
							>
								{loading ? "Deleting..." : "Delete"}
							</button>
						</div>
					</div>
				</div>
			) : null}

			<ConfirmationAlert
				isOpen={errorAlert.isOpen}
				title="Error"
				description={errorAlert.message}
				type="error"
				cancelLabel="Close"
				onCancel={() => setErrorAlert({ isOpen: false, message: "" })}
			/>
		</>
	);
}
