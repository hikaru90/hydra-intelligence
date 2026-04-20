<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { formSchema, type FormSchema } from "./schema";
  import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { m } from "$src/paraglide/messages";
  import { toast } from "svelte-sonner";
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import Check from "lucide-svelte/icons/check";
  import { authClient } from "$lib/auth-client";

  let className: string | undefined = undefined;
  export { className as class };
  export let data: SuperValidated<Infer<FormSchema>> & { redirectTo?: string | null };

  let resetPasswordDialogOpen = false;
  let signingIn = false;

  const form = superForm(data, {
    resetForm: false,
    validators: zodClient(formSchema),
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

  const { form: formData, errors, enhance, delayed, message, constraints, reset } = form;
</script>

<div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-emerald-500">
        {m.loginToAccount()}
      </h2>
    </div>
    <form method="POST" use:enhance action="/login?/login" class={className} on:submit={handleSubmit}>
      <Form.Field {form} name="email">
        <Form.Control let:attrs>
          <Form.Label>{m.email()}</Form.Label>
          <Input {...attrs} bind:value={$formData.email} type="email" />
        </Form.Control>
        <!-- <Form.Description>This is your public display name.</Form.Description> -->
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="password">
        <Form.Control let:attrs>
          <Form.Label>{m.password()}</Form.Label>
          <Input {...attrs} bind:value={$formData.password} type="password" />
        </Form.Control>
        <Form.Description
          ><a
            role="button"
            tabindex="0"
            on:click={() => (resetPasswordDialogOpen = true)}
            class="text-sm text-muted-foreground hover:underline">{m.forgotPassword()}</a
          ></Form.Description
        >
        <Form.FieldErrors />
      </Form.Field>

      <div class="flex items-center justify-between">
        <a href="/register" class="text-sm hover:underline">{m.switchToRegister()}</a>
        <Form.Button class="bg-primary text-muted" disabled={signingIn}>{m.login()}</Form.Button>
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
