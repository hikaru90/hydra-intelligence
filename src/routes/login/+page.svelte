<script lang="ts">
    import { redirect } from '@sveltejs/kit';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
    import { m } from '$src/paraglide/messages';
	import SuperDebug from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Check } from 'lucide-svelte/icons';
	import { pb } from "$lib/pocketbase";

	let className: string | undefined = undefined;
	export { className as class };
	export let data: SuperValidated<Infer<FormSchema>>;

	let resetPassordDialogOpen = false;

	const form = superForm(data, {
		resetForm: false,
		validators: zodClient(formSchema),
		dataType: "json",
		onResult: ({ result }) => {
			console.log('result', result);
			if (result.type === 'failure') toast.error(m.error());
			if (result.type === 'success') {
				// toast.success($t('default.page.login.toasts.success'));
			}
		}
	});

	const resetPassword = async () => {
		resetPassordDialogOpen = false;
		await pb.collection('users').requestPasswordReset($formData.email);
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
        <form method="POST" use:enhance class={className}>
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
                    ><a role="button"
                        tabindex="0"
                        on:click={() => (resetPassordDialogOpen = true)}
                        class="text-sm text-muted-foreground hover:underline">{m.forgotPassword()}</a
                    ></Form.Description
                >
                <Form.FieldErrors />
            </Form.Field>
        
            <div class="flex items-center justify-between">
                <a href="/app/auth/register" class="text-sm hover:underline"
                    >{m.switchToRegister()}</a
                >
                <Form.Button class="bg-primary text-muted">{m.login()}</Form.Button>
            </div>
        </form>
    </div>
</div> 

<Dialog.Root bind:open={resetPassordDialogOpen} preventScroll={false}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="mb-10 leading-tight"
				>{m.forgotPassword()}</Dialog.Title
			>
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