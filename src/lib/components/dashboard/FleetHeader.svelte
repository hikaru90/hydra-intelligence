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
	<!-- Shares view-transition-name with the login screen's identical brand
	     lockup, so signing in leaves it sitting still while the rest of the
	     page transitions around it. -->
	<div class="brand" style="view-transition-name: brand-mark">
		<img class="logo" src="/cerberus-mark-dark.svg" alt="" aria-hidden="true" />
		<span class="brand-name"><span class="brand-primary">Cerberus Blue</span> <span class="brand-suffix">OS</span></span>
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
		padding: calc(12px + env(safe-area-inset-top)) 16px 10px;
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
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		min-width: 0;
	}
	/* Plain Montserrat (--font-body), not the Alternates display face used
	   for section labels/big numbers elsewhere — the wordmark reads more
	   composed and less decorative in the straighter face. */
	.brand-primary {
		font-family: var(--font-body);
		font-size: 16px;
		font-weight: 700;
		letter-spacing: 0.01em;
		color: #fff;
	}
	/* Sky blue at full opacity, not dimmed white — a translucent white read
	   as disabled/inactive UI text rather than an intentional secondary
	   brand color. Sky blue is already in the marine palette and isn't a
	   status color (green/orange are), so it doesn't borrow meaning from
	   elsewhere in the UI. */
	.brand-suffix {
		font-family: var(--font-body);
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.01em;
		color: var(--color-sky);
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
