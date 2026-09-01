<script lang="ts">
	import BottomSheet from '$lib/components/BottomSheet.svelte';

	interface Props {
		open?: boolean;
		buoyName: string;
		ondelete?: () => void;
		onclose?: () => void;
	}

	let { open = $bindable(false), buoyName, ondelete, onclose }: Props = $props();

	function cancel() {
		open = false;
		onclose?.();
	}
	function confirmDelete() {
		open = false;
		ondelete?.();
	}
</script>

<BottomSheet bind:open onclose={cancel} label="Delete buoy">
	<div class="title">Delete {buoyName}?</div>
	<p class="warning">
		This deletes {buoyName} and its full history from your fleet. This can't be undone.
	</p>
	<button class="danger" onclick={confirmDelete}>Yes, Delete Buoy</button>
	<button class="btn-cancel" onclick={cancel}>Cancel</button>
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
		width: 100%;
		height: 52px;
		border: 1.5px solid var(--color-orange);
		border-radius: 26px;
		background: rgba(253, 122, 78, 0.08);
		color: var(--color-orange);
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: 700;
		cursor: pointer;
	}
	.danger:active {
		background: rgba(253, 122, 78, 0.16);
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
