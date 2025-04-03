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
  <Navbar {data} class="relative z-10" />

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
