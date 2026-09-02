<script lang="ts">
	import BottomSheet from '$lib/components/BottomSheet.svelte';
	import { m } from '$src/paraglide/messages';

	interface Props {
		open?: boolean;
		onsubmit?: (email: string) => void;
		onclose?: () => void;
	}

	let { open = $bindable(false), onsubmit, onclose }: Props = $props();

	let email = $state('');
	let sending = $state(false);

	$effect(() => {
		if (open) {
			email = '';
			sending = false;
		}
	});

	function cancel() {
		open = false;
		onclose?.();
	}
	function submit(e: Event) {
		e.preventDefault();
		if (!email || sending) return;
		sending = true;
		onsubmit?.(email);
	}
</script>

<BottomSheet bind:open onclose={cancel} label={m.forgotPassword()}>
	<div class="title">{m.forgotPassword()}</div>
	<p class="desc">{m.forgotPasswordDescription()}</p>

	<form onsubmit={submit}>
		<label class="sr-only" for="reset-email">{m.email()}</label>
		<input
			id="reset-email"
			type="email"
			autocomplete="email"
			class="input"
			placeholder={m.email()}
			bind:value={email}
		/>

		<button class="btn" disabled={!email || sending}>
			{sending ? '…' : m.resetPassword()}
		</button>
	</form>
	<button class="btn-cancel" onclick={cancel}>Cancel</button>
</BottomSheet>

<style>
	.title {
		font-family: var(--font-heading);
		font-size: 16px;
		font-weight: 700;
		color: #fff;
		margin-bottom: 8px;
	}
	.desc {
		font-family: var(--font-body);
		font-size: 13px;
		line-height: 1.5;
		color: rgba(255, 255, 255, 0.72);
		margin: 0 0 20px;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* Same light capsule as the login/register fields — this sheet is a
	   detour from the login form, not a different surface. */
	.input {
		width: 100%;
		height: 56px;
		margin-bottom: 12px;
		padding: 0 24px;
		border: 1px solid transparent;
		border-radius: 28px;
		background: #f2fbfd;
		color: var(--color-teal);
		font-family: var(--font-body);
		font-size: 16px;
	}
	.input::placeholder {
		color: rgba(17, 57, 75, 0.45);
	}
	.input:focus {
		outline: none;
		border-color: var(--color-green);
		box-shadow: 0 0 0 3px rgba(21, 228, 154, 0.25);
	}

	.btn {
		width: 100%;
		height: 52px;
		border: none;
		border-radius: 26px;
		background: var(--gradient-brand);
		box-shadow: var(--shadow-fab);
		color: var(--color-teal);
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: 700;
		cursor: pointer;
	}
	.btn:disabled {
		opacity: 0.45;
		cursor: default;
	}
	.btn:not(:disabled):active {
		opacity: 0.85;
	}
	.btn-cancel {
		width: 100%;
		height: 48px;
		margin-top: 6px;
		border: none;
		background: none;
		color: rgba(255, 255, 255, 0.6);
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
	}
	.btn-cancel:active {
		color: rgba(255, 255, 255, 0.9);
	}
</style>
