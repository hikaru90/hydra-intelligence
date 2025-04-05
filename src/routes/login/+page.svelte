<script lang="ts">
    import { pb } from '$lib/pocketbase';
    import { goto } from '$app/navigation';
  import { m } from '$src/paraglide/messages';

    let email = '';
    let password = '';
    let error = '';

    async function handleSubmit() {
        try {
            await pb.collection('users').authWithPassword(email, password);
            goto('/');
        } catch (err) {
            error = 'Invalid email or password';
        }
    }
</script>

<div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
        <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-emerald-500">
                {m.loginToAccount()}
            </h2>
        </div>
        <form class="mt-8 space-y-6" on:submit|preventDefault={handleSubmit}>
            <div class="rounded-md shadow-sm -space-y-px">
                <div>
                    <label for="email" class="sr-only">{m.email()}</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        bind:value={email}
                        class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Email address"
                    />
                </div>
                <div>
                    <label for="password" class="sr-only">{m.password()}</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        bind:value={password}
                        class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                    />
                </div>
            </div>

            {#if error}
                <p class="text-red-500 text-sm text-center">{error}</p>
            {/if}

            <a href="/register" class="text-center text-sm text-white/60 hover:text-white  mb-6 block">
                {m.noAccount()}
            </a>
            <div>
                <button
                    type="submit"
                    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                {m.login()}
                </button>
            </div>
        </form>
    </div>
</div> 