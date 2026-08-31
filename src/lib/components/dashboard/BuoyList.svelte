<script lang="ts">
	import type { Buoy, Site } from '$lib/types';
	import BuoyCard from './BuoyCard.svelte';

	interface Props {
		buoys: Buoy[];
		sites: Site[];
		/** Optional map of buoyId -> latest photo URL. */
		photos?: Record<string, string | null>;
		onselect?: (id: string) => void;
	}

	let { buoys, sites, photos = {}, onselect }: Props = $props();

	// Group buoys under their site, preserving site order and dropping empty sites.
	const grouped = $derived(
		sites
			.map((site) => ({ site, buoys: buoys.filter((b) => b.siteId === site.id) }))
			.filter((group) => group.buoys.length > 0)
	);
</script>

<div class="list">
	{#each grouped as group (group.site.id)}
		<div class="site-label">
			<span class="site-name">{group.site.name}, {group.site.country}</span>
			<span class="site-line"></span>
		</div>
		{#each group.buoys as buoy (buoy.id)}
			<BuoyCard {buoy} photoUrl={photos[buoy.id] ?? null} {onselect} />
		{/each}
	{/each}
</div>

<style>
	.list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 16px 14px 100px;
	}
	.site-label {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 4px;
		padding: 4px 6px 2px;
	}
	.site-label:first-child {
		margin-top: 0;
	}
	.site-name {
		font-family: var(--font-heading);
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: rgba(17, 57, 75, 0.75);
	}
	.site-line {
		flex: 1;
		height: 1px;
		background: rgba(17, 57, 75, 0.14);
	}
</style>
