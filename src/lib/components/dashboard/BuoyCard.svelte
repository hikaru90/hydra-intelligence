<script lang="ts">
	import type { Buoy } from '$lib/types';
	import { STATUS_COLOR, STATUS_TEXT } from '$lib/config';
	import { batteryColor, buoySubline, relativeTime } from '$lib/utils/format';
	import StatusDot from '$lib/components/StatusDot.svelte';

	interface Props {
		buoy: Buoy;
		/** Latest observation photo for this buoy; falls back to a plain backing. */
		photoUrl?: string | null;
		onselect?: (id: string) => void;
	}

	let { buoy, photoUrl = null, onselect }: Props = $props();

	const isLive = $derived(buoy.status !== 'warn');
	const statusColor = $derived(STATUS_COLOR[buoy.status]);
	const statusText = $derived(STATUS_TEXT[buoy.status]);
	const batColor = $derived(batteryColor(buoy.battery));
	const sub = $derived(buoySubline(buoy));
	const lastCheckIn = $derived(relativeTime(buoy.lastCheckInAt));

	function activate() {
		onselect?.(buoy.id);
	}
	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			activate();
		}
	}
</script>

<div
	class="bcard"
	role="button"
	tabindex="0"
	onclick={activate}
	onkeydown={onKeydown}
	aria-label={`${buoy.name}, ${statusText}`}
	style:view-transition-name={`buoy-card-${buoy.id}`}
>
	<div class="photo" style:background-image={photoUrl ? `url("${photoUrl}")` : undefined}>
		<div class="photo-dot">
			<StatusDot status={buoy.status} variant="card" live={buoy.status === 'warn'} />
		</div>
	</div>

	<div class="info">
		<div class="name-row">
			<span class="name">{buoy.name}</span>
		</div>

		<div class="status-row">
			<span class="status-text" style:color={statusColor}>
				{#if isLive}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M2 12.5c1.5 0 2-3.5 3.2-3.5s1.3 7 2.6 7 1.4-11 2.7-11 1.4 9 2.6 9 1.3-4 2.4-4H22" />
					</svg>
				{:else}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M10.3 3.9 1.8 18a1.5 1.5 0 0 0 1.3 2.3h17.8a1.5 1.5 0 0 0 1.3-2.3L13.7 3.9a1.5 1.5 0 0 0-2.6 0Z" />
						<line x1="12" y1="9" x2="12" y2="13" />
						<line x1="12" y1="17" x2="12" y2="17" />
					</svg>
				{/if}
				{statusText}
			</span>

			<div class="battery">
				<div class="bat-outer">
					<div class="bat-fill" style:width={`${buoy.battery}%`} style:background={batColor}></div>
				</div>
				<div class="bat-cap"></div>
				<span style:color={batColor}>{buoy.battery}%</span>
			</div>
		</div>

		<div class="subline" class:italic={sub.italic}>{sub.text}</div>
		<div class="checkin">Last Check-In: <strong>{lastCheckIn}</strong></div>
	</div>

	<div class="arrow">
		<div class="arrow-circle">
			<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" aria-hidden="true">
				<polyline points="9,18 15,12 9,6" />
			</svg>
		</div>
	</div>
</div>

<style>
	.bcard {
		display: flex;
		align-items: stretch;
		height: 111px;
		overflow: hidden;
		border-radius: 56px;
		background: var(--color-teal);
		cursor: pointer;
		transition: opacity 0.15s;
	}
	.bcard:active {
		opacity: 0.82;
	}
	.bcard:focus-visible {
		outline: 2px solid var(--color-green);
		outline-offset: 2px;
	}

	.photo {
		position: relative;
		flex-shrink: 0;
		width: 104px;
		min-width: 104px;
		height: 111px;
		overflow: hidden;
		border-radius: 56px 0 0 56px;
		background-color: var(--color-teal-deep);
		background-size: cover;
		background-position: center;
	}
	/* Fade the photo into the card body. */
	.photo::after {
		content: '';
		position: absolute;
		inset: 0 0 0 auto;
		width: 100%;
		z-index: 2;
		pointer-events: none;
		background: linear-gradient(to right, transparent 0%, transparent 42%, var(--color-teal) 100%);
	}
	.photo-dot {
		position: absolute;
		top: 50%;
		left: 48%;
		z-index: 3;
		transform: translate(-50%, -50%);
	}

	.info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 2px;
		padding: 15px 8px 15px 10px;
	}
	.name-row {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
		margin-bottom: 1px;
	}
	.name {
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: 800;
		letter-spacing: 0.04em;
		line-height: 1;
		color: #fff;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
	}

	.status-row {
		display: flex;
		align-items: center;
		gap: 5px;
		margin-bottom: 3px;
	}
	.status-text {
		display: inline-flex;
		align-items: center;
		font-family: var(--font-heading);
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.02em;
		white-space: nowrap;
	}
	.status-text svg {
		width: 10px;
		height: 10px;
		margin-right: 3px;
		flex-shrink: 0;
	}

	.battery {
		display: flex;
		align-items: center;
		gap: 3px;
		margin-left: auto;
		flex-shrink: 0;
		font-size: 10px;
		font-weight: 600;
	}
	.bat-outer {
		width: 18px;
		height: 9px;
		padding: 1px;
		border: 1.5px solid rgba(255, 255, 255, 0.5);
		border-radius: 2px;
	}
	.bat-fill {
		height: 100%;
		border-radius: 1px;
	}
	.bat-cap {
		width: 2.5px;
		height: 4px;
		margin-left: 1px;
		border-radius: 0 1px 1px 0;
		background: rgba(255, 255, 255, 0.4);
	}

	.subline {
		font-size: 11px;
		line-height: 1.3;
		color: rgba(255, 255, 255, 0.72);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.subline.italic {
		font-style: italic;
	}
	.checkin {
		margin-top: 1px;
		font-size: 11px;
		color: rgba(255, 255, 255, 0.72);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.checkin strong {
		color: #fff;
		font-weight: 700;
	}

	.arrow {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		padding: 0 16px 0 6px;
	}
	.arrow-circle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		border-radius: 50%;
		background: var(--color-teal-darkest);
	}
	.arrow-circle svg {
		width: 14px;
		height: 14px;
	}
</style>
