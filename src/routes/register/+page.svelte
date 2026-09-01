<script lang="ts">
  import { m } from "$src/paraglide/messages";
  import { formSchema, type FormSchema } from "./schema";
  import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import { goto } from "$app/navigation";
  import { authClient } from "$lib/auth-client";

  export let data: SuperValidated<Infer<FormSchema>>;

  let signingUp = false;

  const form = superForm(data, {
    resetForm: false,
    validators: zod4Client(formSchema),
    dataType: "json",
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (import.meta.env.DEV) {
      // No working Postgres connection in local dev (see .env) — goes
      // straight through so the screen/transition can still be tested
      // without real credentials, matching /login's dev bypass.
      goto('/');
      return;
    }
    if (!$formData.firstName || !$formData.lastName || !$formData.email || !$formData.password) return;
    signingUp = true;
    const { error } = await authClient.signUp.email({
      name: `${$formData.firstName} ${$formData.lastName}`.trim(),
      email: $formData.email,
      password: $formData.password,
    });
    signingUp = false;
    if (error) {
      toast.error(error.message ?? m.error());
      return;
    }
    toast.success(m.success());
    goto("/", { invalidateAll: true });
  }

  const { form: formData, errors, enhance } = form;
</script>

<!-- Same shell as /login (see its comments for why) — this is the other
     half of the same door, so it carries the identical header, photo panel
     and field styling rather than the old generic form layout. -->
<div class="screen">
  <header class="s1-header">
    <div class="brand" style="view-transition-name: brand-mark">
      <img class="logo" src="/cerberus-mark-dark.svg" alt="" aria-hidden="true" />
      <span class="brand-name">Cerberus OS</span>
    </div>
  </header>

  <div class="photo-panel" aria-hidden="true"></div>

  <div class="body">
    <div class="section-label">
      <span class="section-name">{m.createAccount()}</span>
      <span class="section-line"></span>
    </div>

    <form method="POST" use:enhance action="/register?/register" onsubmit={handleSubmit} class="form">
      <div class="row">
        <div class="col">
          <label class="sr-only" for="firstName">{m.firstName()}</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autocomplete="given-name"
            class="input"
            placeholder={m.firstName()}
            bind:value={$formData.firstName}
          />
          {#if $errors.firstName}<span class="err">{$errors.firstName}</span>{/if}
        </div>
        <div class="col">
          <label class="sr-only" for="lastName">{m.lastName()}</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autocomplete="family-name"
            class="input"
            placeholder={m.lastName()}
            bind:value={$formData.lastName}
          />
          {#if $errors.lastName}<span class="err">{$errors.lastName}</span>{/if}
        </div>
      </div>

      <label class="sr-only" for="email">{m.email()}</label>
      <input
        id="email"
        name="email"
        type="email"
        autocomplete="email"
        class="input"
        placeholder={m.email()}
        bind:value={$formData.email}
      />
      {#if $errors.email}<span class="err">{$errors.email}</span>{/if}

      <label class="sr-only" for="password">{m.password()}</label>
      <input
        id="password"
        name="password"
        type="password"
        autocomplete="new-password"
        class="input"
        placeholder={m.password()}
        bind:value={$formData.password}
      />
      {#if $errors.password}<span class="err">{$errors.password}</span>{/if}

      <button class="btn" disabled={signingUp}>
        {signingUp ? '…' : m.register()}
      </button>

      <div class="secondary">
        <a class="link" href="/login">{m.switchToLogin()}</a>
      </div>
    </form>
  </div>
</div>

<style>
  .screen {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    max-width: 480px;
    margin: 0 auto;
    background: var(--color-teal);
    overflow: hidden;
  }

  .s1-header {
    display: flex;
    align-items: center;
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
    font-family: var(--font-heading);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: #fff;
    white-space: nowrap;
  }

  .photo-panel {
    height: 380px;
    flex-shrink: 0;
    background:
      linear-gradient(
        180deg,
        rgba(9, 43, 58, 0.1) 0%,
        rgba(17, 57, 75, 0.15) 45%,
        rgba(17, 57, 75, 0.85) 82%,
        var(--color-teal) 100%
      ),
      url('/login-bg-hydra.jpg') center 30% / cover no-repeat;
  }

  .body {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: -12px;
    padding: 20px 22px calc(24px + env(safe-area-inset-bottom));
  }

  .section-label {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 6px 2px;
    margin-bottom: 12px;
  }
  .section-name {
    font-family: var(--font-heading);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.7);
  }
  .section-line {
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.16);
  }

  .form {
    display: flex;
    flex-direction: column;
  }
  .row {
    display: flex;
    gap: 10px;
  }
  .col {
    flex: 1;
    min-width: 0;
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

  .input {
    width: 100%;
    height: 56px;
    margin-bottom: 10px;
    padding: 0 24px;
    border: 1px solid transparent;
    border-radius: 28px;
    background: #f2fbfd;
    color: var(--color-teal);
    font-family: var(--font-body);
    /* 16px, not smaller — iOS Safari auto-zooms the page on focus for any
       input below 16px, which reads as a jarring "jump" on mobile. */
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
  .err {
    margin: 0 0 10px 24px;
    font-size: 11px;
    font-weight: 600;
    color: var(--color-orange);
  }

  .btn {
    width: 100%;
    height: 56px;
    margin-top: 16px;
    border: none;
    border-radius: 28px;
    background: var(--gradient-brand);
    box-shadow: var(--shadow-fab);
    color: var(--color-teal);
    font-family: var(--font-heading);
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }
  .btn:active {
    opacity: 0.85;
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: default;
  }
  .secondary {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 28px;
  }
  .link {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 0 4px;
    font-family: var(--font-heading);
    font-size: 13px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.62);
    text-decoration: none;
  }
  .link:active {
    color: #fff;
  }
</style>
