<script lang="ts">
  import "../app.css";
  import Navbar from "$lib/components/Navbar.svelte";
  import { page } from '$app/state';
  import { onNavigate } from '$app/navigation';
  import { locales, localizeHref } from '$src/paraglide/runtime';
  import { Toaster } from "$lib/components/ui/sonner";
  import { user } from '$lib/stores/auth';
  let { children, data } = $props();

  user.set(data.user);

  // Lets the login screen morph into the header's small brand mark instead
  // of hard-cutting between pages (both carry view-transition-name:
  // brand-mark). No-ops in browsers without the View Transition API.
  onNavigate((navigation) => {
    if (!document.startViewTransition) return;
    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });

  // Cerberus OS app screens (dashboard, buoy detail, login) ship their own
  // full-screen layout and header — the global Navbar is only shown on the
  // remaining pages.
  const isAppScreen = $derived(
    page.url.pathname === '/' || page.url.pathname.startsWith('/buoy/') || page.url.pathname === '/login'
  );
</script>

<div style="display:none">
  {#each locales as locale}
    <a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
  {/each}
</div>
{#if isAppScreen}
  {@render children()}
{:else}
  <div class="min-h-screen bg-cyan-950 text-emerald-500">
    <Navbar {data} class="absolute top-4 left-0 w-full z-10" />

    <main>
      {@render children()}
    </main>
  </div>
{/if}

<Toaster />

<style>
  @reference "tailwindcss";
  :global(.max-container) {
    @apply max-w-7xl px-4 md:mx-auto;
  }
</style>
