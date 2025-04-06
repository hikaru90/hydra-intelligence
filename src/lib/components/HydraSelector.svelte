<script lang="ts">
  import { m } from "$src/paraglide/messages.js";

  let { hydras, selectHydra, class: className = "", selectedHydra = null } = $props<{ 
    hydras: Hydra[]; 
    selectHydra: (hydra: Hydra) => void;
    class?: string;
    selectedHydra: Hydra | null;
  }>();

  interface Hydra {
    id: string;
    deployed: boolean;
    lon: number;
    lat: number;
    label: string;
  }

  const tableWidths = ["w-6 md:w-1/6","w-36 md:w-1/6", "w-24 md:w-1/6", "w-24 md:w-1/6", "w-24 md:w-1/6", "w-36 md:w-1/6"];

</script>

<div class="overflow-x-auto pb-2 {className}">
  <div class="flex items-center justify-start whitespace-nowrap text-emerald-500/60 text-xs">
    <div class="head-cell {tableWidths[0]}">

    </div>
    <div class="head-cell {tableWidths[1]}">Hydra ID</div>
    <div class="head-cell {tableWidths[2]}">
      {m.hydraLabel()}
    </div>
    <div class="head-cell {tableWidths[3]}">
      {m.hydraLon()}
    </div>
    <div class="head-cell {tableWidths[4]}">
      {m.hydraLat()}
    </div>
    <div class="head-cell {tableWidths[5]}">
      {m.hydraCreated()}
    </div>
  </div>
  <div class="flex flex-col gap-1">
  {#each hydras as hydra}
    <button onclick={() => selectHydra(hydra)} class="whitespace-nowrap py-1 cursor-pointer">
      <div class="flex items-center justify-start">
        <div class="cell {tableWidths[0]} {selectedHydra?.id === hydra.id ? 'selected':''}">
          <div class="size-6 flex items-center justify-center">
            <div class="relative -ml-1 size-2 rounded-full {selectedHydra?.id === hydra.id ? 'bg-emerald-500':'bg-emerald-500/40'}">
              <div
              class="absolute top-0 left-0 w-full h-full {selectedHydra?.id === hydra.id ? 'bg-emerald-400' : 'bg-emerald-500/40'} rounded-full animate-ping"
            ></div>
            </div>
          </div>
          </div>
        <div class="cell {tableWidths[1]} {selectedHydra?.id === hydra.id ? 'selected':''}">
          {hydra.id}
        </div>
        <div class="cell {tableWidths[2]} {selectedHydra?.id === hydra.id ? 'selected':''}">
          {hydra.label}
        </div>
        <div class="cell {tableWidths[3]} {selectedHydra?.id === hydra.id ? 'selected':''}">
          {hydra.lon.toFixed(6)}
        </div>
        <div class="cell {tableWidths[4]} {selectedHydra?.id === hydra.id ? 'selected':''}">
          {hydra.lat.toFixed(6)}
        </div>
        <div class="cell {tableWidths[5]} {selectedHydra?.id === hydra.id ? 'selected':''}">
          {new Date(hydra.created).toLocaleDateString("de-DE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </div>
      </div>
    </button>
  {/each}
  </div>
</div>

<style>
  @reference "tailwindcss";
  .head-cell {
    @apply flex-shrink-0 px-2 py-1;
  }
  .cell {
    @apply flex-shrink-0 bg-emerald-500/10 first:rounded-l-md last:rounded-r-md px-2 py-2 text-start;
  }
  .cell.selected {
    @apply bg-emerald-600 text-black;
  }
</style>
