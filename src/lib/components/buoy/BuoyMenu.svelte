<script lang="ts">
	import type { Buoy } from '$lib/types';
	import StatusDot from '$lib/components/StatusDot.svelte';

	interface Props {
		buoys: Buoy[];
		/** Buoy id to omit from the list (usually the one already selected here). */
		excludeId?: string;
		side?: 'left' | 'right';
		onselect: (id: string) => void;
	}

	let { buoys, excludeId, side = 'left', onselect }: Props = $props();

	const options = $derived(buoys.filter((b) => b.id !== excludeId));
</script>

<div class="menu {side}" role="listbox">
	{#each options as buoy (buoy.id)}
		<button class="item" role="option" aria-selected="false" onclick={() => onselect(buoy.id)}>
			<StatusDot status={buoy.status} variant="mini" />
			<span class="name">{buoy.name}</span>
		</button>
	{/each}
</div>

<style>
	.menu {
		position: absolute;
		top: 48px;
		z-index: 400;
		min-width: 190px;
		overflow: hidden;
		border-radius: 14px;
		background: var(--color-teal);
		border: 1px solid rgba(255, 255, 255, 0.15);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
	}
	.left {
		left: 0;
	}
	.right {
		right: 0;
	}
	.item {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		padding: 11px 15px;
		border: none;
		border-bottom: 1px solid rgba(255, 255, 255, 0.07);
		background: none;
		cursor: pointer;
		text-align: left;
	}
	.item:last-child {
		border-bottom: none;
	}
	.item:active {
		background: rgba(255, 255, 255, 0.12);
	}
	.name {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-family: var(--font-heading);
		font-size: 12.5px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.85);
	}
</style>
