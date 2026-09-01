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

    // The drain-into-the-corner wipe (app.css) reads as "leaving the auth
    // flow into the app" — it's only correct when the destination is the
    // dashboard. It used to fire on every navigation away from /login,
    // which meant clicking through to /register also played the "exiting
    // into the app" animation, even though that's just a lateral move
    // between two sibling auth screens.
    const isLoginExit = fromPath === '/login' && toPath === '/';
    // Login <-> register share the same header/photo/body skeleton, so a
    // quick plain cross-fade (no drain, no slide) is enough to read as
    // "same screen, different form" rather than a scene change.
    const isAuthSwitch =
      (fromPath === '/login' && toPath === '/register') ||
      (fromPath === '/register' && toPath === '/login');
    // Dashboard <-> buoy detail reads as drilling into / backing out of a
    // buoy, so it gets a native-feeling push/pop slide instead of the flat
    // default cross-fade. (Switching buoys *within* the detail screen is
    // client-side state, not a route change, so it never hits this.)
    const isDrillIn = fromPath === '/' && !!toPath?.startsWith('/buoy/');
    const isBackOut = !!fromPath?.startsWith('/buoy/') && toPath === '/';

    const cls = isLoginExit
      ? 'vt-water'
      : isAuthSwitch
        ? 'vt-auth-switch'
        : isDrillIn
          ? 'vt-forward'
          : isBackOut
            ? 'vt-back'
            : null;
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

  // Cerberus OS app screens (dashboard, buoy detail, login, register) ship
  // their own full-screen layout and header — the global Navbar is only
  // shown on the remaining pages.
  const isAppScreen = $derived(
    page.url.pathname === '/' ||
      page.url.pathname.startsWith('/buoy/') ||
      page.url.pathname === '/login' ||
      page.url.pathname === '/register'
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
