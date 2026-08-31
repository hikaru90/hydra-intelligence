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

  // Drives the feDisplacementMap filter (markup below) so the login-exit
  // wipe actually distorts like water instead of just clipping a hard-edged
  // circle. Only `scale` is animated — the noise field itself (baseFrequency)
  // stays fixed. Animating baseFrequency too regenerates the whole noise
  // pattern every frame, which reads as TV static/flicker, not flowing
  // water; a still noise field with a rising-then-falling displacement
  // strength reads as the image melting and settling instead.
  function animateWaterDistortion(durationMs: number) {
    const displacement = document.getElementById('water-displacement');
    if (!(displacement instanceof SVGFEDisplacementMapElement)) return;
    const start = performance.now();
    function step(now: number) {
      const t = Math.min(1, (now - start) / durationMs);
      const envelope = Math.sin(t * Math.PI); // 0 -> 1 -> 0 across the duration
      displacement!.setAttribute('scale', String(envelope * 45));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;
    // The water-ripple wipe (app.css) is reserved for leaving /login — every
    // other navigation keeps the plain cross-fade so it doesn't get old fast.
    const isLoginExit = navigation.from?.url.pathname === '/login';
    if (isLoginExit) {
      document.documentElement.classList.add('vt-water');
      animateWaterDistortion(1100);
    }
    return new Promise((resolve) => {
      const transition = document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
      transition.finished.finally(() => {
        document.documentElement.classList.remove('vt-water');
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

<!-- Water-distortion filter for the login-exit view transition (see
     onNavigate above + app.css's html.vt-water rules). Kept mounted at the
     root so it's already in the DOM whenever a transition needs it. -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <filter id="water-distort" x="-20%" y="-20%" width="140%" height="140%">
    <feTurbulence
      id="water-turbulence"
      type="turbulence"
      baseFrequency="0.01 0.04"
      numOctaves="2"
      seed="7"
      result="noise"
    />
    <feDisplacementMap
      id="water-displacement"
      in="SourceGraphic"
      in2="noise"
      scale="0"
      xChannelSelector="R"
      yChannelSelector="G"
    />
  </filter>
</svg>
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
