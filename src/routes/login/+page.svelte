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

<div class="screen">
  <div class="photo-band" aria-hidden="true"></div>
  <div class="content" style="view-transition-name: brand-mark">
    <div class="wordmark-wrap">
      <div class="glow" aria-hidden="true"></div>
      <img class="wordmark" src="/cerberus-wordmark-dark.svg" alt="Cerberus Blue Systems" />
    </div>

    <h1 class="heading">{m.loginToAccount()}</h1>

    <form method="POST" use:enhance action="/login?/login" onsubmit={handleSubmit} class="form">
      <div class="field">
        <label class="label" for="email">{m.email()}</label>
        <input
          id="email"
          name="email"
          type="email"
          autocomplete="email"
          class="input"
          bind:value={$formData.email}
        />
        {#if $errors.email}<span class="err">{$errors.email}</span>{/if}
      </div>

      <div class="field">
        <div class="label-row">
          <label class="label" for="password">{m.password()}</label>
          <button
            type="button"
            class="forgot"
            onclick={() => (resetPasswordDialogOpen = true)}
          >
            {m.forgotPassword()}
          </button>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autocomplete="current-password"
          class="input"
          bind:value={$formData.password}
        />
        {#if $errors.password}<span class="err">{$errors.password}</span>{/if}
      </div>

      <button class="btn" disabled={signingIn}>
        {signingIn ? '…' : m.login()}
      </button>
      <a class="btn-cancel" href="/register">{m.switchToRegister()}</a>

      {#if import.meta.env.DEV}
        <button
          type="button"
          class="dev-bypass"
          onclick={() => goto('/')}
        >
          Dev: weiter ohne echten Login (nur zum Testen des Übergangs)
        </button>
      {/if}
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
  .screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100dvh;
    max-width: 480px;
    margin: 0 auto;
    position: relative;
    padding: 32px 24px;
    /* Matches the wordmark SVG's own background fill exactly, so the logo
       has no visible edge/card around it — the photo band above is capped
       to a fixed height so it never reaches this far down. */
    background: var(--color-teal);
  }
  .photo-band {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 300px;
    z-index: 0;
    /* Real HYDRA-in-water photo for a maritime feel, fading into the
       screen's flat fill so it reads as an accent, not a full backdrop. */
    background:
      linear-gradient(180deg, rgba(9, 43, 58, 0.15) 0%, var(--color-teal) 100%),
      url('/login-bg-hydra.jpg') top center / cover no-repeat;
  }
  .content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 340px;
  }
  .wordmark-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
  }
  .glow {
    position: absolute;
    inset: -30px;
    z-index: 0;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(21, 228, 154, 0.28) 0%, rgba(21, 228, 154, 0) 70%);
    filter: blur(4px);
  }
  .wordmark {
    position: relative;
    z-index: 1;
    width: 200px;
    height: auto;
    display: block;
  }
  .heading {
    align-self: flex-start;
    margin: 0 0 22px;
    font-family: var(--font-heading);
    font-size: 20px;
    font-weight: 700;
    color: #fff;
  }
  .form {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .field {
    display: flex;
    flex-direction: column;
    margin-bottom: 14px;
  }
  .label {
    margin-bottom: 8px;
    font-family: var(--font-heading);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.72);
  }
  .label-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
  }
  .forgot {
    margin-bottom: 8px;
    border: none;
    background: none;
    padding: 0;
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 600;
    color: var(--color-green);
    cursor: pointer;
  }
  .input {
    width: 100%;
    padding: 13px 14px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.07);
    color: #fff;
    font-family: var(--font-body);
    font-size: 13px;
  }
  .input::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }
  .input:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.35);
  }
  .err {
    margin-top: 6px;
    font-size: 11px;
    font-weight: 500;
    color: var(--color-orange);
  }

  .btn {
    width: 100%;
    height: 52px;
    margin-top: 8px;
    border: none;
    border-radius: 26px;
    background: var(--gradient-brand, linear-gradient(135deg, #15e49a, #fbffaa));
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
    opacity: 0.6;
    cursor: default;
  }
  .btn-cancel {
    display: block;
    width: 100%;
    margin-top: 14px;
    padding: 0;
    border: none;
    background: none;
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
    font-family: var(--font-heading);
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
  }
  .btn-cancel:active {
    color: rgba(255, 255, 255, 0.9);
  }

  .dev-bypass {
    display: block;
    width: 100%;
    margin-top: 22px;
    padding: 10px;
    border: 1px dashed rgba(255, 255, 255, 0.25);
    border-radius: 12px;
    background: none;
    text-align: center;
    color: rgba(255, 255, 255, 0.45);
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 600;
    cursor: pointer;
  }
  .dev-bypass:active {
    color: rgba(255, 255, 255, 0.7);
  }
</style>
