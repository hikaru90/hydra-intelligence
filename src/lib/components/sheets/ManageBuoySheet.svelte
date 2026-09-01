<script lang="ts">
	import BottomSheet from '$lib/components/BottomSheet.svelte';

	interface Props {
		open?: boolean;
		buoyName: string;
		onremove?: () => void;
		onclose?: () => void;
	}

	let { open = $bindable(false), buoyName, onremove, onclose }: Props = $props();

	let confirming = $state(false);

	$effect(() => {
		if (open) confirming = false;
	});

	function cancel() {
		open = false;
		onclose?.();
	}
	function remove() {
		open = false;
		onremove?.();
	}
</script>

<BottomSheet bind:open onclose={cancel} label="Manage buoy">
	{#if !confirming}
		<div class="title">Manage Buoy</div>
		<button class="danger" onclick={() => (confirming = true)}>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<polyline points="3,6 5,6 21,6" />
				<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
				<line x1="10" y1="11" x2="10" y2="17" />
				<line x1="14" y1="11" x2="14" y2="17" />
			</svg>
			Remove Buoy
		</button>
		<button class="btn-cancel" onclick={cancel}>Cancel</button>
	{:else}
		<div class="title">Remove {buoyName}?</div>
		<p class="warning">
			This removes {buoyName} and its full history from your fleet. This can't be undone.
		</p>
		<button class="danger confirm" onclick={remove}>Yes, Remove Buoy</button>
		<button class="btn-cancel" onclick={() => (confirming = false)}>Cancel</button>
	{/if}
</BottomSheet>

<style>
	.title {
		font-family: var(--font-heading);
		font-size: 16px;
		font-weight: 700;
		color: #fff;
		margin-bottom: 14px;
	}
	.warning {
		font-family: var(--font-body);
		font-size: 13px;
		line-height: 1.5;
		color: rgba(255, 255, 255, 0.72);
		margin: 0 0 20px;
	}
	.danger {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		height: 52px;
		border: 1.5px solid var(--color-orange);
		border-radius: 26px;
		background: rgba(253, 122, 78, 0.1);
		color: var(--color-orange);
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: 700;
		cursor: pointer;
	}
	.danger:active {
		background: rgba(253, 122, 78, 0.2);
	}
	.danger.confirm {
		background: var(--color-orange);
		color: var(--color-teal);
	}
	.danger.confirm:active {
		opacity: 0.85;
	}
	.btn-cancel {
		width: 100%;
		height: 48px;
		margin-top: 6px;
		border: none;
		background: none;
		color: rgba(255, 255, 255, 0.6);
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
	}
	.btn-cancel:active {
		color: rgba(255, 255, 255, 0.9);
	}
</style>
