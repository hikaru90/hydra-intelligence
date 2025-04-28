<script lang="ts">
  import type { Hydra } from "$lib/types";
  import { pb } from "$lib/pocketbase";
  import type { RecordModel } from "pocketbase";
  import RefreshCcw from "lucide-svelte/icons/refresh-ccw";
  import { m } from "$src/paraglide/messages.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { scaleOrdinal, scaleSequential, scaleTime } from "d3-scale";
  import { extent, flatGroup, ticks } from "d3-array";
  import { interpolateTurbo } from "d3-scale-chromatic";
  import { format } from "date-fns";
  import { formatDate, PeriodType } from "@layerstack/utils";
  import {
    Axis,
    Canvas,
    Chart,
    Highlight,
    Labels,
    Legend,
    LinearGradient,
    Spline,
    Svg,
    Text,
    Tooltip,
    pivotLonger,
  } from "layerchart";

  let { selectedHydra, class: className = "" } = $props<{
    selectedHydra: Hydra;
    class?: string;
  }>();

  const subtractTime = (time: Date, minutes: number) => {
    return new Date(time.getTime() - minutes * 60 * 1000);
  };

  let measurements = $state<RecordModel[]>([]);
  let refreshing = $state(false);
  let startTime = $state(subtractTime(new Date(), 24 * 7 * 60));
  let endTime = $state(new Date());

  const timeOptions = [
    { value: 10, label: "10m" },
    { value: 60, label: "1h" },
    { value: 24 * 60, label: "24h" },
    { value: 24 * 7 * 60, label: "last week" },
  ];

  const getData = async () => {
    if (!selectedHydra) return;
    refreshing = true;
    const filter = `device = "${selectedHydra.id}" && timestamp >= "${startTime.toISOString()}" && timestamp <= "${endTime.toISOString()}"`;
    console.log("filter", filter);
    const data = await pb.collection("measurements").getFullList({
      filter: filter,
      sort: "-timestamp",
    });
    measurements = data;
    console.log("measurements", measurements);
    setTimeout(() => {
      refreshing = false;
    }, 200);
  };

  $effect(() => {
    if (selectedHydra) {
      console.log("Selected hydra changed");
      getData();
    }
  });

  const tempChart = $derived.by(() => {
    console.log("measurements", measurements);
    const tempData = measurements
      .map((measurement) => {
        return {
          date: new Date(measurement.timestamp),
          value: measurement.temp,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    console.log("tempData", tempData);
    return tempData;
  });

  const temperatureColor = $derived.by(() =>
    scaleSequential(extent(tempChart, (d) => d.value) as [number, number], interpolateTurbo)
  );
</script>

<div class={className}>
  <h2 class="text-2xl font-bold">{m.charts()}</h2>
  <div class="flex items-center justify-between">
    <h3 class="text-sm text-emerald-500">{m.temperature()} (°C)</h3>
    <div class="flex items-center gap-2">
      <Select.Root
        portal={null}
        selected={timeOptions[2]}
        onSelectedChange={(value) => {
          console.log("value", value);
          startTime = subtractTime(new Date(), parseInt(value?.value as string));
          getData();
        }}
      >
        <Select.Trigger class="bg-midnight border-none w-36">
          <Select.Value placeholder="Select a time" />
        </Select.Trigger>
        <Select.Content class="bg-midnight border-none">
          {#each timeOptions as time}
            <Select.Item value={time.value} label={time.label}>{time.label}</Select.Item>
          {/each}
        </Select.Content>
        <Select.Input name="favoriteFruit" />
      </Select.Root>
      <button
        onclick={() => {
          refreshing = true;
          getData();
        }}
        class="text-emerald-500 p-2 rounded-md {refreshing ? 'animate-spin' : ''}"
      >
        <RefreshCcw class="size-5"></RefreshCcw>
      </button>
    </div>
  </div>

  <div class="h-[300px] p-4 rounded-md bg-midnight text-emerald-500 mt-4">
    <Chart
      data={tempChart}
      x="date"
      xScale={scaleTime()}
      y="value"
      yDomain={[-50, 50]}
      yNice
      padding={{ left: 24, bottom: 24 }}
      tooltip={{ mode: "bisect-x" }}
    >
      <Svg>
        <Axis placement="left" rule />
        <Axis
          placement="bottom"
          format={(d) => formatDate(d, PeriodType.Day, { variant: "short" })}
          rule
        />
        <!-- <Spline class="stroke-2" stroke="white" fill="transparent" /> -->
        <LinearGradient
        stops={ticks(1, 0, 10).map(temperatureColor.interpolator())}
        vertical
        let:gradient
        >
        <Spline class="stroke-2" stroke={gradient} fill="transparent" />
        </LinearGradient>
      </Svg>
      <Legend
        scale={temperatureColor}
        title="{m.temperature()} (°C)"
        placement="top-right"
        width={100}
        class="-top-[14px]"
      />
      <Tooltip.Root let:data>
        <Tooltip.Header>{format(data.date, "eee, MMMM do")}</Tooltip.Header>
        <Tooltip.List>
          <Tooltip.Item label="value" value={data.value} />
        </Tooltip.List>
      </Tooltip.Root>
    </Chart>
  </div>
</div>

<style lang="scss">
  @global(text) {
    fill: white;
  }
</style>
