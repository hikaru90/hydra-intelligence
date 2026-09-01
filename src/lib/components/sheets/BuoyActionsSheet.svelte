<script lang="ts">
	import BottomSheet from '$lib/components/BottomSheet.svelte';

	interface Props {
		open?: boolean;
		/** Hides the delete action — used while comparing, where there's no single "current" buoy to delete. */
		hideDelete?: boolean;
		onexport?: () => void;
		ondelete?: () => void;
		onclose?: () => void;
	}

	let { open = $bindable(false), hideDelete = false, onexport, ondelete, onclose }: Props = $props();

	function cancel() {
		open = false;
		onclose?.();
	}
	function chooseExport() {
		open = false;
		onexport?.();
	}
	function chooseDelete() {
		open = false;
		ondelete?.();
	}
</script>

<BottomSheet bind:open onclose={cancel} label="Buoy actions">
	<button class="action" onclick={chooseExport}>
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
			<polyline points="7,10 12,15 17,10" />
			<line x1="12" y1="15" x2="12" y2="3" />
		</svg>
		Export Data
	</button>

	{#if !hideDelete}
		<!-- Extra gap + a divider before the destructive action, so a rushed
		     tap reaching for "Export Data" can't land on "Delete Buoy" by
		     accident. -->
		<div class="divider"></div>

		<button class="action danger" onclick={chooseDelete}>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<polyline points="3,6 5,6 21,6" />
				<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
				<line x1="10" y1="11" x2="10" y2="17" />
				<line x1="14" y1="11" x2="14" y2="17" />
			</svg>
			Delete Buoy
		</button>
	{/if}

	<button class="btn-cancel" onclick={cancel}>Cancel</button>
</BottomSheet>

<style>
	.action {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		height: 52px;
		padding: 0 18px;
		border: none;
		border-radius: 26px;
		background: rgba(255, 255, 255, 0.07);
		color: #fff;
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: 700;
		cursor: pointer;
	}
	.action:active {
		background: rgba(255, 255, 255, 0.14);
	}
	.action svg {
		flex-shrink: 0;
	}

	.divider {
		height: 1px;
		margin: 18px 4px;
		background: rgba(255, 255, 255, 0.1);
	}

	/* Outlined, not filled — a solid red block read as too alarming for an
	   action that's still one tap from the real (separately confirmed)
	   delete. The contour keeps it legible as "destructive" without
	   shouting. */
	.action.danger {
		border: 1.5px solid var(--color-orange);
		background: rgba(253, 122, 78, 0.08);
		color: var(--color-orange);
	}
	.action.danger:active {
		background: rgba(253, 122, 78, 0.16);
	}

	.btn-cancel {
		width: 100%;
		height: 48px;
		margin-top: 14px;
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
