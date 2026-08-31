<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Observation, ParameterId, TimeRange } from '$lib/types';
	import { BUOYS, OBSERVATIONS, YOU } from '$lib/data/mock';
	import { relativeTime } from '$lib/utils/format';
	import { resolvedRangeLabel } from '$lib/utils/time-range';

	import DetailHeader from '$lib/components/buoy/DetailHeader.svelte';
	import TabBar, { type BuoyTab } from '$lib/components/buoy/TabBar.svelte';
	import TimeControls from '$lib/components/buoy/TimeControls.svelte';
	import CompareHeader from '$lib/components/buoy/CompareHeader.svelte';
	import ParameterGrid from '$lib/components/buoy/ParameterGrid.svelte';
	import ObservationLog from '$lib/components/buoy/ObservationLog.svelte';
	import CheckInFab from '$lib/components/buoy/CheckInFab.svelte';
	import CheckInSheet from '$lib/components/sheets/CheckInSheet.svelte';
	import ExportSheet from '$lib/components/sheets/ExportSheet.svelte';
	import ParameterDetailSheet from '$lib/components/sheets/ParameterDetailSheet.svelte';

	let { data }: { data: { buoyId: string } } = $props();

	// Buoy selection: derived from the URL, with a local override when switched in-screen.
	let selectedOverride = $state<string | null>(null);
	let compareOverride = $state<string | null>(null);
	let tab = $state<BuoyTab>('data');
	let range = $state<TimeRange>('now');
	let compare = $state(false);

	// Reactive observation store so a new check-in appears immediately (swap for PocketBase).
	let obsState = $state<Observation[]>(OBSERVATIONS.map((o) => ({ ...o })));

	// Sheets
	let checkInOpen = $state(false);
	let exportOpen = $state(false);
	let detailOpen = $state(false);
	let detailParam = $state<ParameterId | null>(null);

	const currentId = $derived(selectedOverride ?? data.buoyId);
	const compareId = $derived(
		compareOverride && compareOverride !== currentId ? compareOverride : firstOther(currentId)
	);
	const buoy = $derived(BUOYS.find((b) => b.id === currentId)!);
	const compareBuoy = $derived(BUOYS.find((b) => b.id === compareId)!);
	const observations = $derived(
		obsState
			.filter((o) => o.buoyId === currentId)
			.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
	);
	const rangeLabel = $derived(resolvedRangeLabel(range));

	// GPS-nearest buoy (drives the "nearest to you" tag + preselect in the field).
	const nearestId = nearest();

	function firstOther(id: string): string {
		return (BUOYS.find((b) => b.id !== id) ?? BUOYS[0]).id;
	}
	function nearest(): string {
		let best = BUOYS[0].id;
		let bestDist = Infinity;
		for (const b of BUOYS) {
			if (b.lat == null || b.lng == null) continue;
			const d = (b.lat - YOU.lat) ** 2 + (b.lng - YOU.lng) ** 2;
			if (d < bestDist) {
				bestDist = d;
				best = b.id;
			}
		}
		return best;
	}
	function newestFor(buoyId: string): Observation | null {
		const list = obsState.filter((o) => o.buoyId === buoyId);
		if (!list.length) return null;
		return list.reduce((a, b) => (new Date(a.timestamp) > new Date(b.timestamp) ? a : b));
	}

	function selectBuoy(id: string) {
		selectedOverride = id;
	}
	function toggleCompare() {
		compare = !compare;
	}
	function changeTab(next: BuoyTab) {
		if (next === 'obs' && compare) return;
		tab = next;
	}

	function latestFor(buoyId: string) {
		const n = newestFor(buoyId);
		return n ? { note: n.note, when: relativeTime(n.timestamp) } : null;
	}
	function saveCheckIn(p: { buoyId: string; note: string; editing: boolean }) {
		if (p.editing) {
			const n = newestFor(p.buoyId);
			if (n) n.note = p.note || n.note;
		} else {
			obsState.unshift({
				id: `obs-${Date.now()}`,
				buoyId: p.buoyId,
				timestamp: new Date().toISOString(),
				note: p.note || '(no note added)',
				photoUrl: null
			});
		}
	}
	function expandParameter(id: ParameterId) {
		detailParam = id;
		detailOpen = true;
	}
</script>

<div class="screen">
	<DetailHeader
		{buoy}
		buoys={BUOYS}
		{compare}
		onback={() => goto('/')}
		onselect={selectBuoy}
		onexport={() => (exportOpen = true)}
	/>

	<TabBar {tab} {compare} onchange={changeTab} />

	{#if tab === 'data'}
		<TimeControls {range} {compare} onrange={(r) => (range = r)} ontogglecompare={toggleCompare} />

		<div class="range-line">
			<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="2" aria-hidden="true">
				<circle cx="12" cy="12" r="9" /><polyline points="12,7 12,12 15,14" />
			</svg>
			<span>{rangeLabel}</span>
		</div>

		{#if compare}
			<CompareHeader
				buoys={BUOYS}
				primary={buoy}
				{compareBuoy}
				onselectprimary={selectBuoy}
				onselectcompare={(id) => (compareOverride = id)}
			/>
		{/if}

		<div class="scroll">
			<ParameterGrid {range} {compare} onexpand={expandParameter} />
		</div>
	{:else}
		<div class="scroll">
			<ObservationLog {observations} location={buoy.locationDescription} />
		</div>
	{/if}

	{#if tab === 'obs' && !compare}
		<CheckInFab onclick={() => (checkInOpen = true)} />
	{/if}

	<CheckInSheet
		bind:open={checkInOpen}
		buoys={BUOYS}
		initialBuoyId={currentId}
		{nearestId}
		{latestFor}
		onsave={saveCheckIn}
	/>
	<ExportSheet bind:open={exportOpen} />
	<ParameterDetailSheet bind:open={detailOpen} paramId={detailParam} buoyName={buoy.name} {range} />
</div>

<style>
	.screen {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100dvh;
		max-width: 480px;
		margin: 0 auto;
		background: var(--bg-buoy);
		overflow: hidden;
	}
	.range-line {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 0 16px 12px;
		background: var(--color-teal);
		font-family: var(--font-body);
		font-size: 11px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.75);
	}
	.range-line svg {
		flex-shrink: 0;
	}
	.scroll {
		flex: 1;
		position: relative;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}
	.scroll::-webkit-scrollbar {
		display: none;
	}
</style>
