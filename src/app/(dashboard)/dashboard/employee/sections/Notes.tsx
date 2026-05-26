"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { apiFetch } from "@/lib/api";
import Board, {
	type BoardColumn,
} from "@/components/pages/Employee-dasboard/board/Board";
import { getYesterdayThroughNextFourDays } from "@/components/pages/Employee-dasboard/constants/dates";
import SkeletonLoading from "@/components/SkelitonLoading";

type NoteCard = {
	id: string;
	title: string;
	note_date: string;
	color?: string;
	position?: number;
	user_id?: string;
	author_name?: string;
};

export default function Notes() {
	const dayColumns = useMemo<BoardColumn[]>(
		() => getYesterdayThroughNextFourDays(),
		[],
	);

	const dateRangeLabel = useMemo(() => {
		const first = dayColumns[0]?.label ?? "";
		const last = dayColumns[5]?.label ?? "";
		return first && last ? `${first}–${last}` : "";
	}, [dayColumns]);

	const [notes, setNotes] = useState<NoteCard[]>([]);
	const [loading, setLoading] = useState(true);
	const [fetchError, setFetchError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		const start = dayColumns[0]?.id;
		const end = dayColumns[5]?.id;

		if (!start || !end) {
			setLoading(false);
			return undefined;
		}

		const fetchNotes = async () => {
			try {
				setLoading(true);
				setFetchError(null);

				const res = await apiFetch(
					`/sticky-notes/by-range?startDate=${start}&endDate=${end}`,
				);

				const json = await res.json();

				if (!res.ok || !json?.data) {
					throw new Error(json?.message || "Could not load notes");
				}

				if (cancelled) return;

				const mapped: NoteCard[] = json.data.map(
					(note: any) => ({
						id: String(note.id),
						title: String(note.content ?? ""),
						note_date: new Date(String(note.note_date)).toLocaleDateString(
							"en-CA",
						),
						color: note.color != null ? String(note.color) : undefined,
						position:
							note.position != null ? Number(note.position) : undefined,
						user_id:
							note.user_id != null ? String(note.user_id) : undefined,
						author_name: note.users?.name,
					}),
				);

				setNotes(mapped);
			} catch (e) {
				if (!cancelled) {
					setFetchError(
						e instanceof Error ? e.message : "Failed to load notes",
					);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		void fetchNotes();
		return () => {
			cancelled = true;
		};
	}, [dayColumns]);

	if (loading) {
		return <SkeletonLoading />;
	}

	return (
		<motion.div
			className="flex h-full min-h-0 flex-col gap-2 overflow-hidden px-3 pb-3 pt-3 sm:gap-3 sm:px-6 sm:pb-4 sm:pt-4"
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35 }}
		>
			<header className="shrink-0 rounded-lg border border-[#e8f0fb] bg-[#eef7ff]/50 px-2.5 py-2 shadow-sm sm:px-3">
				<div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
					<h1 className="text-[12px] font-bold text-[#1a472a]">
						Sticky notes
					</h1>
					{dateRangeLabel ? (
						<span className="text-[10px] text-gray-500 sm:text-xs">
							{dateRangeLabel}
						</span>
					) : null}
				</div>
				<p className="text-[10px]  text-gray-500">
					Yesterday through the next four days. Drag a note to another column to
					reschedule.
				</p>
				{fetchError ? (
					<p
						className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] text-amber-800 sm:text-xs"
						role="alert"
					>
						{fetchError}
					</p>
				) : null}
			</header>

			<div className="flex min-h-0 min-w-0 flex-1">
				<Board
					columns={dayColumns}
					tasks={notes}
					setTasks={setNotes}
					addButtonLabel="Add note"
				/>
			</div>
		</motion.div>
	);
}
