<script lang="ts">
	import type { TimeRange } from '$lib/types';

	interface Props {
		range: TimeRange;
		compare: boolean;
		onrange: (range: TimeRange) => void;
		ontogglecompare: () => void;
	}

	let { range, compare, onrange, ontogglecompare }: Props = $props();

	const options: TimeRange[] = ['now', '24h', '7d', '30d'];
	const label: Record<TimeRange, string> = { now: 'now', '24h': '24h', '7d': '7d', '30d': '30d' };
</script>

<div class="controls">
	<div class="pills" role="tablist" aria-label="Time range">
		{#each options as opt (opt)}
			<button
				class="pill"
				class:active={range === opt}
				role="tab"
				aria-selected={range === opt}
				onclick={() => onrange(opt)}
			>
				{label[opt]}
			</button>
		{/each}
	</div>

	<button class="compare" class:on={compare} onclick={ontogglecompare} aria-pressed={compare}>
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" aria-hidden="true">
			<rect x="3" y="4" width="7" height="16" rx="1.5" />
			<rect x="14" y="4" width="7" height="16" rx="1.5" />
		</svg>
		Compare
	</button>
</div>

<style>
	.controls {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 9px 16px;
		background: var(--color-teal);
		position: relative;
		z-index: 4;
	}
	.pills {
		display: flex;
		gap: 6px;
		flex: 1;
	}
	.pill {
		flex: 1;
		height: 44px;
		border: 1.5px solid rgba(255, 255, 255, 0.3);
		border-radius: 22px;
		background: transparent;
		cursor: pointer;
		font-family: var(--font-heading);
		font-size: 11.5px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.72);
		transition: all 0.2s;
	}
	/* Active pill: borderless gradient fill (no rim). */
	.pill.active {
		border: none;
		background: var(--gradient-brand);
		color: var(--color-teal);
	}

	.compare {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		flex-shrink: 0;
		height: 44px;
		padding: 0 15px;
		border: none;
		border-radius: 22px;
		background: rgba(255, 255, 255, 0.1);
		cursor: pointer;
		font-family: var(--font-heading);
		font-size: 12.5px;
		font-weight: 600;
		color: #fff;
		white-space: nowrap;
		transition: background 0.15s;
	}
	.compare.on {
		background: rgba(21, 228, 154, 0.18);
	}
</style>
