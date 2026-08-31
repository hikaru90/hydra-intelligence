<script lang="ts">
	import type { DeploymentType } from '$lib/types';
	import { SUBJECT_COPY } from '$lib/config';
	import BottomSheet from '$lib/components/BottomSheet.svelte';

	interface Props {
		open?: boolean;
		/** Suggested next name, e.g. "HYDRA 5". */
		suggestedName?: string;
		onadd: (payload: {
			name: string;
			deployment: DeploymentType;
			subject: string;
			location: string;
		}) => void;
		onclose?: () => void;
	}

	let { open = $bindable(false), suggestedName = '', onadd, onclose }: Props = $props();

	let name = $state('');
	let deployment = $state<DeploymentType>('seaweed');
	let subject = $state('');
	let location = $state('');

	$effect(() => {
		if (open) {
			name = suggestedName;
			deployment = 'seaweed';
			subject = '';
			location = '';
		}
	});

	const copy = $derived(SUBJECT_COPY[deployment]);

	type Option = { key: DeploymentType; label: string; path: string };
	const options: Option[] = [
		{ key: 'seaweed', label: 'Seaweed cultivation', path: 'M12 22c0-4-3-6-3-10a3 3 0 0 1 6 0c0 4-3 6-3 10Z M12 12c-2-1-3-3-3-5 M12 12c2-1 3-3 3-5' },
		{ key: 'shellfish', label: 'Shellfish farm', path: 'M12 20 3 9a9 9 0 0 1 18 0Z M12 20 8 9M12 20l4-11M12 20V9' },
		{ key: 'fish', label: 'Fish farm', path: 'M2 12s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5Z M18 9c2 1 4 3 4 3s-2 2-4 3' },
		{ key: 'restoration', label: 'Restoration site', path: 'M12 22V8 M12 8c0-3 2-5 5-5-.5 3-2 5-5 5Z M12 11c0-3-2-5-5-5 .5 3 2 5 5 5Z' },
		{ key: 'research', label: 'Research / baseline', path: 'M9 3v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3 M8 3h8' },
		{ key: 'other', label: 'Other', path: 'M12 8v.01M12 11v5' }
	];

	function add() {
		onadd({ name: name.trim(), deployment, subject: subject.trim(), location: location.trim() });
		open = false;
	}
	function cancel() {
		open = false;
		onclose?.();
	}
</script>

<BottomSheet bind:open onclose={cancel} label="Add new buoy">
	<div class="title">Add New Buoy</div>
	<div class="meta">Battery and last check-in will be filled automatically</div>

	<div class="label">Name</div>
	<input class="input" type="text" bind:value={name} placeholder="HYDRA 5" />

	<div class="label">Deployment Type</div>
	<div class="grid">
		{#each options as opt (opt.key)}
			<button class="opt" class:sel={deployment === opt.key} onclick={() => (deployment = opt.key)}>
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					{#if opt.key === 'other'}<circle cx="12" cy="12" r="9" />{/if}
					<path d={opt.path} />
				</svg>
				<span>{opt.label}</span>
			</button>
		{/each}
	</div>

	<div class="label">{copy.label}</div>
	<div class="hint">{copy.hint}</div>
	<input class="input" type="text" bind:value={subject} placeholder={copy.placeholder} />

	<div class="label">Location Description</div>
	<input class="input" type="text" bind:value={location} placeholder="e.g. 20 m from pier" />

	<button class="btn" onclick={add}>Add Buoy</button>
	<button class="btn-cancel" onclick={cancel}>Cancel</button>
</BottomSheet>

<style>
	.title { font-family: var(--font-heading); font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 6px; }
	.meta { font-size: 11px; color: rgba(255, 255, 255, 0.7); margin-bottom: 14px; }
	.label { font-family: var(--font-heading); font-size: 10px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: rgba(255, 255, 255, 0.72); margin-bottom: 8px; }
	.hint { margin: -4px 0 8px; font-family: var(--font-body); font-size: 10px; font-style: italic; color: rgba(255, 255, 255, 0.5); }

	.input { width: 100%; margin-bottom: 12px; padding: 14px; border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 12px; background: rgba(255, 255, 255, 0.07); color: #fff; font-family: var(--font-body); font-size: 16px; }
	.input::placeholder { color: rgba(255, 255, 255, 0.45); }
	.input:focus { outline: none; border-color: rgba(255, 255, 255, 0.35); }

	.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
	.opt { display: flex; align-items: center; gap: 9px; padding: 11px 12px; border: 1.5px solid rgba(255, 255, 255, 0.18); border-radius: 12px; background: none; cursor: pointer; text-align: left; transition: all 0.15s; }
	.opt.sel { border-color: var(--color-green); background: rgba(21, 228, 154, 0.1); }
	.opt svg { flex-shrink: 0; stroke: rgba(255, 255, 255, 0.85); }
	.opt.sel svg { stroke: var(--color-green); }
	.opt span { font-family: var(--font-heading); font-size: 11.5px; font-weight: 600; line-height: 1.15; color: rgba(255, 255, 255, 0.85); }
	.opt.sel span { color: #fff; }

	.btn { width: 100%; height: 52px; margin-top: 4px; border: none; border-radius: 26px; background: var(--gradient-brand); color: var(--color-teal); font-family: var(--font-heading); font-size: 14px; font-weight: 700; cursor: pointer; }
	.btn:active { opacity: 0.85; }
	.btn-cancel { width: 100%; height: 48px; margin-top: 6px; border: none; background: none; color: rgba(255, 255, 255, 0.6); font-family: var(--font-heading); font-size: 13px; font-weight: 600; cursor: pointer; }
	.btn-cancel:active { color: rgba(255, 255, 255, 0.9); }
</style>
