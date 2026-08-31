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
		<svg class="logo" viewBox="0 0 1583.23 1583.23" aria-hidden="true">
			<circle fill="#15e49a" cx="791.61" cy="791.61" r="791.61" />
			<circle fill="#11394b" cx="308.1" cy="504.76" r="20.91" />
			<circle fill="#11394b" cx="275.07" cy="747.43" r="16.52" />
			<circle fill="#11394b" cx="1062.74" cy="1220.72" r="20.91" />
			<path
				fill="#11394b"
				d="M381.46,432.49c-27.02,0-49-21.98-49-49s21.98-49,49-49,49,21.98,49,49-21.98,49-49,49ZM381.46,351.74c-17.5,0-31.74,14.24-31.74,31.75s14.24,31.74,31.74,31.74,31.75-14.24,31.75-31.74-14.24-31.75-31.75-31.75Z"
			/>
			<path
				fill="#11394b"
				d="M1126.59,1164.03c-45.17,0-81.91-36.75-81.91-81.91s36.75-81.91,81.91-81.91,81.91,36.74,81.91,81.91-36.74,81.91-81.91,81.91ZM1126.59,1023.21c-32.48,0-58.91,26.43-58.91,58.91s26.43,58.91,58.91,58.91,58.91-26.43,58.91-58.91-26.43-58.91-58.91-58.91Z"
			/>
		</svg>
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
