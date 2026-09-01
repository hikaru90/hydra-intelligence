<script lang="ts">
	import type { Buoy } from '$lib/types';
	import BottomSheet from '$lib/components/BottomSheet.svelte';
	import StatusDot from '$lib/components/StatusDot.svelte';

	interface Props {
		open?: boolean;
		buoys: Buoy[];
		/** Pre-selected target (the buoy the check-in was launched from). */
		initialBuoyId: string;
		/** GPS-nearest buoy, tagged in the picker. */
		nearestId?: string;
		/** Latest observation for a buoy, for the edit-last flow. */
		latestFor?: (buoyId: string) => { note: string; when: string } | null;
		onsave: (payload: { buoyId: string; note: string; editing: boolean }) => void;
		onclose?: () => void;
	}

	let { open = $bindable(false), buoys, initialBuoyId, nearestId, latestFor, onsave, onclose }: Props =
		$props();

	let target = $state('');
	let editing = $state(false);
	let note = $state('');
	let hasPhoto = $state(false);
	let pickerOpen = $state(false);

	// Reset to a clean "new check-in" whenever the sheet opens.
	$effect(() => {
		if (open) {
			target = initialBuoyId;
			editing = false;
			note = '';
			hasPhoto = false;
			pickerOpen = false;
		}
	});

	const targetBuoy = $derived(buoys.find((b) => b.id === target) ?? buoys[0]);
	const latest = $derived(latestFor?.(target) ?? null);
	const nowLabel = $derived(
		new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) +
			' · ' +
			new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
	);

	function selectTarget(id: string) {
		target = id;
		pickerOpen = false;
	}
	function togglePicker() {
		if (!editing) pickerOpen = !pickerOpen;
	}
	function startEdit() {
		editing = true;
		note = latest?.note ?? '';
		hasPhoto = true;
		pickerOpen = false;
	}
	function save() {
		onsave({ buoyId: target, note, editing });
		open = false;
	}
	function cancel() {
		open = false;
		onclose?.();
	}
</script>

<BottomSheet bind:open onclose={cancel} label="Check in">
	<div class="title">{editing ? 'Edit Check-In' : 'New Check-In'}</div>
	<div class="meta">{editing ? 'Editing the last check-in' : nowLabel}</div>

	<div class="label">Buoy</div>
	<div class="ci-buoy" class:locked={editing} role="button" tabindex={editing ? -1 : 0} onclick={togglePicker} class:open={pickerOpen}>
		<StatusDot status={targetBuoy.status} variant="mini" />
		<div class="ci-info">
			<div class="ci-name">
				<span>{targetBuoy.name}</span>
				{#if target === nearestId}
					<span class="tag">{@render pin(9)} nearest to you</span>
				{/if}
			</div>
			<div class="ci-loc">{@render pin(10)}<span>{targetBuoy.locationDescription}</span></div>
		</div>
		{#if !editing}
			<div class="change">
				Change
				<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><polyline points="6,9 12,15 18,9" /></svg>
			</div>
		{/if}
	</div>

	{#if pickerOpen && !editing}
		<div class="picker" role="listbox">
			{#each buoys as b (b.id)}
				<button class="pick" class:sel={b.id === target} role="option" aria-selected={b.id === target} onclick={() => selectTarget(b.id)}>
					<StatusDot status={b.status} variant="mini" />
					<div class="pick-info">
						<div class="pick-name">
							<span>{b.name}</span>
							{#if b.id === nearestId}<span class="tag">{@render pin(9)} nearest</span>{/if}
						</div>
						<div class="pick-loc">{@render pin(10)}<span>{b.locationDescription}</span></div>
					</div>
					{#if b.id === target}
						<span class="check"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg></span>
					{/if}
				</button>
			{/each}
		</div>
	{/if}

	<div class="gps">
		<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
		<span>Location captured automatically</span>
	</div>

	<div class="label">Photo</div>
	<button class="photo" class:has={hasPhoto} onclick={() => (hasPhoto = !hasPhoto)}>
		<div class="photo-ph">
			<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
			<span>{hasPhoto ? 'Photo attached — tap to replace' : 'Take Photo'}</span>
		</div>
	</button>

	<div class="label">Note</div>
	<textarea class="note" bind:value={note} placeholder="Buoy condition, fouling, observations..."></textarea>

	<button class="btn" onclick={save}>{editing ? 'Update Check-In' : 'Save Check-In'}</button>
	<button class="btn-cancel" onclick={cancel}>Cancel</button>

	{#if !editing && latest}
		<div class="edit-block">
			<div class="edit-prompt">Made a mistake?</div>
			<button class="edit-action" onclick={startEdit}>
				<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
				<span>Edit last check-in</span>
				<span class="edit-when">· {latest.when}</span>
			</button>
		</div>
	{/if}
</BottomSheet>

{#snippet pin(size: number)}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
{/snippet}

<style>
	.title { font-family: var(--font-heading); font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 6px; }
	.meta { font-size: 11px; color: rgba(255, 255, 255, 0.7); margin-bottom: 14px; }
	.label { font-family: var(--font-heading); font-size: 10px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: rgba(255, 255, 255, 0.72); margin-bottom: 8px; }

	.ci-buoy { display: flex; align-items: center; gap: 11px; padding: 12px 13px; margin-bottom: 8px; border: 1.5px solid rgba(255, 255, 255, 0.14); border-radius: 14px; background: rgba(255, 255, 255, 0.07); cursor: pointer; transition: border-color 0.15s; }
	.ci-buoy:active { border-color: rgba(255, 255, 255, 0.3); }
	.ci-buoy.locked { cursor: default; border-color: rgba(255, 255, 255, 0.1); }
	.ci-info { flex: 1; min-width: 0; }
	.ci-name { display: flex; align-items: center; gap: 8px; min-width: 0; font-family: var(--font-heading); font-size: 14px; font-weight: 700; color: #fff; line-height: 1.1; }
	.ci-name > span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
	.ci-loc { display: flex; align-items: center; gap: 5px; min-width: 0; margin-top: 3px; font-size: 11px; color: rgba(255, 255, 255, 0.6); }
	.ci-loc :global(svg) { flex-shrink: 0; }
	.ci-loc span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
	.change { display: flex; align-items: center; gap: 3px; flex-shrink: 0; font-family: var(--font-heading); font-size: 11px; font-weight: 600; color: rgba(255, 255, 255, 0.55); }
	.change svg { transition: transform 0.2s; }
	.ci-buoy.open .change svg { transform: rotate(180deg); }

	.tag { display: inline-flex; align-items: center; gap: 3px; flex-shrink: 0; padding: 2px 7px; border-radius: 8px; background: rgba(21, 228, 154, 0.14); color: var(--color-green); font-family: var(--font-body); font-size: 9px; font-weight: 600; letter-spacing: 0.02em; white-space: nowrap; }

	.picker { overflow: hidden; margin-bottom: 8px; border-radius: 14px; background: rgba(0, 0, 0, 0.16); }
	.pick { display: flex; align-items: center; gap: 11px; width: 100%; padding: 11px 13px; border: none; border-bottom: 1px solid rgba(255, 255, 255, 0.06); background: none; cursor: pointer; text-align: left; }
	.pick:last-child { border-bottom: none; }
	.pick.sel { background: rgba(21, 228, 154, 0.08); }
	.pick-info { flex: 1; min-width: 0; }
	.pick-name { display: flex; align-items: center; gap: 7px; min-width: 0; font-family: var(--font-heading); font-size: 13px; font-weight: 700; color: #fff; line-height: 1.1; }
	.pick-name > span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
	.pick-loc { display: flex; align-items: center; gap: 5px; min-width: 0; margin-top: 2px; font-size: 10.5px; color: rgba(255, 255, 255, 0.55); }
	.pick-loc :global(svg) { flex-shrink: 0; }
	.pick-loc span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
	.check { flex-shrink: 0; display: flex; color: var(--color-green); }

	.gps { display: flex; align-items: center; gap: 5px; margin-bottom: 18px; font-size: 10px; font-weight: 500; color: rgba(255, 255, 255, 0.75); }
	.gps svg { stroke: var(--color-green); }

	.photo { display: flex; align-items: center; justify-content: center; width: 100%; height: 96px; margin-bottom: 14px; border: 1.5px dashed rgba(255, 255, 255, 0.2); border-radius: 12px; background: var(--color-teal-deep); cursor: pointer; }
	.photo.has { border-style: solid; border-color: rgba(21, 228, 154, 0.55); background: #0a2530; }
	.photo-ph { display: flex; flex-direction: column; align-items: center; gap: 5px; color: rgba(255, 255, 255, 0.75); }
	.photo-ph span { font-family: var(--font-heading); font-size: 11px; font-weight: 600; }

	.note { width: 100%; height: 80px; margin-bottom: 14px; padding: 12px; resize: none; border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 12px; background: rgba(255, 255, 255, 0.07); color: #fff; font-family: var(--font-body); font-size: 16px; }
	.note::placeholder { color: rgba(255, 255, 255, 0.45); }
	.note:focus { outline: none; border-color: var(--color-green); box-shadow: 0 0 0 3px rgba(21, 228, 154, 0.25); }

	.btn { width: 100%; height: 52px; border: none; border-radius: 26px; background: var(--gradient-brand); color: var(--color-teal); font-family: var(--font-heading); font-size: 14px; font-weight: 700; cursor: pointer; }
	.btn:active { opacity: 0.85; }
	.btn-cancel { width: 100%; height: 48px; margin-top: 6px; border: none; background: none; color: rgba(255, 255, 255, 0.6); font-family: var(--font-heading); font-size: 13px; font-weight: 600; cursor: pointer; }
	.btn-cancel:active { color: rgba(255, 255, 255, 0.9); }

	.edit-block { margin-top: 16px; text-align: center; }
	.edit-prompt { margin-bottom: 5px; font-size: 11px; font-weight: 500; color: rgba(255, 255, 255, 0.5); }
	.edit-action { display: inline-flex; align-items: center; gap: 7px; padding: 6px 8px; border: none; background: none; cursor: pointer; font-family: var(--font-heading); font-size: 13px; font-weight: 600; color: var(--color-green); white-space: nowrap; }
	.edit-action:active { opacity: 0.6; }
	.edit-when { color: rgba(21, 228, 154, 0.65); font-weight: 500; }
</style>
