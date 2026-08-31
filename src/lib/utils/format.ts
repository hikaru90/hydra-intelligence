import type { Buoy } from '$lib/types';
import { DEPLOYMENT_LABEL } from '$lib/config';

/**
 * A relative label for a past ISO timestamp: "just now", "today",
 * "3 days ago", "2 weeks ago", ... Display-only — the stored value stays absolute.
 */
export function relativeTime(iso: string | null | undefined, now: Date = new Date()): string {
	if (!iso) return 'never';
	const then = new Date(iso).getTime();
	const diffMs = now.getTime() - then;
	if (diffMs < 0) return 'just now';

	const min = Math.floor(diffMs / 60000);
	if (min < 2) return 'just now';
	if (min < 60) return `${min} min ago`;
	if (isSameDay(new Date(then), now)) return 'today';

	const days = Math.floor(diffMs / 86400000);
	if (days === 1) return 'yesterday';
	if (days < 7) return `${days} days ago`;

	const weeks = Math.floor(days / 7);
	if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;

	const months = Math.floor(days / 30);
	if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;

	const years = Math.floor(days / 365);
	return `${years} year${years === 1 ? '' : 's'} ago`;
}

function isSameDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

/** Battery bar colour: green > 50%, yellow 20–50%, orange < 20%. */
export function batteryColor(pct: number): string {
	if (pct > 50) return '#15e49a';
	if (pct > 20) return '#FBFFAA';
	return '#FD7A4E';
}

/**
 * UI value formatting: at most one decimal place, trailing ".0" stripped.
 * (Product law: understandable in the UI, full precision on export.)
 */
export function formatValue(n: number): string {
	return n.toFixed(1).replace(/\.0$/, '');
}

/**
 * The adaptive subline for a buoy card: the free-text subject if present
 * (rendered italic by the card), otherwise the deployment-type label.
 */
export function buoySubline(buoy: Buoy): { text: string; italic: boolean } {
	if (buoy.subject && buoy.subject.trim().length > 0) {
		return { text: buoy.subject, italic: true };
	}
	return { text: DEPLOYMENT_LABEL[buoy.deployment] ?? 'Buoy', italic: false };
}
