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
    LineChart,
    Highlight,
    Labels,
    Legend,
    LinearGradient,
    Spline,
    Svg,
    Rule,
    Text,
    Tooltip,
    pivotLonger,
  } from "layerchart";
  import { de } from "date-fns/locale";


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
          value: measurement.batt / 10,
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
  <h3 class="text-sm text-emerald-500 mb-4">Batteriespannung (V)</h3>
  <div class="h-[300px] rounded-md bg-midnight text-emerald-500 fill-emerald-500 relative">
    <LineChart
      data={chart}
      x="date"
      y="value"
      xScale={scaleTime()}
      yDomain={scaleOrdinal()}
      tooltip={{ mode: "bisect-x" }}
      labels={{ offset: 10 }}
      padding={{ left: 40, bottom: 40, top: 40, right: 40 }}
    >
      <Svg>
        <Axis
          placement="left"
          rule
          classes={{
            rule: "stroke-emerald-600",
            tick: "stroke-emerald-600/80",
            tickLabel: "fill-emerald-600",
          }}
          tickLabelProps={{
            textAnchor: "end",
            style: "font-size: 12px;",
          }}
        />
        <Axis
          placement="right"
          rule
          classes={{
            rule: "stroke-emerald-600",
            tick: "stroke-emerald-600/80",
            tickLabel: "fill-emerald-600",
          }}
          tickLabelProps={{
            textAnchor: "start",
            style: "font-size: 12px;",
          }}
        />
        <Axis
          placement="bottom"
          rule
          format={(d: Date) => format(d, "p", { locale: de })}
          classes={{
            rule: "stroke-emerald-600",
            tick: "stroke-emerald-600/80",
            tickLabel: "fill-emerald-600",
          }}
          tickLabelProps={{
            style: "font-size: 12px;",
          }}
        />
        <Rule x y />
        <Highlight points lines axis="both" />
        <LinearGradient
          stops={ticks(1, 0, 10).map(temperatureColor.interpolator())}
          vertical
          let:gradient
        >
          <Spline class="stroke-2" stroke={gradient} fill="transparent" markerMid={{ type: 'circle', "stroke-width": 2 }} />
        </LinearGradient>
      </Svg>
      <Legend
        scale={temperatureColor}
        title="Batteriespannung (V)"
        placement="top-right"
        width={100}
        class="top-4 right-10"
        classes={{
          label: "fill-emerald-500 font-semibold",
          title: "fill-emerald-500 font-bold"
        }}
      />
      <Tooltip.Root let:data>
        <Tooltip.Header>{format(data.date, "eee, MMMM do")}</Tooltip.Header>
        <Tooltip.List>
          <Tooltip.Item label="value" value={data.value} />
        </Tooltip.List>
      </Tooltip.Root>
    </LineChart>
  </div>
</div>

<style lang="scss">
  @global(text) {
    fill: white;
  }
</style>
