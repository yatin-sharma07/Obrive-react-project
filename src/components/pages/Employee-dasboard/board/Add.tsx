"use client";

import { useEffect, useMemo, useState } from "react";
import { getNext3Days } from "../constants/dates";
import { apiFetch } from "@/lib/api";
import ConfirmationAlert from "@/components/ConfirmationAlert";

const COLOR_IDS = ["yellow", "blue", "red", "green", "purple", "orange"] as const;

const COLOR_HEX: Record<(typeof COLOR_IDS)[number], string> = {
	yellow: "#EAB308",
	blue: "#3B82F6",
	red: "#EF4444",
	green: "#22C55E",
	purple: "#A855F7",
	orange: "#F97316",
};

export type NoteDateSlot = { id: string; label: string };

type AddTaskModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onAdd: (task: {
		id: string;
		title: string;
		note_date: string;
		color?: string;
		position?: number;
		user_id?: string;
	}) => void;
	dateOptions?: NoteDateSlot[];
};

export default function AddTaskModal({
	isOpen,
	onClose,
	onAdd,
	dateOptions,
}: AddTaskModalProps) {
	const slots = useMemo(
		() => (dateOptions?.length ? dateOptions : getNext3Days()),
		[dateOptions],
	);

	const [title, setTitle] = useState("");
	const [noteDate, setNoteDate] = useState(slots[0]?.id ?? "");
	const [color, setColor] = useState<string>("yellow");
	const [openDate, setOpenDate] = useState(false);
	const [errorAlert, setErrorAlert] = useState<{ isOpen: boolean; message: string }>({
		isOpen: false,
		message: "",
	});

	useEffect(() => {
		if (!isOpen) return;
		setNoteDate((prev) =>
			slots.some((s) => s.id === prev) ? prev : (slots[0]?.id ?? ""),
		);
	}, [isOpen, slots]);

	if (!isOpen) return null;

	const handleSubmit = async () => {
		if (!title.trim()) return;

		try {
			const res = await apiFetch("/sticky-notes", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					content: title,
					note_date: noteDate,
					color,
					position: 0,
				}),
			});

			const json = await res.json();
			if (!res.ok) throw new Error(json.message || "Failed to add note");

			const saved = json.data;

			onAdd({
				id: saved.id.toString(),
				title: saved.content,
				note_date: new Date(saved.note_date).toLocaleDateString("en-CA"),
				color: saved.color,
				position: saved.position,
				user_id:
					saved.user_id != null ? String(saved.user_id) : undefined,
				author_name: saved.users?.name,
			});

			setTitle("");
			setColor("yellow");
			setNoteDate(slots[0]?.id ?? "");

			onClose();
		} catch (err: unknown) {
			console.error(err);
			setErrorAlert({
				isOpen: true,
				message: err instanceof Error ? err.message : "Failed to add note",
			});
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
			<div className="w-[360px] max-w-[calc(100vw-1.5rem)] space-y-5 rounded-2xl bg-white p-6 shadow-2xl">
				<h2 className="text-xl font-semibold text-gray-800">Add note</h2>

				<div className="space-y-1">
					<label className="text-sm text-gray-500" htmlFor="sticky-note-content">
						Content
					</label>
					<textarea
						id="sticky-note-content"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Write something to remember..."
						rows={3}
						className="w-full resize-none rounded-lg border border-gray-200 p-2 text-sm outline-none transition focus:border-[#1a472a] focus:ring-1 focus:ring-[#1a472a]"
					/>
				</div>

				<div className="relative">
					<label className="text-sm text-gray-500" htmlFor="sticky-note-date-trigger">
						Note date
					</label>

					<button
						id="sticky-note-date-trigger"
						type="button"
						onClick={() => setOpenDate(!openDate)}
						className="mt-1 flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-left text-sm transition hover:border-[#1a472a]"
					>
						<span>{slots.find((d) => d.id === noteDate)?.label}</span>
						<span className={`transition-transform ${openDate ? "rotate-180" : ""}`}>
							▼
						</span>
					</button>

					<div
						className={`absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-200 ${
							openDate
								? "pointer-events-auto scale-100 opacity-100"
								: "pointer-events-none scale-95 opacity-0"
						}`}
					>
						{slots.map((d) => (
							<button
								key={d.id}
								type="button"
								onClick={() => {
									setNoteDate(d.id);
									setOpenDate(false);
								}}
								className={`w-full px-3 py-2 text-left text-sm transition hover:bg-gray-100 ${
									noteDate === d.id ? "bg-gray-100 font-medium" : ""
								}`}
							>
								{d.label}
							</button>
						))}
					</div>
				</div>

				<div className="space-y-2">
					<label className="text-sm text-gray-500">Color</label>

					<div className="flex flex-wrap gap-2">
						{COLOR_IDS.map((c) => (
							<button
								key={c}
								type="button"
								onClick={() => setColor(c)}
								className={`h-9 w-9 rounded-full border-2 transition hover:scale-105 ${
									color === c
										? "border-[#1a472a] ring-2 ring-[#1a472a]/25"
										: "border-transparent ring-2 ring-transparent"
								}`}
								style={{ backgroundColor: COLOR_HEX[c] }}
								aria-label={c}
							/>
						))}
					</div>
				</div>

				<div className="flex justify-end gap-2 pt-2">
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg bg-gray-100 px-4 py-2 text-sm transition hover:bg-gray-200"
					>
						Cancel
					</button>

					<button
						type="button"
						onClick={handleSubmit}
						className="rounded-lg bg-[#073933] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0a4a42]"
					>
						Add note
					</button>
				</div>

				<ConfirmationAlert
					isOpen={errorAlert.isOpen}
					title="Error"
					description={errorAlert.message}
					type="error"
					cancelLabel="Close"
					onCancel={() => setErrorAlert({ isOpen: false, message: "" })}
				/>
			</div>
		</div>
	);
}
