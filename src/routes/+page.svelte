<script lang="ts">
  import { MapLibre, Marker } from "svelte-maplibre";
  import { onMount } from "svelte";
  import { eventBus } from "$lib/stores/eventBus";
  import * as Dialog from "$lib/components/ui/dialog";
  import { m } from "$src/paraglide/messages.js";
  import X from "lucide-svelte/icons/x";
  import LoaderCircle from "lucide-svelte/icons/loader-circle";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label/index.js";
  import { pb } from "$lib/pocketbase.js";
  import type { PageProps } from "./$types";
  import Marquee from "$lib/components/Marquee.svelte";
  import { user } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  let { data }: PageProps = $props();

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
  let cursorPosition: [number, number] | null = $state(null);
  let tooltipPosition: { x: number; y: number } | null = $state(null);
  let orderId: string = $state("");
  let orderIdTouched: boolean = $state(false);
  let orderIdIsValid: boolean = $state(false);
  let orderIdAlreadyDeployed: boolean = $state(false);
  let hydraLabel: string = $state("");
  let validationRunning = $state(false);

  const getHydras = async () => {
    const filter = `customer = '${$user.id}' && deployed = true`;
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

  const handleMouseMove = (event: any) => {
    if (isAddingMarker && mapInstance) {
      const canvas = mapInstance.getCanvas();
      const rect = canvas.getBoundingClientRect();
      cursorPosition = [event.lngLat.lng, event.lngLat.lat];
      tooltipPosition = {
        x: event.point.x,
        y: event.point.y
      };
    }
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
      mapInstance.on("mousemove", handleMouseMove);
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
        mapInstance.off("mousemove", handleMouseMove);
      }
      unsubscribe();
    };
  });
</script>

<div class="top-0 left-0 z-0 w-dvw h-dvh fixed">
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
    {#if cursorPosition && tooltipPosition}
      <div
        class="fixed z-20 bg-midnight text-yellow-200 px-2 py-1 rounded-md text-sm pointer-events-none"
        style="left: {tooltipPosition.x}px; top: {tooltipPosition.y}px; transform: translate(-50%, -120%) translateY(-8px)"
      >
        {cursorPosition[0].toFixed(6)}, {cursorPosition[1].toFixed(6)}
      </div>
    {/if}
  {/if}
  <div class="relative w-full h-full" bind:this={mapContainer}>
    <MapLibre
      dragRotate={false}
      center={[10.1560948, 54.3302994]}
      zoom={14}
      style="/dark.json"
      bind:map={mapInstance}
    >
      {#each hydras as hydra}
        <Marker lngLat={[hydra.lon, hydra.lat]} onclick={() => {
          goto(`/view/${hydra.id}`);
        }}>
          <div class="size-5 relative">
            <div class="absolute inset-0 bg-emerald-500 rounded-full"></div>
            <div class="absolute inset-0 bg-emerald-500 rounded-full animate-ping"></div>
          </div>
        </Marker>
      {/each}
    </MapLibre>
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
