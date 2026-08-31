<script lang="ts">
	export type BuoyTab = 'data' | 'obs';

	interface Props {
		tab: BuoyTab;
		/** Observations tab is inert in compare mode (compare is telemetry-only). */
		compare?: boolean;
		onchange: (tab: BuoyTab) => void;
	}

	let { tab, compare = false, onchange }: Props = $props();
</script>

<div class="tabbar">
	<div class="track" role="tablist" aria-label="Buoy view">
		<button
			class="tab"
			class:active={tab === 'data'}
			role="tab"
			aria-selected={tab === 'data'}
			onclick={() => onchange('data')}
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M3 3v18h18" />
				<path d="m7 14 3-3 3 3 4-5" />
			</svg>
			Data
		</button>
		<button
			class="tab"
			class:active={tab === 'obs'}
			class:disabled={compare}
			role="tab"
			aria-selected={tab === 'obs'}
			aria-disabled={compare}
			onclick={() => !compare && onchange('obs')}
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
				<circle cx="12" cy="12" r="3" />
			</svg>
			Observations
		</button>
	</div>
</div>

<style>
	.tabbar {
		padding: 8px 16px 10px;
		background: var(--color-teal);
		position: relative;
		z-index: 4;
	}
	.track {
		display: flex;
		gap: 4px;
		padding: 4px;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.06);
	}
	.tab {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 7px;
		flex: 1;
		height: 44px;
		border: none;
		border-radius: 10px;
		background: transparent;
		cursor: pointer;
		font-family: var(--font-heading);
		font-size: 12.5px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.6);
		transition: background 0.18s, color 0.18s;
	}
	.tab.active {
		background: rgba(255, 255, 255, 0.18);
		color: #fff;
	}
	.tab.disabled {
		opacity: 0.3;
		pointer-events: none;
	}
	.tab svg {
		width: 15px;
		height: 15px;
		flex-shrink: 0;
	}
</style>
