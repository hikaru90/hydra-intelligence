<script lang="ts">
	import type { ParameterId, TimeRange } from '$lib/types';
	import { PARAMETERS } from '$lib/config';
	import { telemetrySeries, telemetryRange } from '$lib/data/telemetry';
	import { formatValue } from '$lib/utils/format';
	import { timeAxisTicks, rangeSpan } from '$lib/utils/time-range';
	import BottomSheet from '$lib/components/BottomSheet.svelte';
	import TrendChart from '$lib/components/buoy/TrendChart.svelte';

	interface Props {
		open?: boolean;
		paramId: ParameterId | null;
		buoyId: string;
		buoyName: string;
		range: TimeRange;
		onclose?: () => void;
	}

	let { open = $bindable(false), paramId, buoyId, buoyName, range, onclose }: Props = $props();

	const param = $derived(paramId ? (PARAMETERS.find((p) => p.id === paramId) ?? null) : null);
	const window = $derived<Exclude<TimeRange, 'now'>>(range === 'now' ? '24h' : range);
	const series = $derived(paramId ? telemetrySeries(paramId, buoyId) : []);
	const sMin = $derived(series.length ? Math.min(...series) : 0);
	const sMax = $derived(series.length ? Math.max(...series) : 1);
	const sRange = $derived(sMax - sMin || 1);
	const stat = $derived(paramId ? telemetryRange(paramId, buoyId, window) : { min: 0, max: 1 });
	const ticks = $derived(timeAxisTicks(window, 4));
	const windowLabel = $derived(
		window === '24h' ? 'last 24 hours' : window === '7d' ? 'last 7 days' : 'last 30 days'
	);

	let chartEl = $state<HTMLDivElement>();
	let dragging = $state(false);
	let scrubIndex = $state(0);

	// Park the scrubber at the latest point whenever the sheet opens or the param changes.
	$effect(() => {
		if (open && series.length) scrubIndex = series.length - 1;
	});

	const frac = $derived(series.length ? (series[scrubIndex] - sMin) / sRange : 0);
	const crossLeft = $derived(series.length > 1 ? (scrubIndex / (series.length - 1)) * 100 : 0);
	const dotTop = $derived(8 + (1 - frac) * 84);
	const readoutValue = $derived(formatValue(stat.min + frac * (stat.max - stat.min)));
	const readoutTime = $derived.by(() => {
		if (!series.length) return '';
		const span = rangeSpan(window);
		const t = new Date(Date.now() - span + (scrubIndex / (series.length - 1)) * span);
		return (
			t.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) +
			' ' +
			t.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
		);
	});

	function scrub(e: PointerEvent) {
		if (!chartEl || !series.length) return;
		const rect = chartEl.getBoundingClientRect();
		const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
		scrubIndex = Math.round((x / rect.width) * (series.length - 1));
	}
	function down(e: PointerEvent) {
		dragging = true;
		chartEl?.setPointerCapture?.(e.pointerId);
		scrub(e);
		e.preventDefault();
	}
	function move(e: PointerEvent) {
		if (dragging) scrub(e);
	}
	function up() {
		dragging = false;
	}
	function close() {
		open = false;
		onclose?.();
	}
</script>

<BottomSheet bind:open onclose={close} label="Parameter detail">
	{#if param}
		<div class="head">
			<div class="title"><span>{param.label}</span><span class="unit">· {param.unit}</span></div>
			<div class="meta">{buoyName} · {windowLabel}</div>
		</div>

		<div class="readout">
			<span class="r-time">{readoutTime}</span>
			<span class="r-val" style:color={param.color}>{readoutValue}</span>
		</div>

		<div class="plotwrap">
			<div class="yaxis">
				<span>{formatValue(stat.max)}</span>
				<span>{formatValue((stat.min + stat.max) / 2)}</span>
				<span>{formatValue(stat.min)}</span>
			</div>
			<div
				class="chart"
				bind:this={chartEl}
				onpointerdown={down}
				onpointermove={move}
				onpointerup={up}
				onpointercancel={up}
			>
				<TrendChart {series} color={param.color} gradientId="grad-detail" />
				<div class="cross" style:left={`${crossLeft}%`}></div>
				<div class="dot" style:left={`${crossLeft}%`} style:top={`${dotTop}%`}></div>
			</div>
		</div>

		<div class="xaxis">
			{#each ticks as t, i (i)}<span>{t}</span>{/each}
		</div>

		<div class="hint">Drag across the graph to read any point</div>
	{/if}

	<button class="btn-cancel" onclick={close}>Close</button>
</BottomSheet>

<style>
	.head { margin-bottom: 2px; }
	.title { display: flex; align-items: baseline; gap: 8px; font-family: var(--font-heading); font-size: 17px; font-weight: 700; color: #fff; }
	.unit { font-family: var(--font-body); font-size: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.55); }
	.meta { margin-top: 3px; font-size: 11px; font-weight: 500; color: rgba(255, 255, 255, 0.62); }

	.readout { display: flex; align-items: baseline; gap: 10px; margin: 16px 0 12px; min-height: 28px; }
	.r-time { font-size: 12px; font-weight: 500; color: rgba(255, 255, 255, 0.7); }
	.r-val { font-family: var(--font-heading); font-size: 26px; font-weight: 800; line-height: 1; letter-spacing: -0.02em; }

	.plotwrap { display: flex; gap: 8px; }
	.yaxis { display: flex; flex-direction: column; justify-content: space-between; width: 46px; flex-shrink: 0; padding: 2px 0; text-align: right; }
	.yaxis span { font-family: var(--font-body); font-size: 11px; font-weight: 600; color: rgba(255, 255, 255, 0.6); }

	.chart { position: relative; flex: 1; height: 210px; cursor: crosshair; touch-action: none; user-select: none; }
	.cross { position: absolute; top: 0; bottom: 0; width: 1.5px; background: rgba(255, 255, 255, 0.5); transform: translateX(-50%); pointer-events: none; }
	.dot { position: absolute; width: 13px; height: 13px; border-radius: 50%; background: #fff; border: 2px solid var(--color-teal); transform: translate(-50%, -50%); pointer-events: none; box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.35); }

	.xaxis { display: flex; justify-content: space-between; margin: 8px 0 0 54px; font-family: var(--font-body); font-size: 10px; font-weight: 500; color: rgba(255, 255, 255, 0.55); }
	.hint { margin-top: 14px; text-align: center; font-family: var(--font-body); font-size: 10px; color: rgba(255, 255, 255, 0.45); }

	.btn-cancel { width: 100%; height: 48px; margin-top: 14px; border: none; background: none; color: rgba(255, 255, 255, 0.6); font-family: var(--font-heading); font-size: 13px; font-weight: 600; cursor: pointer; }
	.btn-cancel:active { color: rgba(255, 255, 255, 0.9); }
</style>
