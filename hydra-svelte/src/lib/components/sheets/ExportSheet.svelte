<script lang="ts">
	import BottomSheet from '$lib/components/BottomSheet.svelte';

	type Preset = '24h' | '7d' | '30d' | 'all' | 'custom';
	type Format = 'pdf' | 'csv';

	interface Props {
		open?: boolean;
		onexport?: (payload: { preset: Preset; format: Format; from?: string; to?: string }) => void;
		onclose?: () => void;
	}

	let { open = $bindable(false), onexport, onclose }: Props = $props();

	const DAY = 86_400_000;
	function isoDate(d: Date) {
		return d.toISOString().slice(0, 10);
	}
	function fmtDMY(iso: string) {
		return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	let preset = $state<Preset>('7d');
	let format = $state<Format>('pdf');
	let from = $state('');
	let to = $state('');

	$effect(() => {
		if (open) {
			preset = '7d';
			format = 'pdf';
			to = isoDate(new Date());
			from = isoDate(new Date(Date.now() - 6 * DAY));
		}
	});

	const presetLabel = $derived.by(() => {
		const now = new Date();
		if (preset === '24h') {
			const s = new Date(now.getTime() - DAY);
			return `${s.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} ${s.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} → now`;
		}
		if (preset === '7d') return `${fmtDMY(isoDate(new Date(now.getTime() - 6 * DAY)))} → ${fmtDMY(isoDate(now))}`;
		if (preset === '30d') return `${fmtDMY(isoDate(new Date(now.getTime() - 29 * DAY)))} → ${fmtDMY(isoDate(now))}`;
		if (preset === 'all') return `All data on record, up to ${fmtDMY(isoDate(now))}`;
		return '';
	});

	const customSummary = $derived.by(() => {
		if (!from || !to) return { text: 'Pick a start and end date', ok: false };
		const f = new Date(from + 'T00:00:00');
		const t = new Date(to + 'T00:00:00');
		if (t < f) return { text: 'End date is before the start date', ok: false };
		const days = Math.round((t.getTime() - f.getTime()) / DAY) + 1;
		return { text: `${fmtDMY(from)} → ${fmtDMY(to)} · ${days} day${days === 1 ? '' : 's'}`, ok: true };
	});

	const canExport = $derived(preset !== 'custom' || customSummary.ok);
	const presets: { key: Preset; label: string }[] = [
		{ key: '24h', label: '24h' },
		{ key: '7d', label: '7d' },
		{ key: '30d', label: '30d' },
		{ key: 'all', label: 'All' },
		{ key: 'custom', label: 'Custom' }
	];

	function start() {
		if (!canExport) return;
		onexport?.(preset === 'custom' ? { preset, format, from, to } : { preset, format });
		open = false;
	}
	function cancel() {
		open = false;
		onclose?.();
	}
</script>

<BottomSheet bind:open onclose={cancel} label="Export data">
	<div class="title">Export Data</div>

	<div class="label">Time Range</div>
	<div class="chips">
		{#each presets as p (p.key)}
			<button class="chip" class:sel={preset === p.key} onclick={() => (preset = p.key)}>{p.label}</button>
		{/each}
	</div>

	{#if preset === 'custom'}
		<div class="dates">
			<div class="field">
				<label class="date-lbl" for="ex-from">From</label>
				<input id="ex-from" class="date" type="date" bind:value={from} />
			</div>
			<div class="field">
				<label class="date-lbl" for="ex-to">To</label>
				<input id="ex-to" class="date" type="date" bind:value={to} />
			</div>
		</div>
		<div class="summary" class:bad={!customSummary.ok}>{customSummary.text}</div>
	{:else}
		<div class="resolved">
			<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><polyline points="12,7 12,12 15,14" /></svg>
			<span>{presetLabel}</span>
		</div>
	{/if}

	<div class="label">Photo Gallery</div>
	<div class="gallery"><div class="tile"></div><div class="tile"></div><div class="tile"></div></div>

	<div class="label">Format</div>
	<div class="formats">
		<button class="fmt" class:sel={format === 'pdf'} onclick={() => (format = 'pdf')}>PDF<span>Report with charts &amp; photos</span></button>
		<button class="fmt" class:sel={format === 'csv'} onclick={() => (format = 'csv')}>CSV<span>Raw data, full precision</span></button>
	</div>

	<button class="btn" onclick={start} disabled={!canExport}>Start Export</button>
	<button class="btn-cancel" onclick={cancel}>Cancel</button>
</BottomSheet>

<style>
	.title { font-family: var(--font-heading); font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 14px; }
	.label { font-family: var(--font-heading); font-size: 10px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: rgba(255, 255, 255, 0.72); margin-bottom: 8px; }

	.chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
	.chip { padding: 11px 15px; border: 1.5px solid rgba(255, 255, 255, 0.3); border-radius: 12px; background: none; cursor: pointer; font-family: var(--font-heading); font-size: 12.5px; font-weight: 600; color: rgba(255, 255, 255, 0.7); transition: all 0.15s; }
	.chip.sel { border-color: var(--color-green); background: rgba(21, 228, 154, 0.1); color: #fff; }

	.resolved { display: flex; align-items: center; gap: 6px; margin-bottom: 18px; font-family: var(--font-body); font-size: 11px; font-weight: 500; color: rgba(255, 255, 255, 0.72); }
	.resolved svg { flex-shrink: 0; }

	.dates { display: flex; gap: 8px; }
	.field { flex: 1; display: flex; flex-direction: column; gap: 6px; }
	.date-lbl { font-family: var(--font-heading); font-size: 10px; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase; color: rgba(255, 255, 255, 0.6); }
	.date { width: 100%; padding: 13px 12px; border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 12px; background: rgba(255, 255, 255, 0.07); color: #fff; font-family: var(--font-body); font-size: 13px; color-scheme: dark; }
	.date:focus { outline: none; border-color: rgba(255, 255, 255, 0.35); }
	.summary { margin: 10px 0 18px; font-family: var(--font-body); font-size: 11px; font-weight: 600; color: rgba(255, 255, 255, 0.85); }
	.summary.bad { color: var(--color-orange); }

	.gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 18px; }
	.tile { aspect-ratio: 1; border: 1px dashed rgba(255, 255, 255, 0.15); border-radius: 8px; background: var(--color-teal-deep); }

	.formats { display: flex; gap: 8px; margin-bottom: 18px; }
	.fmt { flex: 1; padding: 13px 10px; border: 1.5px solid rgba(255, 255, 255, 0.18); border-radius: 12px; background: none; cursor: pointer; text-align: center; font-family: var(--font-heading); font-size: 13px; font-weight: 700; color: rgba(255, 255, 255, 0.7); transition: all 0.15s; }
	.fmt.sel { border-color: var(--color-green); background: rgba(21, 228, 154, 0.1); color: #fff; }
	.fmt span { display: block; margin-top: 3px; font-family: var(--font-body); font-size: 9px; font-weight: 400; line-height: 1.4; color: rgba(255, 255, 255, 0.6); }

	.btn { width: 100%; height: 52px; border: none; border-radius: 26px; background: var(--gradient-brand); color: var(--color-teal); font-family: var(--font-heading); font-size: 14px; font-weight: 700; cursor: pointer; }
	.btn:disabled { opacity: 0.45; cursor: default; }
	.btn:not(:disabled):active { opacity: 0.85; }
	.btn-cancel { width: 100%; height: 48px; margin-top: 6px; border: none; background: none; color: rgba(255, 255, 255, 0.6); font-family: var(--font-heading); font-size: 13px; font-weight: 600; cursor: pointer; }
	.btn-cancel:active { color: rgba(255, 255, 255, 0.9); }
</style>
