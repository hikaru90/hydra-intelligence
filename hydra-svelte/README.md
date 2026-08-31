# Cerberus OS — Svelte translation

Real Svelte 5 components translated from the settled prototype, ready to drop into
the `hydra-intelligence` repo. This is the **complete UI** — foundation, Screen 1 (dashboard), Screen 2 (the buoy), and all four
sheets. Every screen is navigable and every sheet works against reactive mock state. What's left is
swapping the mock data for PocketBase and adding i18n. Every `.svelte` file compiles cleanly under Svelte 5
runes; every `.ts` file parses under TypeScript 5.

## What's here

```
src/
├── app.css                          Tailwind 4 @theme tokens, fonts, resets
├── routes/
│   ├── +page.svelte                 Dashboard (Screen 1) — runnable
│   └── buoy/[id]/
│       ├── +page.ts                 Resolves the buoy id from the URL
│       └── +page.svelte             Buoy (Screen 2) — tabs, time, compare
├── lib/
│   ├── types.ts                     Domain model (two-log buoy, Observation, Parameter)
│   ├── config/index.ts              Parameters, status colours, deployment labels, subject copy
│   ├── utils/
│   │   ├── format.ts                relativeTime, batteryColor, buoySubline, formatValue
│   │   ├── chart.ts                 buildSparkline (line + area paths)
│   │   └── time-range.ts            resolvedRangeLabel, timeAxisTicks
│   ├── data/
│   │   ├── mock.ts                  Buoys / sites / observations + coordinates
│   │   └── telemetry.ts             Mock sensor snapshots, ranges, series
│   └── components/
│       ├── StatusDot.svelte         Unified status dot
│       ├── BottomSheet.svelte       Reusable slide-up sheet (for the sheets step)
│       ├── dashboard/               FleetHeader, MapPanel, BuoyCard, BuoyList
│       ├── buoy/
│       │   ├── DetailHeader.svelte  Back / buoy switcher / export
│       │   ├── TabBar.svelte        Data | Observations (Obs disabled in compare)
│       │   ├── TimeControls.svelte  now/24h/7d/30d + Compare
│       │   ├── CompareHeader.svelte Two buoy-column selectors
│       │   ├── ParameterCard.svelte Snapshot + trend modes, tappable
│       │   ├── ParameterGrid.svelte Single column, or paired 2-col in compare
│       │   ├── TrendChart.svelte    Sparkline (gradient area + line)
│       │   ├── ObservationLog.svelte Field log + empty state
│       │   ├── ObservationCard.svelte One entry
│       │   ├── BuoyMenu.svelte      Shared buoy dropdown
│       │   └── CheckInFab.svelte    New Check-In (observations-only)
│       └── sheets/
│           ├── CheckInSheet.svelte  In-sheet buoy picker (GPS-nearest) + edit-last
│           ├── AddBuoySheet.svelte  Name, deployment grid, adaptive subject
│           ├── ExportSheet.svelte   Range presets + custom dates (validated)
│           └── ParameterDetailSheet.svelte  Expanded graph + drag scrubber
```

## Dependencies this package needs

```
npm i svelte-maplibre maplibre-gl     # map (svelte-maplibre v2 = the Svelte 5 line)
```
`maplibre-gl` CSS is imported by `svelte-maplibre` automatically. OpenFreeMap needs **no API key**.
You said the map connection is already set up — if so, these are likely present already.

## Conventions & assumptions

- **Svelte 5 runes** throughout: `$props`, `$state`, `$derived`, `$bindable`, snippets, `onclick=`.
- **SvelteKit `$lib` alias** for imports. If your repo differs, only import paths change.
- **Tailwind 4** tokens in `@theme` (available as both `bg-teal` utilities and `var(--color-teal)`);
  component layout uses **scoped `<style>`** to keep exact prototype fidelity.
- **Observations store absolute ISO timestamps**; the UI derives the relative label.
- **Accessibility floor**: keyboard-activatable cards + markers, ARIA labels, reduced-motion respected.

## What's interactive right now (against mock state)

- **New Check-In** opens the sheet, picks the GPS-nearest buoy, and a save prepends a real
  entry to that buoy's observation log (edit-last updates the newest entry).
- **Add Buoy** appends to the dashboard list immediately.
- **Export** validates custom date ranges live (end-before-start, day count).
- **Tapping a parameter card** opens the detail graph; drag across it to scrub any point.

## Where your repo plugs in

- **PocketBase**: replace `data/mock.ts` with load functions / a client returning the same types.
- **Paraglide (DE/EN)**: UI strings are inline English; wrap them in message functions for i18n.
- **Map style**: `MapPanel` defaults to OpenFreeMap "liberty". Pass `styleUrl=` to use your own.
- **Photos**: `BuoyCard` + observations take a `photoUrl`; point at PocketBase file URLs.

## Remaining (not UI)

1. **Backend** — replace `data/mock.ts` + `data/telemetry.ts` with PocketBase behind the same
   type signatures, and add SvelteKit load functions. The components don't change.
2. **i18n** — wrap the inline English strings in Paraglide message functions for DE/EN.

The UI is complete and compile-verified (Svelte 5 runes, TypeScript). Save state currently lives
in reactive mock stores in the routes; that's exactly what the PocketBase layer replaces.
