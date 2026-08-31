<script lang="ts">
	import type { Observation } from '$lib/types';
	import ObservationCard from './ObservationCard.svelte';

	interface Props {
		/** Already sorted newest-first. */
		observations: Observation[];
		location: string;
	}

	let { observations, location }: Props = $props();

	const count = $derived(observations.length);
</script>

<div class="log">
	{#if count === 0}
		<div class="empty">
			<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
				<circle cx="12" cy="12" r="3" />
			</svg>
			<div class="empty-title">No observations yet</div>
			<div class="empty-sub">Tap New Check-In below to log the first one.</div>
		</div>
	{:else}
		<div class="head">
			Field log · {count} observation{count === 1 ? '' : 's'} · newest first
		</div>
		{#each observations as obs (obs.id)}
			<ObservationCard observation={obs} {location} />
		{/each}
	{/if}
</div>

<style>
	.log {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 16px 14px 100px;
	}
	.head {
		padding: 2px 4px 4px;
		font-family: var(--font-body);
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.02em;
		color: rgba(17, 57, 75, 0.6);
	}

	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 56px 34px;
		color: rgba(17, 57, 75, 0.5);
	}
	.empty svg {
		margin-bottom: 14px;
		opacity: 0.5;
	}
	.empty-title {
		margin-bottom: 5px;
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: 700;
		color: rgba(17, 57, 75, 0.7);
	}
	.empty-sub {
		font-size: 12px;
		line-height: 1.4;
		color: rgba(17, 57, 75, 0.5);
	}
</style>
