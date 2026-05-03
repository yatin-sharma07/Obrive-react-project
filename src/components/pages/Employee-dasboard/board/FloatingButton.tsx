"use client";

import { Plus } from "lucide-react";

type FloatingButtonProps = {
	onClick: () => void;
	label?: string;
};

export default function FloatingButton({
	onClick,
	label = "Add note",
}: FloatingButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#073933] px-5 py-3 text-sm font-medium text-white shadow-lg shadow-[#073933]/25 transition hover:bg-[#0a4a42] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#073933] sm:min-w-[158px]"
		>
			<Plus className="h-4 w-4 shrink-0" aria-hidden />
			<span className="shrink-0">{label}</span>
		</button>
	);
}
