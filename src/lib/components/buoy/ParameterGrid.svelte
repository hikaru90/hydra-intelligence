<script lang="ts">
	import type { ParameterId, TimeRange } from '$lib/types';
	import { PARAMETERS } from '$lib/config';
	import ParameterCard from './ParameterCard.svelte';

	interface Props {
		range: TimeRange;
		compare?: boolean;
		onexpand?: (id: ParameterId) => void;
	}

	let { range, compare = false, onexpand }: Props = $props();
</script>

<div class="grid" class:compare>
	{#each PARAMETERS as param (param.id)}
		<ParameterCard {param} {range} variant="primary" compact={compare} {onexpand} />
		{#if compare}
			<ParameterCard {param} {range} variant="compare" compact {onexpand} />
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
