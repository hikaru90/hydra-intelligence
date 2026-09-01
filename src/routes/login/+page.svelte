<script lang="ts">
  import { formSchema, type FormSchema } from "./schema";
  import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import { m } from "$src/paraglide/messages";
  import { toast } from "svelte-sonner";
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import Check from "lucide-svelte/icons/check";
  import { authClient } from "$lib/auth-client";

  export let data: SuperValidated<Infer<FormSchema>> & { redirectTo?: string | null };

  let resetPasswordDialogOpen = false;
  let signingIn = false;

  const form = superForm(data, {
    resetForm: false,
    validators: zod4Client(formSchema),
    dataType: "json",
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (import.meta.env.DEV) {
      // No working Postgres connection in local dev (see .env) — the login
      // button just goes straight through so the transition/UI can still
      // be tested without real credentials.
      goto('/');
      return;
    }
    if (!$formData.email || !$formData.password) return;
    signingIn = true;
    const { error } = await authClient.signIn.email({
      email: $formData.email,
      password: $formData.password,
    });
    signingIn = false;
    if (error) {
      const isUnverified = error.status === 403 || error.message?.toLowerCase().includes('verify');
      toast.error(isUnverified ? 'Please verify your email before signing in. Check your inbox for the verification link.' : (error.message ?? m.error()));
      return;
    }
    goto(data.redirectTo ?? "/", { invalidateAll: true });
  }

  const resetPassword = async () => {
    resetPasswordDialogOpen = false;
    // TODO: better-auth forgot password flow
    toast.success(m.forgotPasswordSuccess());
  };

  const { form: formData, errors, enhance } = form;
</script>

<!-- Deliberately built on the dashboard's skeleton (FleetHeader -> MapPanel ->
     light content list), so signing in reads as the same app continuing rather
     than a different one handing over: same dark header bar with the same brand
     lockup, a visual panel in the slot the map occupies, then content on the
     same light gradient. -->
<div class="screen">
  <header class="s1-header">
    <div class="brand" style="view-transition-name: brand-mark">
      <img class="logo" src="/cerberus-mark-dark.svg" alt="" aria-hidden="true" />
      <span class="brand-name"><span class="brand-primary">Cerberus Blue</span> <span class="brand-suffix">OS</span></span>
    </div>
  </header>

  <div class="photo-panel" aria-hidden="true"></div>

  <div class="body">
    <div class="section-label">
      <span class="section-name">{m.loginToAccount()}</span>
      <span class="section-line"></span>
    </div>

    <form method="POST" use:enhance action="/login?/login" onsubmit={handleSubmit} class="form">
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
        autocomplete="current-password"
        class="input"
        placeholder={m.password()}
        bind:value={$formData.password}
      />
      {#if $errors.password}<span class="err">{$errors.password}</span>{/if}

      <button class="btn" disabled={signingIn}>
        {signingIn ? '…' : m.login()}
      </button>

      <!-- Both secondary actions live together, well clear of the primary
           button — "Forgot password?" used to sit directly above it, close
           enough to hit by accident when reaching for sign-in. -->
      <div class="secondary">
        <button type="button" class="link" onclick={() => (resetPasswordDialogOpen = true)}>
          {m.forgotPassword()}
        </button>
        <span class="dot" aria-hidden="true"></span>
        <a class="link" href="/register">{m.switchToRegister()}</a>
      </div>
    </form>
  </div>
</div>

<Dialog.Root bind:open={resetPasswordDialogOpen} preventScroll={false}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title class="mb-10 leading-tight">{m.forgotPassword()}</Dialog.Title>
      <Dialog.Description>
        {m.forgotPasswordDescription()}
        <div class="mt-4 flex justify-end">
          <Button on:click={resetPassword} class="flex items-center gap-3 bg-muted-dark"
            >{m.forgotPassword()}
            <Check class="text-needs-background" /></Button
          >
        </div>
      </Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>

<style>
  /* Same shell as the dashboard route, but kept on the deep teal the app
     uses for its sheets rather than the dashboard's light list ground —
     the photo needs to fade into something, and a hard photo-to-white edge
     looked like a seam. */
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

  /* Identical to FleetHeader's bar and brand lockup (26px mark, 10px gap,
     16px 700-weight heading) so the two headers are interchangeable. */
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }
  .brand-primary {
    font-family: var(--font-heading);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: #fff;
  }
  .brand-suffix {
    font-family: var(--font-heading);
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.02em;
    color: rgba(255, 255, 255, 0.55);
  }

  /* Sits roughly where the dashboard's MapPanel does, but taller and fading
     out at the bottom instead of ending on a hard edge — a photograph cut
     off mid-frame reads as a seam in a way a map panel doesn't. */
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
    /* A light tuck into the photo's faded tail (not a deep pull like
       before) — enough to feel continuous with the fade, but with real
       clearance from the buoy itself so the fields don't crowd it. */
    margin-top: -12px;
    padding: 20px 22px calc(24px + env(safe-area-inset-bottom));
  }

  /* Same treatment as BuoyList's site headings. */
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

  /* Light capsules on the deep teal — same fully-rounded object language as
     the buoy cards, inverted for the dark ground (and matching how the app's
     bottom sheets put light fields on teal). Sky blue instead of plain white
     ties them to Screen 1's own background gradient, which fades into this
     same hue at the bottom — lightened further toward white so the fields
     stay a clearly distinct, airy surface rather than a saturated block. */
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

  /* Same gradient capsule as the dashboard's add-buoy FAB. */
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
  /* Sits well below the primary button, with both links given a full 44px
     touch target so neither can be clipped by a stray reach for sign-in. */
  .secondary {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    margin-top: 28px;
  }
  .link {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 0 4px;
    border: none;
    background: none;
    font-family: var(--font-heading);
    font-size: 13px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.62);
    text-decoration: none;
    cursor: pointer;
  }
  .link:active {
    color: #fff;
  }
  .dot {
    width: 3px;
    height: 3px;
    flex-shrink: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.28);
  }
</style>
