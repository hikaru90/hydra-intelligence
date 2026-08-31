<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Buoy } from '$lib/types';
	import FleetHeader from '$lib/components/dashboard/FleetHeader.svelte';
	import MapPanel from '$lib/components/dashboard/MapPanel.svelte';
	import BuoyList from '$lib/components/dashboard/BuoyList.svelte';
	import AddBuoySheet from '$lib/components/sheets/AddBuoySheet.svelte';
	import { BUOYS, SITES, YOU } from '$lib/data/mock';

	// Reactive copy so an added buoy shows immediately (swap for PocketBase later).
	let buoys = $state<Buoy[]>(BUOYS.map((b) => ({ ...b })));
	let addOpen = $state(false);

	const attention = $derived(buoys.filter((b) => b.status === 'warn').length);
	const suggestedName = $derived(`HYDRA ${buoys.length + 1}`);

	function openBuoy(id: string) {
		goto(`/buoy/${id}`);
	}

	function addBuoy(p: { name: string; deployment: Buoy['deployment']; subject: string; location: string }) {
		const n = buoys.length + 1;
		buoys = [
			...buoys,
			{
				id: `hydra-${n}`,
				name: p.name || `HYDRA ${n}`,
				siteId: SITES[0].id,
				battery: 100,
				status: 'ok',
				deployment: p.deployment,
				subject: p.subject || undefined,
				locationDescription: p.location,
				lastCheckInAt: null
			}
		];
	}
</script>

<div class="screen">
	<FleetHeader total={buoys.length} {attention} />

	<MapPanel {buoys} sites={SITES} you={YOU} onselect={openBuoy} />

	<div class="list-scroll">
		<BuoyList {buoys} sites={SITES} onselect={openBuoy} />
	</div>

	<button class="add-fab" onclick={() => (addOpen = true)} aria-label="Add new buoy">
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#11394b" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
			<line x1="12" y1="4" x2="12" y2="20" />
			<line x1="4" y1="12" x2="20" y2="12" />
		</svg>
	</button>

	<AddBuoySheet bind:open={addOpen} {suggestedName} onadd={addBuoy} />
</div>

<style>
	.screen {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100dvh;
		max-width: 480px;
		margin: 0 auto;
		background: var(--bg-dashboard);
		overflow: hidden;
	}
	.list-scroll {
		flex: 1;
		position: relative;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}
	.list-scroll::-webkit-scrollbar {
		display: none;
	}
	.add-fab {
		position: absolute;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 20;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 56px;
		height: 56px;
		border: none;
		border-radius: 50%;
		background: var(--gradient-brand);
		box-shadow: var(--shadow-fab);
		cursor: pointer;
		transition: opacity 0.15s;
	}
	.add-fab:active {
		opacity: 0.85;
	}
	.add-fab:focus-visible {
		outline: 2px solid var(--color-teal);
		outline-offset: 3px;
	}
</style>
