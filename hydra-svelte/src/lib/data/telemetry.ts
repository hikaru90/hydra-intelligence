import type { ParameterId, TimeRange, TrendStat } from '$lib/types';

// Mock telemetry that stands in for PocketBase until the backend is wired.
// Every function is keyed by parameter id so components never touch raw numbers.
// Replace the DATA table + generators with real queries behind the same signatures.

interface ParamTelemetry {
	/** Latest value for the primary buoy ('now' mode). */
	snapshot: number;
	/** Latest value for the compared buoy (second column in compare mode). */
	snapshotCompare: number;
	/** Trend direction for the label: 1 rising, -1 falling, 0 steady. */
	direction: 1 | 0 | -1;
	ranges: Record<Exclude<TimeRange, 'now'>, TrendStat>;
	seed: number;
	amp: number;
}

const DATA: Record<ParameterId, ParamTelemetry> = {
	waterTemp: {
		snapshot: 2, snapshotCompare: -1, direction: 1, seed: 39, amp: 6,
		ranges: { '24h': { min: 1.4, max: 3.1 }, '7d': { min: 0.8, max: 4.2 }, '30d': { min: -0.5, max: 5.1 } }
	},
	dissolvedOxygen: {
		snapshot: 8, snapshotCompare: 6.2, direction: 0, seed: 57, amp: 5,
		ranges: { '24h': { min: 7.8, max: 8.3 }, '7d': { min: 7.2, max: 8.6 }, '30d': { min: 6.8, max: 9.1 } }
	},
	tds: {
		snapshot: 52.3, snapshotCompare: 30, direction: 1, seed: 64, amp: 9,
		ranges: { '24h': { min: 48, max: 53 }, '7d': { min: 41, max: 54 }, '30d': { min: 38, max: 55 } }
	},
	redox: {
		snapshot: 412, snapshotCompare: 319, direction: 1, seed: 46, amp: 6,
		ranges: { '24h': { min: 398, max: 418 }, '7d': { min: 380, max: 425 }, '30d': { min: 360, max: 430 } }
	},
	lightAbove: {
		snapshot: 50.1, snapshotCompare: 46.1, direction: -1, seed: 72, amp: 12,
		ranges: { '24h': { min: 42, max: 61 }, '7d': { min: 30, max: 68 }, '30d': { min: 10, max: 72 } }
	},
	lightBelow: {
		snapshot: 8.2, snapshotCompare: 4.4, direction: -1, seed: 31, amp: 6,
		ranges: { '24h': { min: 6.1, max: 9.8 }, '7d': { min: 4.2, max: 11 }, '30d': { min: 2.1, max: 12 } }
	}
};

const POINTS = 80;

function generate(seed: number, amp: number, n: number): number[] {
	const out: number[] = [];
	for (let i = 0; i < n; i++) {
		const wave = Math.sin(i * 0.55 + seed) * amp * 0.5 + Math.sin(i * 0.17 + seed * 0.3) * amp * 0.35;
		out.push(seed + wave + (((i * seed) % 7) - 3) * amp * 0.06);
	}
	return out;
}

// A second, related curve so the compared buoy tracks-but-diverges (the fouling signal).
function divergedCurve(series: number[]): number[] {
	return series.map((v) => v * 0.82 + 3);
}

// Series are generated once at module load and reused across ranges (range only
// changes the min/max labels and the x-axis, not the illustrative shape).
const SERIES = new Map<ParameterId, { primary: number[]; compare: number[] }>();
for (const [id, t] of Object.entries(DATA) as [ParameterId, ParamTelemetry][]) {
	const primary = generate(t.seed, t.amp, POINTS);
	SERIES.set(id, { primary, compare: divergedCurve(primary) });
}

export function telemetrySnapshot(id: ParameterId, compare = false): number {
	return compare ? DATA[id].snapshotCompare : DATA[id].snapshot;
}

export function telemetryDirection(id: ParameterId): 1 | 0 | -1 {
	return DATA[id].direction;
}

export function telemetryRange(id: ParameterId, range: Exclude<TimeRange, 'now'>): TrendStat {
	return DATA[id].ranges[range];
}

export function telemetrySeries(id: ParameterId, compare = false): number[] {
	const s = SERIES.get(id)!;
	return compare ? s.compare : s.primary;
}
