/** Local calendar YYYY-MM-DD (aligns sticky `note_date` grouping with `/by-range`). */
export function toLocalYYYYMMDD(d: Date): string {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
}

/**
 * Yesterday, today, and the four following calendar days (6 columns).
 * No earlier past days beyond yesterday.
 */
export function getYesterdayThroughNextFourDays(
	ref: Date = new Date(),
): { id: string; label: string; isToday: boolean; isYesterday: boolean }[] {
	const anchor = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
	const todayStr = toLocalYYYYMMDD(new Date());

	return Array.from({ length: 6 }, (_, i) => {
		const offsetFromToday = i - 1;
		const day = new Date(anchor);
		day.setDate(anchor.getDate() + offsetFromToday);
		const id = toLocalYYYYMMDD(day);
		const label = day.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
		});
		return {
			id,
			label,
			isToday: id === todayStr,
			isYesterday: offsetFromToday === -1,
		};
	});
}

/** Seven columns Mon → Sun for the ISO-style week containing `ref`. */
export function getWeekMondayToSunday(
	ref: Date = new Date(),
): { id: string; label: string; isToday: boolean }[] {
	const anchor = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
	const dow = anchor.getDay();
	const mondayOffset = dow === 0 ? -6 : 1 - dow;
	anchor.setDate(anchor.getDate() + mondayOffset);

	const todayStr = toLocalYYYYMMDD(new Date());

	return Array.from({ length: 7 }, (_, i) => {
		const day = new Date(
			anchor.getFullYear(),
			anchor.getMonth(),
			anchor.getDate() + i,
		);
		const id = toLocalYYYYMMDD(day);
		const label = day.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
		});
		return { id, label, isToday: id === todayStr };
	});
}

export const getNext3Days = () => {
	const today = new Date();

	const formatLabel = (date: Date) =>
		date.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
		});

	const addDays = (days: number) => {
		const d = new Date();
		d.setDate(today.getDate() + days);
		return d;
	};

	const formatDate = (date: Date) => date.toISOString().split("T")[0];

	return Array.from({ length: 3 }, (_, i) => {
		const d = addDays(i);

		return {
			id: formatDate(d),
			label: formatLabel(d),
		};
	});
};

export const getNext60Days = () => {
	const today = new Date();

	const addDays = (days: number) => {
		const d = new Date();
		d.setDate(today.getDate() + days);
		return d;
	};

	const formatDate = (date: Date) => date.toISOString().split("T")[0];

	return Array.from({ length: 60 }, (_, i) => {
		const d = addDays(i);
		return formatDate(d);
	});
};
