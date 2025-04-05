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

  let mapContainer: HTMLDivElement;
  let mapInstance: any;
  let isAddingMarker = false;
  let isAddingHydra = false;
  let newMarkerPosition: [number, number] | null = null;
  let orderId: string = "";
  let orderIdTouched: boolean = false;
  let orderIdIsValid: boolean = false;
  let orderIdAlreadyDeployed: boolean = false;
  let hydraLabel: string = "";
  let validationRunning = false

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
        if(orderIdAlreadyDeployed) throw new Error("Order already deployed");
        orderIdIsValid = true;
    } catch (error) {
      orderIdIsValid = false;
    }finally{
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

  const addHydra =	async  () => {
    try{
      await pb.collection("orders").update(orderId, {
        deployed: true,
        lon: newMarkerPosition[0],
        lat: newMarkerPosition[1],
        label: hydraLabel,
      });
    }catch(error){
      console.error(error);
    }finally{
      isAddingHydra = false;
    }
  };

  onMount(() => {
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

<div class="top-0 left-0 z-0 w-dvw h-dvh fixed">
  {#if isAddingMarker}
    <div
      class="flex items-center justify-center gap-2 absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
    >
      <div class="bg-midnight text-yellow-200 rounded-full px-7 py-5 gap-2">
        {m.chooseLocation()}
      </div>
      <button
        on:click={() => eventBus.emit("CANCEL_ADD_MARKER")}
        class="cursor-pointer bg-midnight text-red-400 rounded-full p-2 flex items-center justify-center gap-2 size-16"
      >
        <X class="size-5" />
      </button>
    </div>
  {/if}
  <div class="relative w-full h-full" bind:this={mapContainer}>
    <MapLibre
      dragRotate={false}
      center={[10.1560948, 54.3302994]}
      zoom={14}
      style="/dark.json"
      bind:map={mapInstance}
    >
      {#if newMarkerPosition}
        <Marker lngLat={newMarkerPosition} />
      {/if}
    </MapLibre>
  </div>
</div>

<Dialog.Root bind:open={isAddingHydra}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{m.addHydra()}</Dialog.Title>
      <Dialog.Description class="flex flex-col gap-4">
        {m.addingHydraAt()}
        {newMarkerPosition[0].toFixed(6)}, {newMarkerPosition[1].toFixed(6)}
        <div class="flex w-full flex-col gap-2">
          <Label for="orderId">{m.orderId()}</Label>
          <div class="relative">
            <Input
            type="text"
            id="orderId"
            placeholder={m.orderId()}
            value={orderId}
            on:input={(e) => validateOrderId(e.target.value)}
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
          <Input
            type="text"
            id="hydraLabel"
            placeholder={m.hydraLabel()}
            bind:value={hydraLabel}
          />
          <button disabled={!orderIdIsValid} on:click={() => addHydra()} class="bg-midnight text-white rounded-md p-2">{m.addHydra()}</button>
        </div>
      </Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
