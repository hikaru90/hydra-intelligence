<script lang="ts">
	interface Props {
		onclick: () => void;
	}

	let { onclick }: Props = $props();
</script>

<button class="fab-ci" {onclick}>
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#11394b" stroke-width="2.5" aria-hidden="true">
		<line x1="12" y1="5" x2="12" y2="19" />
		<line x1="5" y1="12" x2="19" y2="12" />
	</svg>
	New Check-In
</button>

<style>
	.fab-ci {
		position: absolute;
		bottom: calc(20px + env(safe-area-inset-bottom));
		left: 50%;
		transform: translateX(-50%);
		z-index: 15;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 54px;
		padding: 0 30px;
		border: none;
		border-radius: 28px;
		background: var(--gradient-brand);
		box-shadow: var(--shadow-fab);
		cursor: pointer;
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: 700;
		color: var(--color-teal);
		white-space: nowrap;
		transition: transform 0.15s, opacity 0.15s;
	}
	.fab-ci:active {
		transform: translateX(-50%) scale(0.96);
		opacity: 0.9;
	}
	.fab-ci:focus-visible {
		outline: 2px solid var(--color-teal);
		outline-offset: 3px;
	}
</style>
