<script lang="ts">
	import type { Map as MlMap } from 'maplibre-gl';
	import { MapLibre, Marker } from 'svelte-maplibre';
	import type { Buoy, Site } from '$lib/types';
	import StatusDot from '$lib/components/StatusDot.svelte';

	interface Props {
		buoys: Buoy[];
		sites: Site[];
		/** The person's current position, if known. */
		you?: { lat: number; lng: number } | null;
		/**
		 * Map style URL. Defaults to the app's dark teal style (static/dark.json,
		 * built on OpenFreeMap tiles — no API key needed) to match the rest of
		 * the Cerberus Blue OS design.
		 */
		styleUrl?: string;
		onselect?: (id: string) => void;
	}

	let { buoys, sites, you = null, styleUrl = '/dark.json', onselect }: Props = $props();

	// Bound map instance — used for programmatic camera moves (flyTo).
	let map = $state<MlMap | undefined>(undefined);
	let currentSite = $state(0);
	let currentBuoy = $state(0);
	let menuOpen = $state(false);
	let attribOpen = $state(false);
	let expanded = $state(false);

	function toggleExpanded() {
		expanded = !expanded;
		// MapLibre sizes its canvas from the container's layout box, which only
		// settles after the CSS transition to/from fullscreen finishes.
		setTimeout(() => map?.resize(), 320);
	}

	const firstSite = $derived(sites[0]);
	const initialCenter = $derived<[number, number]>(
		firstSite?.lng != null && firstSite?.lat != null ? [firstSite.lng, firstSite.lat] : [0, 0]
	);
	const initialZoom = $derived(firstSite?.zoom ?? 12);

	// Only pin buoys that actually have coordinates.
	const pins = $derived(buoys.filter((b) => b.lat != null && b.lng != null));
	// Buoys belonging to whichever site is currently focused — the crosshair
	// steps through these, not the whole fleet, so it stays scoped to what
	// the site pill is already showing.
	const sitePins = $derived(pins.filter((b) => b.siteId === sites[currentSite]?.id));

	function focusSite(i: number) {
		currentSite = i;
		currentBuoy = 0;
		menuOpen = false;
		const site = sites[i];
		if (map && site?.lng != null && site?.lat != null) {
			map.flyTo({ center: [site.lng, site.lat], zoom: site.zoom ?? 12, duration: 900 });
		}
	}

	function focusBuoy(i: number) {
		currentBuoy = i;
		const buoy = sitePins[i];
		if (map && buoy?.lng != null && buoy?.lat != null) {
			map.flyTo({ center: [buoy.lng, buoy.lat], zoom: 15, duration: 900 });
		}
	}

	function cycleBuoy() {
		if (!sitePins.length) return;
		focusBuoy((currentBuoy + 1) % sitePins.length);
	}
</script>

<div class="map-panel" class:expanded>
	<MapLibre
		bind:map
		style={styleUrl}
		center={initialCenter}
		zoom={initialZoom}
		class="map"
		cooperativeGestures
		attributionControl={false}
	>
		{#each pins as buoy (buoy.id)}
			<Marker
				lngLat={[buoy.lng!, buoy.lat!]}
				asButton
				onclick={() => onselect?.(buoy.id)}
			>
				<div class="pin">
					<div class="pin-label">{buoy.name}</div>
					<StatusDot status={buoy.status} variant="map" live={buoy.status === 'warn'} />
				</div>
			</Marker>
		{/each}

		{#if you}
			<Marker lngLat={[you.lng, you.lat]}>
				<div class="you">
					<span class="you-dot"></span>
					<span class="you-label">you</span>
				</div>
			</Marker>
		{/if}
	</MapLibre>

	<!-- Expand toggle: the dashboard map is compact by design (fleet overview,
	     not the data screen), so precise zoom/pan gets a dedicated fullscreen
	     mode instead of permanently growing the panel. -->
	<button
		class="expand-btn"
		onclick={toggleExpanded}
		aria-label={expanded ? 'Collapse map' : 'Expand map'}
		aria-pressed={expanded}
	>
		{#if expanded}
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<polyline points="9 3 9 9 3 9" /><polyline points="15 21 15 15 21 15" />
				<line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
			</svg>
		{:else}
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
				<line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
			</svg>
		{/if}
	</button>

	<!-- Two separate controls, on purpose: a chevron next to a label reads as
	     "pick a value for this" — pairing it with the buoy name would wrongly
	     suggest tapping it lets you choose a buoy, when it actually opens the
	     site list. Site pill (its own full action) + a plain icon-only
	     crosshair button beside it (steps through this site's buoys). -->
	<div class="map-controls">
		<button
			class="buoy-btn"
			onclick={cycleBuoy}
			aria-label={`Jump to next buoy (${sitePins[currentBuoy]?.name ?? ''})`}
		>
			<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#15e49a" stroke-width="2">
				<circle cx="12" cy="12" r="3" />
				<line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" />
				<line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" />
			</svg>
		</button>

		<button
			class="site-pill"
			onclick={() => (menuOpen = !menuOpen)}
			aria-label="Choose a site"
			aria-haspopup="listbox"
			aria-expanded={menuOpen}
		>
			<span class="sj-text">
				<span class="sj-kicker">Site</span>
				<span class="sj-name">{sites[currentSite]?.short ?? ''}</span>
			</span>
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2">
				<polyline points="6,9 12,15 18,9" />
			</svg>
		</button>
	</div>

	{#if menuOpen}
		<div class="sites-menu" role="listbox" aria-label="Sites">
			<div class="sm-head">Jump to site</div>
			{#each sites as site, i (site.id)}
				{@const count = buoys.filter((b) => b.siteId === site.id).length}
				<button class="sm-item" class:sel={i === currentSite} role="option" aria-selected={i === currentSite} onclick={() => focusSite(i)}>
					<span class="sm-loc">
						<span class="sm-name">{site.name}</span>
						<span class="sm-sub">{site.country}</span>
					</span>
					<span class="sm-count">{count}</span>
				</button>
			{/each}
		</div>
	{/if}

	<!-- Map data attribution (required by the OpenFreeMap/OSM licence) — kept
	     minimal: a small "i" pill that expands the credit text on tap, instead
	     of MapLibre's default bar, which stays permanently expanded on the
	     narrow widths this app always runs at. -->
	<div class="attrib" class:open={attribOpen}>
		{#if attribOpen}
			<span class="attrib-text">OpenFreeMap © OpenStreetMap contributors</span>
		{/if}
		<button
			class="attrib-btn"
			onclick={() => (attribOpen = !attribOpen)}
			aria-label="Map data attribution"
			aria-expanded={attribOpen}
		>
			i
		</button>
	</div>
</div>

<style>
	.map-panel {
		position: relative;
		height: 296px;
		flex-shrink: 0;
		overflow: hidden;
		background: var(--color-teal);
		transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.map-panel.expanded {
		position: fixed;
		inset: 0;
		z-index: 50;
		height: 100dvh;
	}

	.expand-btn {
		position: absolute;
		top: 14px;
		right: 14px;
		z-index: 6;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border: none;
		border-radius: 50%;
		background: rgba(9, 43, 58, 0.82);
		backdrop-filter: blur(6px);
		border: 1px solid rgba(255, 255, 255, 0.14);
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
		cursor: pointer;
	}
	/* svelte-maplibre renders into a child div; make it fill the panel. */
	.map-panel :global(.map),
	.map-panel :global(.maplibregl-map) {
		width: 100%;
		height: 100%;
	}

	.pin {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	.pin-label {
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		margin-bottom: 4px;
		padding: 3px 9px;
		border-radius: 10px 10px 10px 2px;
		background: var(--color-teal);
		color: #fff;
		font-family: var(--font-heading);
		font-size: 9px;
		font-weight: 700;
		white-space: nowrap;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
	}

	.you {
		display: flex;
		align-items: center;
		gap: 5px;
	}
	.you-dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
	}
	.you-label {
		padding: 3px 9px;
		border-radius: 10px;
		background: var(--color-teal);
		color: #fff;
		font-family: var(--font-heading);
		font-size: 9px;
		font-weight: 600;
	}

	.map-controls {
		position: absolute;
		bottom: 14px;
		right: 14px;
		z-index: 6;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.buoy-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		flex-shrink: 0;
		border: none;
		border-radius: 50%;
		background: rgba(9, 43, 58, 0.82);
		backdrop-filter: blur(6px);
		border: 1px solid rgba(255, 255, 255, 0.14);
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
		cursor: pointer;
	}
	.site-pill {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		height: 44px;
		padding: 0 12px 0 14px;
		border: none;
		border-radius: 22px;
		background: rgba(9, 43, 58, 0.82);
		backdrop-filter: blur(6px);
		border: 1px solid rgba(255, 255, 255, 0.14);
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
		cursor: pointer;
		color: #fff;
		font-family: var(--font-heading);
	}
	.sj-text {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		line-height: 1.05;
	}
	.sj-kicker {
		font-family: var(--font-body);
		font-size: 8px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.55);
	}
	.sj-name {
		font-size: 12px;
		font-weight: 700;
		white-space: nowrap;
	}

	.sites-menu {
		position: absolute;
		bottom: 66px;
		right: 14px;
		z-index: 7;
		min-width: 210px;
		overflow: hidden;
		border-radius: 16px;
		background: var(--color-teal);
		border: 1px solid rgba(255, 255, 255, 0.15);
		box-shadow: 0 10px 34px rgba(0, 0, 0, 0.45);
	}
	.sm-head {
		padding: 11px 15px 8px;
		font-family: var(--font-heading);
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.45);
	}
	.sm-item {
		display: flex;
		align-items: center;
		gap: 11px;
		width: 100%;
		padding: 12px 15px;
		border: none;
		border-top: 1px solid rgba(255, 255, 255, 0.07);
		background: none;
		cursor: pointer;
		text-align: left;
	}
	.sm-item.sel {
		background: rgba(21, 228, 154, 0.1);
	}
	.sm-loc {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
		min-width: 0;
	}
	.sm-name {
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 700;
		color: #fff;
		line-height: 1;
	}
	.sm-sub {
		font-size: 10px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.6);
	}
	.sm-count {
		flex-shrink: 0;
		font-family: var(--font-heading);
		font-size: 12px;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.85);
	}

	.attrib {
		position: absolute;
		bottom: 8px;
		left: 8px;
		z-index: 6;
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.attrib-text {
		padding: 3px 8px;
		border-radius: 10px;
		background: rgba(9, 43, 58, 0.75);
		backdrop-filter: blur(4px);
		color: rgba(255, 255, 255, 0.65);
		font-size: 9px;
		font-weight: 500;
		white-space: nowrap;
	}
	.attrib-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		flex-shrink: 0;
		border: none;
		border-radius: 50%;
		background: rgba(9, 43, 58, 0.75);
		backdrop-filter: blur(4px);
		color: rgba(255, 255, 255, 0.6);
		font-family: serif;
		font-size: 11px;
		font-style: italic;
		cursor: pointer;
	}
	.attrib.open .attrib-btn {
		color: #fff;
		background: rgba(9, 43, 58, 0.9);
	}
</style>
