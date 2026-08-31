<script lang="ts">
	import { buildSparkline } from '$lib/utils/chart';

	interface Props {
		series: number[];
		color: string;
		/** Unique per instance so gradient <defs> don't collide. */
		gradientId: string;
	}

	let { series, color, gradientId }: Props = $props();

	const path = $derived(buildSparkline(series));
</script>

<svg class="chart" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
	<defs>
		<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color={color} stop-opacity="0.26" />
			<stop offset="100%" stop-color={color} stop-opacity="0.02" />
		</linearGradient>
	</defs>
	<line class="gl" x1="0" y1={path.pad} x2="100" y2={path.pad} />
	<line class="gl mid" x1="0" y1="50" x2="100" y2="50" />
	<line class="gl" x1="0" y1={100 - path.pad} x2="100" y2={100 - path.pad} />
	<path d={path.area} fill="url(#{gradientId})" />
	<path
		d={path.line}
		fill="none"
		stroke={color}
		stroke-width="2"
		vector-effect="non-scaling-stroke"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>

<style>
	.chart {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.gl {
		stroke: rgba(255, 255, 255, 0.1);
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}
	.gl.mid {
		stroke: rgba(255, 255, 255, 0.05);
	}
</style>
