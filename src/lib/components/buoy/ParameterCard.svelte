<script lang="ts">
	import type { ParameterDef, TimeRange } from '$lib/types';
	import {
		telemetrySnapshot,
		telemetryDirection,
		telemetryRange,
		telemetrySeries
	} from '$lib/data/telemetry';
	import { formatValue } from '$lib/utils/format';
	import { timeAxisTicks } from '$lib/utils/time-range';
	import TrendChart from './TrendChart.svelte';

	interface Props {
		param: ParameterDef;
		range: TimeRange;
		/** primary buoy or the compared buoy (second column). */
		variant?: 'primary' | 'compare';
		/** true inside the two-column compare grid (smaller type). */
		compact?: boolean;
		onexpand?: (id: ParameterDef['id']) => void;
	}

	let { param, range, variant = 'primary', compact = false, onexpand }: Props = $props();

	const isCompare = $derived(variant === 'compare');
	const isSnapshot = $derived(range === 'now');

	const value = $derived(formatValue(telemetrySnapshot(param.id, isCompare)));
	const direction = $derived(telemetryDirection(param.id));
	const trendWord = $derived(direction === 1 ? 'rising' : direction === -1 ? 'falling' : 'same');

	// Snapshot has no window, so trend cards borrow the 24h band when range is 'now'.
	const stat = $derived(telemetryRange(param.id, range === 'now' ? '24h' : range));
	const series = $derived(telemetrySeries(param.id, isCompare));
	const ticks = $derived(timeAxisTicks(range === 'now' ? '24h' : range, compact ? 2 : 3));
	const gradientId = $derived(`grad-${param.id}-${variant}`);

	function expand() {
		onexpand?.(param.id);
	}
	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			expand();
		}
	}
</script>

<div
	class="pcard"
	class:snap={isSnapshot}
	class:trend={!isSnapshot}
	class:compact
	role="button"
	tabindex="0"
	onclick={expand}
	onkeydown={onKeydown}
	aria-label={`${param.label}, ${param.unit}. Open detail`}
>
	{#if isSnapshot}
		<div class="snap-body">
			<div class="head">
				<span class="label"><span class="lname">{param.label}</span><span class="unit">{param.unit}</span></span>
				<span class="snap-trend">
					{#if direction === 1}
						<svg viewBox="0 0 9 9" aria-hidden="true"><polygon points="4.5,1 8,8 1,8" fill="currentColor" /></svg>
					{:else if direction === -1}
						<svg viewBox="0 0 9 9" aria-hidden="true"><polygon points="4.5,8 8,1 1,1" fill="currentColor" /></svg>
					{:else}
						<svg viewBox="0 0 9 9" aria-hidden="true"><rect x="1" y="3.5" width="7" height="2" fill="currentColor" /></svg>
					{/if}
					<span>{trendWord}</span>
				</span>
			</div>
			<div class="snap-bottom">
				<span class="value" style:color={param.color}>{value}</span>
				<span class="expand">
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
						<line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
					</svg>
				</span>
			</div>
		</div>
	{:else}
		<div class="trend-body">
			<div class="head">
				<span class="label"><span class="lname">{param.label}</span><span class="unit">{param.unit}</span></span>
				<span class="expand">
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
						<line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
					</svg>
				</span>
			</div>
			<div class="plot-row">
				<div class="ygutter">
					<div><div class="ty-lbl">MAX</div><div class="ty-val" style:color={param.color}>{formatValue(stat.max)}</div></div>
					<div><div class="ty-lbl">MIN</div><div class="ty-val" style:color={param.color}>{formatValue(stat.min)}</div></div>
				</div>
				<div class="plot">
					<TrendChart {series} color={param.color} {gradientId} />
				</div>
			</div>
			<div class="xaxis">
				{#each ticks as t, i (i)}<span>{t}</span>{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.pcard {
		position: relative;
		overflow: hidden;
		border-radius: 20px;
		background: var(--color-teal);
		cursor: pointer;
		transition: opacity 0.15s;
	}
	.pcard:active {
		opacity: 0.85;
	}
	.pcard:focus-visible {
		outline: 2px solid var(--color-green);
		outline-offset: 2px;
	}
	.pcard.snap {
		height: 104px;
	}
	.pcard.trend {
		height: 158px;
	}

	.snap-body {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
		padding: 13px 15px;
	}
	.trend-body {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 12px 14px;
	}

	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
	}
	.label {
		display: flex;
		align-items: baseline;
		gap: 6px;
		min-width: 0;
		font-family: var(--font-heading);
		font-size: 10px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.72);
	}
	.compact .label {
		font-size: 9px;
	}
	.lname {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.unit {
		flex-shrink: 0;
		font-family: var(--font-body);
		font-weight: 600;
		color: rgba(255, 255, 255, 0.5);
	}
	.compact .unit {
		font-size: 9px;
	}
	.expand {
		display: flex;
		flex-shrink: 0;
		color: rgba(255, 255, 255, 0.38);
	}

	.snap-trend {
		display: flex;
		align-items: center;
		gap: 4px;
		flex-shrink: 0;
		font-size: 12px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.82);
	}
	.snap-trend svg {
		width: 10px;
		height: 10px;
	}
	.compact .snap-trend {
		font-size: 9px;
	}
	.compact .snap-trend svg {
		width: 8px;
		height: 8px;
	}

	.snap-bottom {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}
	.value {
		font-family: var(--font-heading);
		font-size: 34px;
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.02em;
	}
	.compact .value {
		font-size: 24px;
	}
	.snap-bottom .expand {
		margin-bottom: 4px;
	}

	.plot-row {
		display: flex;
		gap: 8px;
		flex: 1;
		min-height: 0;
		margin-top: 6px;
	}
	.ygutter {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 44px;
		flex-shrink: 0;
		padding: 2px 0;
	}
	.compact .ygutter {
		width: 34px;
	}
	.ty-lbl {
		margin-bottom: 2px;
		font-size: 8px;
		font-weight: 600;
		line-height: 1;
		letter-spacing: 0.04em;
		color: rgba(255, 255, 255, 0.5);
	}
	.ty-val {
		font-family: var(--font-heading);
		font-size: 17px;
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.01em;
	}
	.compact .ty-val {
		font-size: 13px;
	}
	.plot {
		position: relative;
		flex: 1;
		min-width: 0;
	}

	.xaxis {
		display: flex;
		justify-content: space-between;
		margin-top: 7px;
		padding-left: 52px;
		font-family: var(--font-body);
		font-size: 9px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.62);
	}
	.compact .xaxis {
		font-size: 8px;
		padding-left: 42px;
	}
</style>
