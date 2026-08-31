<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open?: boolean;
		/** Rendered inside the sheet, below the drag handle. */
		children: Snippet;
		onclose?: () => void;
		/** Accessible label for the dialog. */
		label?: string;
	}

	let { open = $bindable(false), children, onclose, label }: Props = $props();

	function close() {
		open = false;
		onclose?.();
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') close();
	}
</script>

<svelte:window onkeydown={open ? onKeydown : undefined} />

<div
	class="overlay"
	class:open
	onclick={close}
	role="presentation"
	aria-hidden="true"
></div>

<div class="sheet" class:open role="dialog" aria-modal="true" aria-label={label}>
	<div class="handle"></div>
	{@render children()}
</div>

<style>
	.overlay {
		position: absolute;
		inset: 0;
		z-index: 500;
		background: rgba(0, 0, 0, 0.6);
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.25s;
	}
	.overlay.open {
		opacity: 1;
		pointer-events: all;
	}

	.sheet {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 501;
		max-height: 90%;
		overflow-y: auto;
		padding: 0 16px 40px;
		background: var(--color-teal);
		border-radius: 24px 24px 0 0;
		transform: translateY(100%);
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.sheet.open {
		transform: translateY(0);
	}
	.sheet::-webkit-scrollbar {
		display: none;
	}

	.handle {
		width: 36px;
		height: 4px;
		margin: 14px auto 18px;
		border-radius: 2px;
		background: rgba(255, 255, 255, 0.2);
	}
</style>
