<script lang="ts">
	import type { BuoyStatus } from '$lib/types';
	import { STATUS_COLOR } from '$lib/config';

	interface Props {
		status: BuoyStatus;
		/** card = 44px dashboard hero, map = 30px pin, mini = 22px inline. */
		variant?: 'card' | 'map' | 'mini';
		/** Pulse only where "live" is the message (dashboard hero, map). */
		live?: boolean;
	}

	let { status, variant = 'mini', live = false }: Props = $props();

	const color = $derived(STATUS_COLOR[status]);
</script>

<span class="sdot {variant}" class:live>
	{#if live}
		<span class="pulse" style:background={color}></span>
	{/if}
	<span class="core" style:background={color}></span>
</span>

<style>
	.sdot {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: rgba(9, 43, 58, 0.6);
		border: 1px solid rgba(255, 255, 255, 0.16);
		flex-shrink: 0;
	}
	.core {
		position: relative;
		z-index: 2;
		border-radius: 50%;
	}
	.pulse {
		position: absolute;
		top: 50%;
		left: 50%;
		border-radius: 50%;
		transform: translate(-50%, -50%);
	}
	.sdot.live .pulse {
		animation: sdpulse 2.2s ease-out infinite;
	}

	.card {
		width: 44px;
		height: 44px;
	}
	.card .core,
	.card .pulse {
		width: 18px;
		height: 18px;
	}

	.map {
		width: 30px;
		height: 30px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
	}
	.map .core,
	.map .pulse {
		width: 12px;
		height: 12px;
	}

	.mini {
		width: 22px;
		height: 22px;
	}
	.mini .core,
	.mini .pulse {
		width: 10px;
		height: 10px;
	}

	@keyframes sdpulse {
		0% {
			transform: translate(-50%, -50%) scale(1);
			opacity: 0.5;
		}
		70% {
			transform: translate(-50%, -50%) scale(2.1);
			opacity: 0;
		}
		100% {
			opacity: 0;
		}
	}
</style>
