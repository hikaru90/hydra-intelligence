import type { ParameterId, TimeRange, TrendStat } from '$lib/types';

// Mock telemetry that stands in for PocketBase until the backend is wired.
// Keyed by buoy id (not just "primary vs compare") so every buoy — including
// whichever one gets picked as the second compare column — has its own
// distinct, plausible values. Replace the DATA table + generators with real
// per-device queries behind the same signatures.

interface ParamTelemetry {
	/** Latest value ("now" mode). */
	snapshot: number;
	/** Trend direction for the label: 1 rising, -1 falling, 0 steady. */
	direction: 1 | 0 | -1;
	ranges: Record<Exclude<TimeRange, 'now'>, TrendStat>;
	seed: number;
	amp: number;
}

type BuoyId = 'hydra-1' | 'hydra-2' | 'hydra-3' | 'hydra-4' | 'hydra-5';

// Roughly plausible coastal Baltic/Kattegat brackish-water figures for late
// summer, varied per buoy so no two buoys ever read identically. hydra-2
// (battery-low, "needs attention") trends toward the values that would
// actually justify a fouling warning: lower oxygen, lower light penetration.
const DATA: Record<ParameterId, Record<BuoyId, ParamTelemetry>> = {
	waterTemp: {
		'hydra-1': { snapshot: 15.2, direction: 1, seed: 31, amp: 3.2, ranges: { '24h': { min: 14.6, max: 15.8 }, '7d': { min: 13.9, max: 16.4 }, '30d': { min: 12.8, max: 17.1 } } },
		'hydra-2': { snapshot: 16.8, direction: 1, seed: 47, amp: 3.6, ranges: { '24h': { min: 16.1, max: 17.4 }, '7d': { min: 15.2, max: 18.0 }, '30d': { min: 13.9, max: 18.7 } } },
		'hydra-3': { snapshot: 15.9, direction: 0, seed: 58, amp: 2.9, ranges: { '24h': { min: 15.4, max: 16.3 }, '7d': { min: 14.8, max: 16.9 }, '30d': { min: 13.6, max: 17.4 } } },
		'hydra-4': { snapshot: 17.4, direction: 1, seed: 22, amp: 2.7, ranges: { '24h': { min: 16.9, max: 17.9 }, '7d': { min: 16.1, max: 18.3 }, '30d': { min: 15.0, max: 18.9 } } },
		'hydra-5': { snapshot: 17.1, direction: 0, seed: 39, amp: 2.5, ranges: { '24h': { min: 16.7, max: 17.5 }, '7d': { min: 16.0, max: 17.9 }, '30d': { min: 14.8, max: 18.4 } } }
	},
	dissolvedOxygen: {
		'hydra-1': { snapshot: 8.1, direction: 0, seed: 64, amp: 0.9, ranges: { '24h': { min: 7.7, max: 8.4 }, '7d': { min: 7.3, max: 8.7 }, '30d': { min: 6.9, max: 9.0 } } },
		'hydra-2': { snapshot: 6.4, direction: -1, seed: 18, amp: 1.1, ranges: { '24h': { min: 6.0, max: 6.9 }, '7d': { min: 5.6, max: 7.4 }, '30d': { min: 5.1, max: 8.0 } } },
		'hydra-3': { snapshot: 7.8, direction: 0, seed: 53, amp: 0.8, ranges: { '24h': { min: 7.5, max: 8.1 }, '7d': { min: 7.1, max: 8.4 }, '30d': { min: 6.7, max: 8.8 } } },
		'hydra-4': { snapshot: 8.6, direction: 1, seed: 71, amp: 0.7, ranges: { '24h': { min: 8.3, max: 8.9 }, '7d': { min: 7.9, max: 9.2 }, '30d': { min: 7.4, max: 9.6 } } },
		'hydra-5': { snapshot: 7.9, direction: -1, seed: 29, amp: 0.9, ranges: { '24h': { min: 7.5, max: 8.2 }, '7d': { min: 7.0, max: 8.5 }, '30d': { min: 6.5, max: 8.9 } } }
	},
	tds: {
		'hydra-1': { snapshot: 42.5, direction: 1, seed: 44, amp: 5.5, ranges: { '24h': { min: 38, max: 46 }, '7d': { min: 33, max: 49 }, '30d': { min: 28, max: 52 } } },
		'hydra-2': { snapshot: 55.2, direction: 1, seed: 62, amp: 7.2, ranges: { '24h': { min: 50, max: 58 }, '7d': { min: 44, max: 61 }, '30d': { min: 37, max: 64 } } },
		'hydra-3': { snapshot: 46.0, direction: 0, seed: 36, amp: 5.0, ranges: { '24h': { min: 42, max: 49 }, '7d': { min: 38, max: 52 }, '30d': { min: 33, max: 55 } } },
		'hydra-4': { snapshot: 39.8, direction: -1, seed: 55, amp: 4.6, ranges: { '24h': { min: 36, max: 43 }, '7d': { min: 32, max: 46 }, '30d': { min: 27, max: 49 } } },
		'hydra-5': { snapshot: 44.1, direction: 1, seed: 27, amp: 5.8, ranges: { '24h': { min: 40, max: 47 }, '7d': { min: 35, max: 50 }, '30d': { min: 30, max: 53 } } }
	},
	redox: {
		'hydra-1': { snapshot: 398, direction: 1, seed: 41, amp: 22, ranges: { '24h': { min: 384, max: 410 }, '7d': { min: 366, max: 418 }, '30d': { min: 344, max: 426 } } },
		'hydra-2': { snapshot: 340, direction: -1, seed: 15, amp: 28, ranges: { '24h': { min: 322, max: 356 }, '7d': { min: 298, max: 368 }, '30d': { min: 270, max: 380 } } },
		'hydra-3': { snapshot: 375, direction: 1, seed: 68, amp: 20, ranges: { '24h': { min: 362, max: 388 }, '7d': { min: 346, max: 396 }, '30d': { min: 326, max: 404 } } },
		'hydra-4': { snapshot: 410, direction: 1, seed: 33, amp: 18, ranges: { '24h': { min: 399, max: 421 }, '7d': { min: 384, max: 428 }, '30d': { min: 366, max: 434 } } },
		'hydra-5': { snapshot: 388, direction: 0, seed: 49, amp: 24, ranges: { '24h': { min: 374, max: 401 }, '7d': { min: 356, max: 410 }, '30d': { min: 334, max: 418 } } }
	},
	lightAbove: {
		'hydra-1': { snapshot: 47.3, direction: -1, seed: 72, amp: 11, ranges: { '24h': { min: 38, max: 58 }, '7d': { min: 26, max: 64 }, '30d': { min: 9, max: 69 } } },
		'hydra-2': { snapshot: 38.1, direction: -1, seed: 24, amp: 13, ranges: { '24h': { min: 29, max: 49 }, '7d': { min: 18, max: 55 }, '30d': { min: 6, max: 61 } } },
		'hydra-3': { snapshot: 51.0, direction: 1, seed: 60, amp: 10, ranges: { '24h': { min: 43, max: 60 }, '7d': { min: 32, max: 66 }, '30d': { min: 14, max: 71 } } },
		'hydra-4': { snapshot: 55.2, direction: 1, seed: 37, amp: 9, ranges: { '24h': { min: 48, max: 63 }, '7d': { min: 38, max: 68 }, '30d': { min: 20, max: 74 } } },
		'hydra-5': { snapshot: 49.6, direction: -1, seed: 20, amp: 12, ranges: { '24h': { min: 40, max: 59 }, '7d': { min: 28, max: 65 }, '30d': { min: 11, max: 70 } } }
	},
	lightBelow: {
		'hydra-1': { snapshot: 7.6, direction: -1, seed: 31, amp: 5.5, ranges: { '24h': { min: 5.4, max: 9.1 }, '7d': { min: 3.6, max: 10.4 }, '30d': { min: 1.8, max: 11.6 } } },
		'hydra-2': { snapshot: 3.2, direction: -1, seed: 12, amp: 6.2, ranges: { '24h': { min: 1.9, max: 4.9 }, '7d': { min: 1.1, max: 6.1 }, '30d': { min: 0.4, max: 7.4 } } },
		'hydra-3': { snapshot: 6.9, direction: 0, seed: 46, amp: 5.1, ranges: { '24h': { min: 5.0, max: 8.3 }, '7d': { min: 3.4, max: 9.5 }, '30d': { min: 1.7, max: 10.7 } } },
		'hydra-4': { snapshot: 9.1, direction: 1, seed: 27, amp: 5.8, ranges: { '24h': { min: 6.9, max: 10.9 }, '7d': { min: 4.7, max: 12.3 }, '30d': { min: 2.4, max: 13.5 } } },
		'hydra-5': { snapshot: 6.3, direction: -1, seed: 54, amp: 5.4, ranges: { '24h': { min: 4.5, max: 7.9 }, '7d': { min: 2.9, max: 9.1 }, '30d': { min: 1.2, max: 10.3 } } }
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

// Series are generated once at module load and reused across ranges (range only
// changes the min/max labels and the x-axis, not the illustrative shape).
const SERIES = new Map<string, number[]>();
for (const [id, byBuoy] of Object.entries(DATA) as [ParameterId, Record<BuoyId, ParamTelemetry>][]) {
	for (const [buoyId, t] of Object.entries(byBuoy) as [BuoyId, ParamTelemetry][]) {
		SERIES.set(`${id}:${buoyId}`, generate(t.seed, t.amp, POINTS));
	}
}

function entry(id: ParameterId, buoyId: string): ParamTelemetry {
	const byBuoy = DATA[id];
	return byBuoy[buoyId as BuoyId] ?? Object.values(byBuoy)[0];
}

export function telemetrySnapshot(id: ParameterId, buoyId: string): number {
	return entry(id, buoyId).snapshot;
}

export function telemetryDirection(id: ParameterId, buoyId: string): 1 | 0 | -1 {
	return entry(id, buoyId).direction;
}

export function telemetryRange(id: ParameterId, buoyId: string, range: Exclude<TimeRange, 'now'>): TrendStat {
	return entry(id, buoyId).ranges[range];
}

export function telemetrySeries(id: ParameterId, buoyId: string): number[] {
	return SERIES.get(`${id}:${buoyId}`) ?? SERIES.get(`${id}:hydra-1`)!;
}
