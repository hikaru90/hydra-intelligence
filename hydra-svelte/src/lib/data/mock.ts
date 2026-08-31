import type { Buoy, Observation, Site } from '$lib/types';

// Temporary in-memory fixtures so the UI runs before PocketBase is connected.
// Replace these with load functions / a PocketBase client behind the same types.

const DAY = 86_400_000;
const ago = (days: number) => new Date(Date.now() - days * DAY).toISOString();

export const SITES: Site[] = [
	{ id: 'limfjord', name: 'Limfjord', country: 'Denmark', short: 'Limfjord, DK', lat: 56.9508, lng: 9.2812, zoom: 13.4 },
	{ id: 'chiloe', name: 'Chiloé', country: 'Chile', short: 'Chiloé, CL', lat: -42.4812, lng: -73.7626, zoom: 13.4 }
];

/** Approximate current position of the person in the field (drives GPS-nearest later). */
export const YOU = { lat: 56.9472, lng: 9.2705 };

export const BUOYS: Buoy[] = [
	{
		id: 'hydra-1',
		name: 'HYDRA 1',
		siteId: 'limfjord',
		battery: 78,
		status: 'ok',
		deployment: 'seaweed',
		subject: 'Saccharina latissima',
		locationDescription: '20 m from pier',
		lat: 56.9515,
		lng: 9.2831,
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
		locationDescription: 'close by the cliffs',
		lat: 56.9479,
		lng: 9.2718,
		lastCheckInAt: ago(0)
	},
	{
		id: 'hydra-3',
		name: 'HYDRA 3',
		siteId: 'limfjord',
		battery: 49,
		status: 'mid',
		deployment: 'research',
		locationDescription: 'near the restaurant',
		lat: 56.9531,
		lng: 9.2904,
		lastCheckInAt: ago(11)
	},
	{
		id: 'hydra-4',
		name: 'HYDRA 4',
		siteId: 'chiloe',
		battery: 84,
		status: 'ok',
		deployment: 'seaweed',
		subject: 'Ulva spp.',
		locationDescription: 'next to the boats',
		lat: -42.4808,
		lng: -73.7601,
		lastCheckInAt: ago(3)
	}
];

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

	o('hydra-4', 3, 'Slight drift on the mooring, repositioned.', true),
	o('hydra-4', 14, 'Ulva mats dense, took a sample for the lab.', true)
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

/** Observations for one buoy, newest first. */
export function observationsForBuoy(buoyId: string): Observation[] {
	return OBSERVATIONS.filter((obs) => obs.buoyId === buoyId).sort(
		(a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
	);
}
