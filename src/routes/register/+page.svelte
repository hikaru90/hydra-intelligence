<script lang="ts">
  import { m } from "$src/paraglide/messages";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { formSchema, type FormSchema } from "./schema";
  import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import { goto } from "$app/navigation";
  import { authClient } from "$lib/auth-client";

  let className: string | undefined = undefined;
  export { className as class };
  export let data: SuperValidated<Infer<FormSchema>>;

  let signingUp = false;

  const form = superForm(data, {
    resetForm: false,
    validators: zodClient(formSchema),
    dataType: "json",
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
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

<div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-emerald-500">
        {m.createAccount()}
      </h2>
    </div>
    <form method="POST" use:enhance action="/register?/register" class={className} on:submit={handleSubmit}>
      <Form.Field {form} name="firstName">
        <Form.Control let:attrs>
          <Form.Label>{m.firstName()}</Form.Label>
          <Input {...attrs} bind:value={$formData.firstName} />
        </Form.Control>
        <!-- <Form.Description>This is your public display name.</Form.Description> -->
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="lastName">
        <Form.Control let:attrs>
          <Form.Label>{m.lastName()}</Form.Label>
          <Input {...attrs} bind:value={$formData.lastName} />
        </Form.Control>
        <!-- <Form.Description>This is your public display name.</Form.Description> -->
        <Form.FieldErrors />
      </Form.Field>
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
        <!-- <Form.Description>This is your public display name.</Form.Description> -->
        <Form.FieldErrors />
      </Form.Field>
      <div class="flex items-center justify-between">
        <a href="/login" class="text-sm hover:underline"
          >{m.switchToLogin()}</a
        >
        <Form.Button class="bg-primary text-muted" disabled={signingUp}>{m.register()}</Form.Button>
      </div>
    </form>
  </div>
</div>
