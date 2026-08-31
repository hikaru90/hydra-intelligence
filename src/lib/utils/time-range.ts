import type { TimeRange } from '$lib/types';

const HOUR = 3_600_000;
const DAY = 86_400_000;

function fmtDayMonth(d: Date): string {
	return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
function fmtTime(d: Date): string {
	return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

/** Length of a trend window in ms (used to place ticks and compute the start). */
export function rangeSpan(range: Exclude<TimeRange, 'now'>): number {
	if (range === '24h') return 24 * HOUR;
	if (range === '7d') return 6 * DAY;
	return 29 * DAY;
}

/** The one-line "Last 7 days · 3 Jun – 9 Jun" style label under the controls. */
export function resolvedRangeLabel(range: TimeRange, now: Date = new Date()): string {
	if (range === 'now') {
		return `Latest reading · ${fmtTime(now)}, ${fmtDayMonth(now)}`;
	}
	const start = new Date(now.getTime() - rangeSpan(range));
	if (range === '24h') {
		return `Last 24 h · ${fmtDayMonth(start)} ${fmtTime(start)} → ${fmtDayMonth(now)} ${fmtTime(now)}`;
	}
	const label = range === '7d' ? 'Last 7 days' : 'Last 30 days';
	return `${label} · ${fmtDayMonth(start)} – ${fmtDayMonth(now)}`;
}

/** Evenly spaced x-axis tick labels: clock times for 24h, dates otherwise. */
export function timeAxisTicks(
	range: Exclude<TimeRange, 'now'>,
	count: number,
	now: Date = new Date()
): string[] {
	const span = rangeSpan(range);
	const start = now.getTime() - span;
	const ticks: string[] = [];
	for (let i = 0; i < count; i++) {
		const t = new Date(start + (i / (count - 1)) * span);
		ticks.push(range === '24h' ? fmtTime(t) : fmtDayMonth(t));
	}
	return ticks;
}
