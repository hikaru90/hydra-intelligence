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

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;
    const fromPath = navigation.from?.url.pathname;
    const toPath = navigation.to?.url.pathname;

    // The drain-into-the-corner wipe (app.css) is reserved for leaving
    // /login — every other navigation keeps the plain cross-fade so it
    // doesn't get old fast.
    const isLoginExit = fromPath === '/login';
    // Dashboard <-> buoy detail reads as drilling into / backing out of a
    // buoy, so it gets a native-feeling push/pop slide instead of the flat
    // default cross-fade. (Switching buoys *within* the detail screen is
    // client-side state, not a route change, so it never hits this.)
    const isDrillIn = fromPath === '/' && !!toPath?.startsWith('/buoy/');
    const isBackOut = !!fromPath?.startsWith('/buoy/') && toPath === '/';

    const cls = isLoginExit ? 'vt-water' : isDrillIn ? 'vt-forward' : isBackOut ? 'vt-back' : null;
    if (cls) document.documentElement.classList.add(cls);

    return new Promise((resolve) => {
      const transition = document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
      transition.finished.finally(() => {
        if (cls) document.documentElement.classList.remove(cls);
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
