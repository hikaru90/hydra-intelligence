// Legacy PocketBase "orders" row shape, used by the old dashboard/view routes.
// Superseded by Buoy below as those routes are migrated.
export interface Hydra {
	id: string;
	deployed: boolean;
	lon: number;
	lat: number;
	label: string;
}

// Core domain model for Cerberus Blue OS.
//
// A buoy carries two parallel logs:
//   1. a sensor log  — automatic telemetry (Reading / series)
//   2. an observation log — human field notes written via check-in (Observation)
// The long-term product value is correlating the two, so observations are
// first-class, timestamped records — never throwaway.

export type BuoyStatus = 'ok' | 'mid' | 'warn';

export type DeploymentType =
	| 'seaweed'
	| 'shellfish'
	| 'fish'
	| 'restoration'
	| 'research'
	| 'other';

export interface Site {
	id: string;
	name: string;
	country: string;
	/** Short label shown in the site-jump control, e.g. "Limfjord, DK". */
	short: string;
	/** Map camera for this site (lng/lat + zoom) used by the site-jump flyTo. */
	lat?: number;
	lng?: number;
	zoom?: number;
}

export interface Buoy {
	id: string;
	name: string;
	siteId: string;
	/** Battery charge, 0–100. */
	battery: number;
	status: BuoyStatus;
	deployment: DeploymentType;
	/** Free text — the specific thing being grown/studied. Optional. */
	subject?: string;
	/** Human-readable place, e.g. "20 m from pier". Used to recognise a buoy in the field. */
	locationDescription: string;
	lat?: number;
	lng?: number;
	/** ISO timestamp of the most recent check-in, or null if never checked in. */
	lastCheckInAt?: string | null;
}

// A single human observation — the compose target of a check-in.
// timestamp is absolute (ISO); the UI derives a relative label for display.
export interface Observation {
	id: string;
	buoyId: string;
	timestamp: string;
	note: string;
	photoUrl?: string | null;
	/** Captured silently at check-in time. */
	lat?: number;
	lng?: number;
}

export type ParameterId =
	| 'waterTemp'
	| 'dissolvedOxygen'
	| 'tds'
	| 'redox'
	| 'lightAbove'
	| 'lightBelow';

export interface ParameterDef {
	id: ParameterId;
	label: string;
	unit: string;
	/** Fixed per parameter, identical across buoys — divergence of the values is the fouling signal. */
	color: string;
}

export type TimeRange = 'now' | '24h' | '7d' | '30d';

export interface TrendStat {
	min: number;
	max: number;
}
