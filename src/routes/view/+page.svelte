<script lang="ts">
  import { MapLibre, Marker } from "svelte-maplibre";
  import { onMount } from "svelte";
  import { eventBus } from "$lib/stores/eventBus";
  import * as Dialog from "$lib/components/ui/dialog";
  import { m } from "$src/paraglide/messages.js";
  import { X, LoaderCircle } from "lucide-svelte/icons";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label/index.js";
  import { pb } from "$lib/pocketbase.js";
  import type { PageProps } from "./$types";
  import Marquee from "$lib/components/Marquee.svelte";
  import HydraSelector from "$lib/components/HydraSelector.svelte";

  let { data }: PageProps = $props();

  console.log("data", data);

  interface Hydra {
    id: string;
    deployed: boolean;
    lon: number;
    lat: number;
    label: string;
  }

  let hydras = $state<Hydra[]>([]);

  let mapContainer: HTMLDivElement | undefined = $state(undefined);
  let mapInstance: any | undefined = $state(undefined);
  let isAddingMarker = $state(false);
  let isAddingHydra = $state(false);
  let newMarkerPosition: [number, number] | null = $state(null);
  let orderId: string = $state("");
  let orderIdTouched: boolean = $state(false);
  let orderIdIsValid: boolean = $state(false);
  let orderIdAlreadyDeployed: boolean = $state(false);
  let hydraLabel: string = $state("");
  let validationRunning = $state(false);
  let selectedHydra: Hydra | null = $state(null);
  const getHydras = async () => {
    const userId = pb.authStore.model?.id;
    const filter = `customer = '${userId}' && deployed = true`;
    const records = await pb.collection("orders").getFullList<Hydra>({
      filter: filter,
    });
    hydras = records;
    console.log("hydras", hydras);
  };
  const handleMapClick = (event: any) => {
    if (isAddingMarker) {
      newMarkerPosition = [event.lngLat.lng, event.lngLat.lat];
      eventBus.emit("CONFIRM_ADD_MARKER", newMarkerPosition);
    }
  };
  const validateOrderId = async (value: string) => {
    validationRunning = true;
    orderIdAlreadyDeployed = false;
    orderIdIsValid = false;

    orderId = value;
    orderIdTouched = true;
    // Check if order exists in pocketbase
    try {
      const record = await pb.collection("orders").getFirstListItem(`id="${value}"`);
      orderIdAlreadyDeployed = record.deployed;
      if (orderIdAlreadyDeployed) throw new Error("Order already deployed");
      orderIdIsValid = true;
    } catch (error) {
      orderIdIsValid = false;
    } finally {
      setTimeout(() => {
        validationRunning = false;
      }, 1000);
    }
  };
  const addMarker = (markerPosition: [number, number]) => {
    console.log("Adding marker at:", markerPosition);
    newMarkerPosition = markerPosition;
    isAddingHydra = true;
  };
  const addHydra = async () => {
    try {
      if (!newMarkerPosition) return;
      await pb.collection("orders").update(orderId, {
        deployed: true,
        lon: newMarkerPosition[0],
        lat: newMarkerPosition[1],
        label: hydraLabel,
      });
      await getHydras();
    } catch (error) {
      console.error(error);
    } finally {
      isAddingHydra = false;
    }
  };

  const selectHydra = (hydra: Hydra) => {
    console.log(hydra);
    selectedHydra = hydra;
    mapInstance?.flyTo({
      center: [hydra.lon, hydra.lat],
      duration: 1000,
    });
  };

  onMount(() => {
    getHydras();

    const resizeObserver = new ResizeObserver(() => {
      if (mapInstance) {
        mapInstance.resize();
      }
    });

    if (mapContainer) {
      resizeObserver.observe(mapContainer);
    }

    if (mapInstance) {
      mapInstance.on("click", handleMapClick);
    }

    // Subscribe to event bus
    const unsubscribe = eventBus.subscribe((event) => {
      if (!event) return;

      console.log("event.type", event.type);

      switch (event.type) {
        case "ADD_MARKER":
          isAddingMarker = true;
          if (mapInstance) {
            mapInstance.getCanvas().style.cursor = "crosshair";
          }
          break;
        case "CANCEL_ADD_MARKER":
          isAddingMarker = false;
          newMarkerPosition = null;
          if (mapInstance) {
            mapInstance.getCanvas().style.cursor = "";
          }
          break;
        case "CONFIRM_ADD_MARKER":
          isAddingMarker = false;
          // Here you would typically save the marker to your database
          console.log("Adding marker at:", event.payload);
          addMarker(event.payload);
          if (mapInstance) {
            mapInstance.getCanvas().style.cursor = "";
          }
          break;
      }
    });

    return () => {
      resizeObserver.disconnect();
      if (mapInstance) {
        mapInstance.off("click", handleMapClick);
      }
      unsubscribe();
    };
  });
</script>

<div class="">
  {#if isAddingMarker}
    <div
      class="flex items-center justify-center gap-2 absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
    >
      <Marquee />
      <button
        onclick={() => eventBus.emit("CANCEL_ADD_MARKER")}
        class="cursor-pointer bg-midnight text-red-400 rounded-full p-2 flex items-center justify-center gap-2 size-16"
      >
        <X class="size-5" />
      </button>
    </div>
  {/if}
  <div class="relative w-full h-[400px]" bind:this={mapContainer}>
    <MapLibre
      dragRotate={false}
      center={[10.1560948, 54.3302994]}
      zoom={14}
      style="/dark.json"
      bind:map={mapInstance}
      attributionControl={false}
    >
      {#each hydras as hydra}
        <Marker onclick={() => selectHydra(hydra)} lngLat={[hydra.lon, hydra.lat]} class="relative size-5 rounded-full {selectedHydra?.id === hydra.id ? 'bg-emerald-500' : 'bg-emerald-500/40'}">
          <div
            class="absolute top-0 left-0 w-full h-full {selectedHydra?.id === hydra.id ? 'bg-emerald-500' : 'bg-emerald-500/40'} rounded-full animate-ping"
          ></div>
        </Marker>
      {/each}
    </MapLibre>
  </div>

  <div class="max-container">
    <div class="py-8">
      <h2 class="text-2xl font-bold">{m.hydras()}</h2>
      <HydraSelector {hydras} selectHydra={selectHydra} selectedHydra={selectedHydra} class="my-6" />
      <h2 class="text-2xl font-bold">{m.charts()}</h2>
      <HydraTemp {hydras} selectedHydra={selectedHydra} class="my-6" />
    </div>
  </div>
</div>

<Dialog.Root bind:open={isAddingHydra}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{m.addHydra()}</Dialog.Title>
      <Dialog.Description class="flex flex-col gap-4">
        {m.addingHydraAt()}
        {#if newMarkerPosition}
          {newMarkerPosition[0].toFixed(6)}, {newMarkerPosition[1].toFixed(6)}
        {/if}
        <div class="flex w-full flex-col gap-2">
          <Label for="orderId">{m.orderId()}</Label>
          <div class="relative">
            <Input
              type="text"
              id="orderId"
              placeholder={m.orderId()}
              value={orderId}
              on:input={(e) => validateOrderId((e.target as HTMLInputElement).value)}
            />
            {#if validationRunning}
              <div class="absolute right-2 top-1/2 -translate-y-1/2">
                <LoaderCircle class="size-4 animate-spin text-gray-700" />
              </div>
            {/if}
          </div>
          {#if orderIdTouched && !validationRunning}
            {#if !orderIdIsValid}
              {#if orderIdAlreadyDeployed}
                <p class="bg-red-700 text-white rounded-md p-2">{m.orderIdAlreadyDeployed()}</p>
              {:else}
                <p class="bg-red-700 text-white rounded-md p-2">{m.orderIdInvalid()}</p>
              {/if}
            {/if}
          {/if}
          <Label for="hydraLabel">{m.hydraLabel()}</Label>
          <Input type="text" id="hydraLabel" placeholder={m.hydraLabel()} bind:value={hydraLabel} />
          <button
            disabled={!orderIdIsValid}
            onclick={() => addHydra()}
            class="bg-midnight text-white rounded-md p-2">{m.addHydra()}</button
          >
        </div>
      </Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
