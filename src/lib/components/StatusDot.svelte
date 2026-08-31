<script lang="ts">
	import type { BuoyStatus } from '$lib/types';
	import { STATUS_COLOR } from '$lib/config';

	interface Props {
		status: BuoyStatus;
		/** card = 44px dashboard hero, map = 30px pin, mini = 22px inline. */
		variant?: 'card' | 'map' | 'mini';
		/**
		 * Pulse the ring. Reserve this for states that should actually draw the
		 * eye — a calm "ok" buoy doesn't need motion, but "needs attention"
		 * does (pulse = alert, not "is transmitting").
		 */
		live?: boolean;
	}

	let { status, variant = 'mini', live = false }: Props = $props();

	const color = $derived(STATUS_COLOR[status]);
</script>

<span class="sdot {variant}" class:live>
	{#if live}
		<span class="pulse" style:background={color}></span>
	{/if}
	<span class="glow" style:background={color}></span>
	<span class="core" style:background={color}></span>
</span>

<style>
	.sdot {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		flex-shrink: 0;
	}
	.core {
		position: relative;
		z-index: 2;
		border-radius: 50%;
	}
	.glow {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 1;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		filter: blur(6px);
		opacity: 0.55;
	}
	.pulse {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 0;
		border-radius: 50%;
		transform: translate(-50%, -50%);
	}
	.sdot.live .pulse {
		animation: sdpulse 1.8s ease-out infinite;
	}

	.card {
		width: 44px;
		height: 44px;
	}
	.card .core {
		width: 26px;
		height: 26px;
	}
	.card .glow {
		width: 34px;
		height: 34px;
	}
	.card .pulse {
		width: 26px;
		height: 26px;
	}

	.map {
		width: 30px;
		height: 30px;
	}
	.map .core {
		width: 17px;
		height: 17px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
	}
	.map .glow {
		width: 24px;
		height: 24px;
	}
	.map .pulse {
		width: 17px;
		height: 17px;
	}

	.mini {
		width: 22px;
		height: 22px;
	}
	.mini .core {
		width: 13px;
		height: 13px;
	}
	.mini .glow {
		width: 18px;
		height: 18px;
	}
	.mini .pulse {
		width: 13px;
		height: 13px;
	}

	@keyframes sdpulse {
		0% {
			transform: translate(-50%, -50%) scale(1);
			opacity: 0.45;
		}
		70% {
			transform: translate(-50%, -50%) scale(2.3);
			opacity: 0;
		}
		100% {
			opacity: 0;
		}
	}
</style>
