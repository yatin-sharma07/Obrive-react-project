"use client";

import { CalendarDays, ChevronDown, ChevronUp, X } from "lucide-react";

const NOTE_PALETTE: Record<
	string,
	{ box: string; label: string; priorityIcon: typeof ChevronUp; priorityTone: string }
> = {
	yellow: {
		box: "bg-amber-50 border-amber-200",
		label: "Yellow",
		priorityIcon: ChevronUp,
		priorityTone: "text-amber-600",
	},
	blue: {
		box: "bg-sky-50 border-sky-200",
		label: "Blue",
		priorityIcon: ChevronDown,
		priorityTone: "text-sky-600",
	},
	red: {
		box: "bg-rose-50 border-rose-200",
		label: "Red",
		priorityIcon: ChevronUp,
		priorityTone: "text-rose-600",
	},
	green: {
		box: "bg-emerald-50 border-emerald-200",
		label: "Green",
		priorityIcon: ChevronDown,
		priorityTone: "text-emerald-600",
	},
	purple: {
		box: "bg-violet-50 border-violet-200",
		label: "Purple",
		priorityIcon: ChevronDown,
		priorityTone: "text-violet-600",
	},
	orange: {
		box: "bg-orange-50 border-orange-200",
		label: "Orange",
		priorityIcon: ChevronUp,
		priorityTone: "text-orange-600",
	},
};

const DEFAULT_NOTE_STYLE = {
	box: "bg-[#eef7ff] border-[#d9ecff]",
	label: "Note",
	priorityIcon: ChevronDown,
	priorityTone: "text-gray-500",
};

export type StickyNoteFields = {
	noteId: string;
	content: string;
	noteDateKey: string;
	displayDate: string;
	color?: string;
	position?: number;
	canDelete?: boolean;
	onDeletePress?: () => void;
	authorName?: string;
};

function paletteFor(color?: string) {
	const key = color?.trim().toLowerCase() ?? "";
	return NOTE_PALETTE[key] ?? DEFAULT_NOTE_STYLE;
}

export default function StickyNoteCard({
	noteId,
	content,
	noteDateKey,
	displayDate,
	color,
	position,
	canDelete,
	onDeletePress,
	authorName,
}: StickyNoteFields) {
	const style = paletteFor(color);
	const shortDate =
		displayDate.length > 18 ? `${displayDate.slice(0, 16)}…` : displayDate;

	return (
		<div className="relative h-[7.25rem] w-full max-w-full min-w-0 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-[#e8f0fb] bg-white shadow-sm">
			{canDelete && onDeletePress ? (
				<button
					type="button"
					draggable={false}
					onPointerDown={(e) => e.stopPropagation()}
					onClick={(e) => {
						e.stopPropagation();
						onDeletePress();
					}}
					className="absolute right-1 top-1 z-10 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-red-500"
					aria-label="Remove note"
				>
					<X className="h-3.5 w-3.5" />
				</button>
			) : null}

			<div className="flex h-full flex-col p-2 pr-8 pt-5">
				<div className="flex min-h-0 flex-1 gap-1.5">
					<div
						className={`mt-0.5 h-4 w-4 flex-shrink-0 rounded border ${style.box}`}
						aria-hidden
					/>
					<div className="flex min-h-0 min-w-0 flex-1 flex-col">
						<div className="flex justify-between items-center">
							<p className="truncate text-[8px] tabular-nums leading-none text-gray-400">
								NOTE-{noteId}
							</p>
							{authorName && (
								<p className="truncate text-[8px] font-bold text-blue-500 max-w-[50%]">
									{authorName}
								</p>
							)}
						</div>
						<p
							className="mt-1 line-clamp-2 text-[10px] font-semibold leading-snug text-[#1a472a]"
							title={content}
						>
							{content}
						</p>
					</div>
				</div>
				<div className="mt-auto flex shrink-0 items-center justify-between gap-1 border-t border-[#f0f4fa] pt-1.5 text-[8px] text-gray-500">
					<span className="min-w-0 truncate" title={displayDate}>
						{shortDate}
					</span>
					<span className={`shrink-0 capitalize ${style.priorityTone}`}>
						{color ?? "yellow"}
					</span>
				</div>
				<span className="mt-1 text-center text-[7px] uppercase tracking-wide text-gray-400">
					Click to open
				</span>
			</div>
		</div>
	);
}

export function StickyNoteDetailModal({
	open,
	onClose,
	noteId,
	content,
	noteDateKey,
	displayDate,
	color,
	position,
	canDelete,
	onDeletePress,
	authorName,
}: StickyNoteFields & { open: boolean; onClose: () => void }) {
	if (!open) return null;

	const style = paletteFor(color);
	const PriorityIcon = style.priorityIcon;

	return (
		<div
			className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
			role="dialog"
			aria-modal="true"
			aria-labelledby="sticky-note-detail-title"
			onMouseDown={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="flex max-h-[min(560px,85vh)] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-[#e8f0fb] bg-white shadow-2xl">
				<div className="flex items-start justify-between border-b border-[#eef4ff] px-4 py-3">
					<h2 id="sticky-note-detail-title" className="text-sm font-bold text-[#1a472a]">
						Sticky note
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
						aria-label="Close"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto px-4 py-3">
					<div className="rounded-lg border border-[#e8f0fb] bg-white shadow-sm">
						<div className="flex flex-col gap-3 p-3 sm:flex-row">
							<div className="min-w-0 flex-1 sm:max-w-[44%]">
								<div className="flex items-start gap-2">
									<div
										className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border ${style.box}`}
										aria-hidden
									/>
									<div className="min-w-0 flex-1">
										<p className="text-[10px] text-gray-400">NOTE-{noteId}</p>
										<div className="mt-1 max-h-[min(240px,40vh)] overflow-y-auto text-xs font-semibold leading-relaxed text-[#1a472a] sm:text-sm">
											<p className="whitespace-pre-wrap break-words">{content}</p>
										</div>
										<div className="mt-2 flex flex-wrap items-center justify-between gap-2">
											<div className="flex min-w-0 items-center gap-1 text-[10px] text-gray-500">
												<CalendarDays className="h-3 w-3 shrink-0" aria-hidden />
												<span className="break-words">{displayDate}</span>
											</div>
											<div
												className={`flex shrink-0 items-center gap-0.5 text-[10px] font-semibold ${style.priorityTone}`}
											>
												<PriorityIcon className="h-3 w-3" aria-hidden />
												<span className="capitalize">{style.label}</span>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="hidden h-auto w-px shrink-0 bg-[#eef4ff] sm:block" />

							<div className="grid min-w-0 flex-1 grid-cols-2 gap-2 sm:grid-cols-3">
								<div>
									<p className="text-[10px] text-gray-400">Author</p>
									<p className="mt-0.5 break-all text-xs font-bold text-blue-500">
										{authorName || "Unknown"}
									</p>
								</div>
								<div>
									<p className="text-[10px] text-gray-400">Note date</p>
									<p className="mt-0.5 break-all text-xs font-bold text-[#1a472a]">
										{noteDateKey}
									</p>
								</div>
								<div>
									<p className="text-[10px] text-gray-400">Color</p>
									<p className="mt-0.5 text-xs font-bold capitalize text-[#1a472a]">
										{color ?? "yellow"}
									</p>
								</div>
								<div className="col-span-2 sm:col-span-1">
									<p className="text-[10px] text-gray-400">Position</p>
									<p className="mt-0.5 text-xs font-bold text-[#1a472a]">
										{typeof position === "number" ? position : "—"}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#eef4ff] px-4 py-3">
					{canDelete && onDeletePress ? (
						<button
							type="button"
							onClick={() => {
								onClose();
								onDeletePress();
							}}
							className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
						>
							Remove note
						</button>
					) : null}
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg bg-[#073933] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#0a4a42]"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}
