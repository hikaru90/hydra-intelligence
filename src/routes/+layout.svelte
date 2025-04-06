<script lang="ts">
  import "../app.css";
  import Navbar from "$lib/components/Navbar.svelte";
  import { page } from '$app/state';
  import { locales, localizeHref } from '$src/paraglide/runtime';

  let { children, data } = $props();
</script>

<div style="display:none">
  {#each locales as locale}
    <a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
  {/each}
</div>
<div class="min-h-screen bg-cyan-950 text-emerald-500">
  <Navbar {data} class="absolute top-4 left-0 w-full z-10" />

  <main>
    {@render children()}
  </main>
</div>

<style>
  @reference "tailwindcss";
  :global(.max-container) {
    @apply max-w-7xl px-4 md:mx-auto;
  }
</style>
