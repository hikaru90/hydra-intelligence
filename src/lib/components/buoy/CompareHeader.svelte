<script lang="ts">
	import type { Buoy } from '$lib/types';
	import StatusDot from '$lib/components/StatusDot.svelte';
	import BuoyMenu from './BuoyMenu.svelte';

	interface Props {
		buoys: Buoy[];
		primary: Buoy;
		compareBuoy: Buoy;
		onselectprimary: (id: string) => void;
		onselectcompare: (id: string) => void;
	}

	let { buoys, primary, compareBuoy, onselectprimary, onselectcompare }: Props = $props();

	let open = $state<'left' | 'right' | null>(null);

	function pickPrimary(id: string) {
		open = null;
		onselectprimary(id);
	}
	function pickCompare(id: string) {
		open = null;
		onselectcompare(id);
	}
</script>

<svelte:window onclick={() => (open = null)} />

<div class="cmp-head">
	<div class="col">
		<button
			class="col-sel"
			onclick={(e) => {
				e.stopPropagation();
				open = open === 'left' ? null : 'left';
			}}
			aria-haspopup="listbox"
			aria-expanded={open === 'left'}
		>
			<span class="col-left">
				<StatusDot status={primary.status} variant="mini" />
				<span class="col-name">{primary.name}</span>
			</span>
			<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" aria-hidden="true">
				<polyline points="6,9 12,15 18,9" />
			</svg>
		</button>
		{#if open === 'left'}
			<BuoyMenu {buoys} excludeId={compareBuoy.id} side="left" onselect={pickPrimary} />
		{/if}
	</div>

	<div class="col">
		<button
			class="col-sel"
			onclick={(e) => {
				e.stopPropagation();
				open = open === 'right' ? null : 'right';
			}}
			aria-haspopup="listbox"
			aria-expanded={open === 'right'}
		>
			<span class="col-left">
				<StatusDot status={compareBuoy.status} variant="mini" />
				<span class="col-name">{compareBuoy.name}</span>
			</span>
			<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" aria-hidden="true">
				<polyline points="6,9 12,15 18,9" />
			</svg>
		</button>
		{#if open === 'right'}
			<BuoyMenu {buoys} excludeId={primary.id} side="right" onselect={pickCompare} />
		{/if}
	</div>
</div>

<style>
	.cmp-head {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
		padding: 0 14px 12px;
		background: var(--color-teal);
		position: relative;
		z-index: 3;
	}
	.col {
		position: relative;
	}
	.col-sel {
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		gap: 6px;
		width: 100%;
		height: 44px;
		padding: 0 12px;
		border: none;
		border-radius: 22px;
		background: rgba(255, 255, 255, 0.1);
		cursor: pointer;
		color: #fff;
		white-space: nowrap;
	}
	.col-sel:active {
		background: rgba(255, 255, 255, 0.2);
	}
	.col-left {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
	}
	.col-name {
		font-family: var(--font-heading);
		font-size: 12.5px;
		font-weight: 700;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
	}
</style>
