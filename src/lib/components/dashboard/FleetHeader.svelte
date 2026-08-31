<script lang="ts">
	interface Props {
		total: number;
		/** Number of buoys needing attention. Chip hides at 0. */
		attention: number;
	}

	let { total, attention }: Props = $props();

	const totalLabel = $derived(`${total} ${total === 1 ? 'buoy' : 'buoys'}`);
	const attentionLabel = $derived(
		`${attention} buoy${attention === 1 ? '' : 's'} need${attention === 1 ? 's' : ''} attention`
	);
</script>

<header class="s1-header">
	<div class="brand">
		<img class="logo" src="/cerberus-mark-green.svg" alt="" aria-hidden="true" />
		<span class="brand-name">Cerberus OS</span>
	</div>

	<div class="fleet">
		<span class="fleet-total">{totalLabel}</span>
		{#if attention > 0}
			<span class="fleet-alert" aria-label={attentionLabel}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M10.3 3.9 1.8 18a1.5 1.5 0 0 0 1.3 2.3h17.8a1.5 1.5 0 0 0 1.3-2.3L13.7 3.9a1.5 1.5 0 0 0-2.6 0Z" />
					<line x1="12" y1="9" x2="12" y2="13" />
					<line x1="12" y1="17" x2="12" y2="17" />
				</svg>
				<span>{attention}</span>
			</span>
		{/if}
	</div>
</header>

<style>
	.s1-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 15px 18px 13px;
		background: var(--color-teal);
		border-bottom: 1px solid rgba(255, 255, 255, 0.07);
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 0;
	}
	.logo {
		width: 26px;
		height: 26px;
	}
	.brand-name {
		font-family: var(--font-heading);
		font-size: 16px;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: #fff;
		white-space: nowrap;
	}
	.fleet {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-shrink: 0;
	}
	.fleet-total {
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 700;
		color: #fff;
		white-space: nowrap;
	}
	.fleet-alert {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 4px 9px;
		border-radius: 20px;
		background: rgba(253, 122, 78, 0.16);
		color: var(--color-orange);
		font-family: var(--font-heading);
		font-size: 12px;
		font-weight: 700;
		white-space: nowrap;
	}
	.fleet-alert svg {
		width: 12px;
		height: 12px;
		flex-shrink: 0;
	}
</style>
