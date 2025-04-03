<script lang="ts">
  import { MapLibre } from "svelte-maplibre";
</script>

<div class="top-0 left-0 z-0 w-dvw h-dvh fixed">
  <div class="relative w-full h-full">
    <MapLibre center={[10.1560948,54.3302994]} zoom={14} style="/dark.json"></MapLibre>
  </div>
</div>
