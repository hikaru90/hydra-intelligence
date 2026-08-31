<script lang="ts">
	import type { ParameterId, TimeRange } from '$lib/types';
	import { PARAMETERS } from '$lib/config';
	import ParameterCard from './ParameterCard.svelte';

	interface Props {
		range: TimeRange;
		buoyId: string;
		compareBuoyId?: string;
		compare?: boolean;
		onexpand?: (id: ParameterId, buoyId: string) => void;
	}

	let { range, buoyId, compareBuoyId, compare = false, onexpand }: Props = $props();
</script>

<div class="grid" class:compare>
	{#each PARAMETERS as param (param.id)}
		<ParameterCard {param} {range} {buoyId} compact={compare} {onexpand} />
		{#if compare && compareBuoyId}
			<ParameterCard {param} {range} buoyId={compareBuoyId} compact {onexpand} />
		{/if}
	{/each}
</div>

<style>
	.grid {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 16px 14px 24px;
	}
	.grid.compare {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}
</style>
