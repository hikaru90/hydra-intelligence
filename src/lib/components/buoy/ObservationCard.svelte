<script lang="ts">
	import type { Observation } from '$lib/types';
	import { relativeTime } from '$lib/utils/format';

	interface Props {
		observation: Observation;
		/** The buoy's location description, shown as the "where" line. */
		location: string;
	}

	let { observation, location }: Props = $props();

	const when = $derived(relativeTime(observation.timestamp));
	const hasPhoto = $derived(!!observation.photoUrl);
</script>

<article class="obs-card">
	<div class="photo" class:none={!hasPhoto} style:background-image={hasPhoto ? `url("${observation.photoUrl}")` : undefined}>
		{#if !hasPhoto}
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
				<rect x="3" y="3" width="18" height="18" rx="2" />
				<circle cx="8.5" cy="8.5" r="1.5" />
				<path d="m21 15-5-5L5 21" />
			</svg>
		{/if}
	</div>
	<div class="body">
		<div class="when">
			<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
				<circle cx="12" cy="12" r="9" /><polyline points="12,7 12,12 15,14" />
			</svg>
			{when}
		</div>
		<div class="note">{observation.note}</div>
		<div class="where">
			<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
			</svg>
			<span>{location}</span>
		</div>
	</div>
</article>

<style>
	.obs-card {
		display: flex;
		gap: 12px;
		align-items: stretch;
		padding: 11px;
		border-radius: 18px;
		background: var(--color-teal);
	}
	.photo {
		width: 70px;
		height: 70px;
		flex-shrink: 0;
		border-radius: 12px;
		background-color: var(--color-teal-deep);
		background-size: cover;
		background-position: center;
	}
	.photo.none {
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(255, 255, 255, 0.32);
	}
	.body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}
	.when {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 4px;
		font-family: var(--font-heading);
		font-size: 12.5px;
		font-weight: 700;
		color: #fff;
	}
	.when svg {
		flex-shrink: 0;
		stroke: var(--color-green);
	}
	.note {
		flex: 1;
		font-size: 12px;
		line-height: 1.4;
		color: rgba(255, 255, 255, 0.78);
	}
	.where {
		display: flex;
		align-items: center;
		gap: 4px;
		min-width: 0;
		margin-top: 7px;
		font-size: 10px;
		color: rgba(255, 255, 255, 0.5);
	}
	.where svg {
		flex-shrink: 0;
	}
	.where span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
	}
</style>
