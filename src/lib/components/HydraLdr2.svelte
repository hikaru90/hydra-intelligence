<script lang="ts">
  import type { Hydra } from "$lib/types";
  import { pb } from "$lib/pocketbase";
  import { m } from "$src/paraglide/messages.js";
  import { scaleOrdinal, scaleSequential, scaleTime } from "d3-scale";
  import { extent, flatGroup, ticks } from "d3-array";
  import { interpolateTurbo } from "d3-scale-chromatic";
  import { format } from "date-fns";
  import { formatDate, PeriodType } from "@layerstack/utils";
  import type { RecordModel } from "pocketbase";
  import { subtractTime } from "$src/scripts/helpers";
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

  let { measurements, startTime, endTime, class: className = "" } = $props<{
    measurements: RecordModel[];
    startTime: Date;
    endTime: Date;
    class?: string;
  }>();

  

  const chart = $derived.by(() => {
    console.log("measurements", measurements);
    const tempData = measurements
      .map((measurement: RecordModel) => {
        return {
          date: new Date(measurement.timestamp),
          value: measurement.ldr2,
        };
      })
      .sort((a: { date: Date; value: number; }, b: { date: Date; value: number; }) => a.date.getTime() - b.date.getTime());
    console.log("tempData", tempData);
    return tempData;
  });

  const temperatureColor = $derived.by(() =>
    scaleSequential(extent(chart, (d: { value: number; }) => d.value) as [number, number], interpolateTurbo)
  );
</script>

<div class={className}>
  <h3 class="text-sm text-emerald-500">Lichtintensität LDR2 (lux)</h3>
  <div class="h-[300px] p-4 rounded-md bg-midnight text-emerald-500 mt-4 fill-emerald-500">
    <Chart
      data={chart}
      x="date"
      xScale={scaleTime()}
      y="value"
      yDomain={scaleOrdinal()}
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
        title="Lichtintensität LDR2 (lux)"
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
