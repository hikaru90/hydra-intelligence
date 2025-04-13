<script lang="ts">
  import { pb } from "$lib/pocketbase";
  import { m } from "$src/paraglide/messages";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { formSchema, type FormSchema } from "./schema";
  import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";

  let className: string | undefined = undefined;
  export { className as class };
  export let data: SuperValidated<Infer<FormSchema>>;

  const form = superForm(data, {
    resetForm: false,
    validators: zodClient(formSchema),
    dataType: "json",
    onResult: ({ result }) => {
      console.log("result", result);
      if (result.type === "failure") toast.error(m.error());
      if (result.type === "success") {
        toast.success(m.success());
      }
    },
  });

  const { form: formData, errors, enhance, delayed, message, constraints, reset } = form;
  console.log("form", form);
</script>

<div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-emerald-500">
        {m.createAccount()}
      </h2>
    </div>
    <form method="POST" use:enhance class={className}>
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
        <a href="/app/auth/login" class="text-sm hover:underline"
          >{m.switchToLogin()}</a
        >
        <Form.Button class="bg-primary text-muted">{m.register()}</Form.Button>
      </div>
    </form>
  </div>
</div>
