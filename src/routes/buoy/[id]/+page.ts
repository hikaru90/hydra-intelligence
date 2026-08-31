import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { BUOYS } from '$lib/data/mock';

// Mock resolution. Swap for a PocketBase fetch (same return shape) when the backend lands.
export const load: PageLoad = ({ params }) => {
	const exists = BUOYS.some((b) => b.id === params.id);
	if (!exists) throw error(404, 'Buoy not found');
	return { buoyId: params.id };
};
