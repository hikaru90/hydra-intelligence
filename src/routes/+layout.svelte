<script lang="ts">
  import "../app.css";
  import { pb } from "$lib/pocketbase";
  import { goto } from "$app/navigation";
  import * as Sheet from "$lib/components/ui/sheet";

  let { children, data } = $props();

  async function handleLogout() {
    pb.authStore.clear();
    goto("/login");
  }
</script>

<div class="min-h-screen bg-cyan-950 text-emerald-500">
  <nav class="max-container py-4">
    <div class="flex justify-between">
      <div class="flex">
        <div class="flex-shrink-0 flex items-center justify-center bg-midnight rounded-full p-3">
          <img src="/logo.svg" alt="Hydra Intelligence" class="size-12" />
        </div>
      </div>
      <div class="flex items-center">
        {#if data.isAuthenticated}
          <Sheet.Root>
            <Sheet.Trigger>
              <div class="bg-midnight rounded-full p-2 flex items-center justify-center gap-2 size-16">
                <span class="uppercase">{data.user?.email[0]}{data.user?.email[1]}</span>
              </div>
            </Sheet.Trigger>
            <Sheet.Content class="text-emerald-500">
              <Sheet.Header>
                <Sheet.Title class="mt-2">Profil</Sheet.Title>
                <Sheet.Description>
                  <button
                    on:click={handleLogout}
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Ausloggen
                  </button>
                </Sheet.Description>
              </Sheet.Header>
            </Sheet.Content>
          </Sheet.Root>
        {:else}
          <a
            href="/login"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </a>
          <a
            href="/register"
            class="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Register
          </a>
        {/if}
      </div>
    </div>
  </nav>

  <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    {@render children()}
  </main>
</div>

<style>
  @reference "tailwindcss";
  :global(.max-container) {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }
</style>
