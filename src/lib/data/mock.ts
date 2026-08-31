import type { Buoy, Observation, Site } from '$lib/types';

// Temporary in-memory fixtures so the UI runs before PocketBase is connected.
// Replace these with load functions / a PocketBase client behind the same types.
//
// Coordinates are real open-water points (not on land) in two actual fjord
// systems: the Limfjord near Aalborg, Denmark, and the Kieler Förde in
// Germany — the latter matches the pilot region from REQUIREMENTS.md.

const DAY = 86_400_000;
const ago = (days: number) => new Date(Date.now() - days * DAY).toISOString();

export const SITES: Site[] = [
	{
		id: 'limfjord',
		name: 'Limfjord',
		country: 'Denmark',
		short: 'Limfjord, DK',
		lat: 57.048,
		lng: 9.935,
		zoom: 13.2
	},
	{
		id: 'kieler-foerde',
		name: 'Kieler Förde',
		country: 'Germany',
		short: 'Kieler Förde, DE',
		lat: 54.378,
		lng: 10.185,
		zoom: 12.8
	}
];

/** Approximate current position of the person in the field (drives GPS-nearest later). */
export const YOU = { lat: 57.047, lng: 9.9305 };

export const BUOYS: Buoy[] = [
	{
		id: 'hydra-1',
		name: 'HYDRA 1',
		siteId: 'limfjord',
		battery: 78,
		status: 'ok',
		deployment: 'seaweed',
		subject: 'Saccharina latissima',
		locationDescription: 'mid-channel off Aalborg',
		lat: 57.0498,
		lng: 9.9206,
		lastCheckInAt: ago(3)
	},
	{
		id: 'hydra-2',
		name: 'HYDRA 2',
		siteId: 'limfjord',
		battery: 11,
		status: 'warn',
		deployment: 'shellfish',
		subject: 'Blue mussel',
		locationDescription: 'east of Nørresundby ferry line',
		lat: 57.0525,
		lng: 9.9445,
		lastCheckInAt: ago(0)
	},
	{
		id: 'hydra-3',
		name: 'HYDRA 3',
		siteId: 'limfjord',
		battery: 49,
		status: 'mid',
		deployment: 'research',
		locationDescription: 'fjord centre, Limfjordsbroen',
		lat: 57.045,
		lng: 9.905,
		lastCheckInAt: ago(11)
	},
	{
		id: 'hydra-4',
		name: 'HYDRA 4',
		siteId: 'kieler-foerde',
		battery: 84,
		status: 'ok',
		deployment: 'seaweed',
		subject: 'Saccharina latissima',
		locationDescription: 'mid-fjord off Düsternbrook',
		lat: 54.348,
		lng: 10.165,
		lastCheckInAt: ago(2)
	},
	{
		id: 'hydra-5',
		name: 'HYDRA 5',
		siteId: 'kieler-foerde',
		battery: 63,
		status: 'mid',
		deployment: 'shellfish',
		subject: 'Blue mussel',
		locationDescription: 'mid-fjord off Friedrichsort',
		lat: 54.378,
		lng: 10.185,
		lastCheckInAt: ago(6)
	}
];

let seq = 0;
function o(buoyId: string, daysAgo: number, note: string, photo: boolean): Observation {
	return {
		id: `obs-${++seq}`,
		buoyId,
		timestamp: ago(daysAgo),
		note,
		photoUrl: photo ? null : null // wire real photo URLs when storage is connected
	};
}

export const OBSERVATIONS: Observation[] = [
	// HYDRA 1 — a longer history so the log actually scrolls.
	o('hydra-1', 3, 'Light fouling on the lower sensor, wiped it clean. Line sitting at good depth.', true),
	o('hydra-1', 7, 'Good growth on the collectors, blades around 40 cm. Water clear.', true),
	o('hydra-1', 14, 'Checked mooring after strong winds — holding well, minor drift.', true),
	o('hydra-1', 21, 'Deployed a fresh line. Everything nominal at drop-off.', true),
	o('hydra-1', 30, 'Site survey and first sensor calibration done.', false),
	o('hydra-1', 35, 'Scouting visit, confirmed anchor point and depth.', false),
	o('hydra-1', 42, 'Initial deployment planning, marked GPS waypoint.', false),

	o('hydra-2', 0, 'Battery low, needs a swap soon. Growth looking healthy though.', true),
	o('hydra-2', 5, 'Heavy fouling on the floats, cleaned off. Mussels developing well.', true),
	o('hydra-2', 14, 'Repositioned slightly after the storm. No damage found.', false),

	o('hydra-3', 11, 'All clear, no visible fouling.', true),
	o('hydra-3', 30, 'Baseline check. Sensors reading steady, nothing growing — research site.', false),

	o('hydra-4', 2, 'Blades around 35 cm, water clear, no fouling on the sensor housing.', true),
	o('hydra-4', 9, 'Ferry wake noticeable at this mooring, line held steady.', true),
	o('hydra-4', 20, 'Deployed off Düsternbrook, first calibration done.', false),

	o('hydra-5', 6, 'Mussels developing well, some light growth on the sensor arm.', true),
	o('hydra-5', 16, 'Checked after strong easterly wind — mooring intact, slight drift.', true),
	o('hydra-5', 27, 'Initial deployment off Möltenort, GPS waypoint marked.', false)
];

/** Observations for one buoy, newest first. */
export function observationsForBuoy(buoyId: string): Observation[] {
	return OBSERVATIONS.filter((obs) => obs.buoyId === buoyId).sort(
		(a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
	);
}
