<script lang="ts">
	import type { Buoy } from '$lib/types';
	import StatusDot from '$lib/components/StatusDot.svelte';
	import BuoyMenu from './BuoyMenu.svelte';

	interface Props {
		buoy: Buoy;
		buoys: Buoy[];
		compare?: boolean;
		onback: () => void;
		onselect: (id: string) => void;
		onactions: () => void;
	}

	let { buoy, buoys, compare = false, onback, onselect, onactions }: Props = $props();

	let menuOpen = $state(false);

	function choose(id: string) {
		menuOpen = false;
		onselect(id);
	}
</script>

<svelte:window onclick={() => (menuOpen = false)} />

<header class="d-header">
	<button class="icon-btn" onclick={onback} aria-label="Back to fleet">
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" aria-hidden="true">
			<polyline points="15,18 9,12 15,6" />
		</svg>
	</button>

	{#if compare}
		<div class="comparing">
			<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<rect x="3" y="4" width="7" height="16" rx="1.5" />
				<rect x="14" y="4" width="7" height="16" rx="1.5" />
			</svg>
			Comparing
		</div>
	{:else}
		<div class="pill-wrap" style:view-transition-name={`buoy-card-${buoy.id}`}>
			<button
				class="title-pill"
				onclick={(e) => {
					e.stopPropagation();
					menuOpen = !menuOpen;
				}}
				aria-haspopup="listbox"
				aria-expanded={menuOpen}
			>
				<span class="pill-left">
					<StatusDot status={buoy.status} variant="mini" />
					<span class="title-name">{buoy.name}</span>
				</span>
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" aria-hidden="true">
					<polyline points="6,9 12,15 18,9" />
				</svg>
			</button>
			{#if menuOpen}
				<BuoyMenu {buoys} excludeId={buoy.id} side="left" onselect={choose} />
			{/if}
		</div>
	{/if}

	<button class="icon-btn" onclick={onactions} aria-label="Buoy actions">
		<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
			<circle cx="12" cy="5" r="1.4" />
			<circle cx="12" cy="12" r="1.4" />
			<circle cx="12" cy="19" r="1.4" />
		</svg>
	</button>
</header>

<style>
	.d-header {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 12px 16px 10px;
		background: var(--color-teal);
		border-bottom: 1px solid rgba(255, 255, 255, 0.07);
		position: relative;
		z-index: 5;
	}
	.icon-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		flex-shrink: 0;
		border: none;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.1);
		cursor: pointer;
	}
	.icon-btn:active {
		background: rgba(255, 255, 255, 0.2);
	}

	.pill-wrap {
		position: relative;
		flex: 1;
	}
	.title-pill {
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		width: 100%;
		height: 44px;
		padding: 0 8px 0 12px;
		border: none;
		border-radius: 22px;
		background: rgba(255, 255, 255, 0.1);
		cursor: pointer;
		color: #fff;
		white-space: nowrap;
	}
	.title-pill:active {
		background: rgba(255, 255, 255, 0.2);
	}
	.pill-left {
		display: flex;
		align-items: center;
		gap: 9px;
		min-width: 0;
	}
	.title-name {
		font-family: var(--font-heading);
		font-size: 15px;
		font-weight: 700;
		letter-spacing: 0.03em;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
	}

	.comparing {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 7px;
		height: 44px;
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.75);
	}
</style>
