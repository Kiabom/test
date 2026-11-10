# Plan: fleet KPI page — clear, labelled charts and working controls for vehicles and drivers

## Context
The user says the vehicle comparison chart is «too raw». It needs to show:
- which bar belongs to which vehicle (no names under the bars today),
- what each bar means,
- the same for drivers (today the drivers tab still shows the vehicles chart).

The buttons, displays, charts and fields of this section «don't work well».

### Problems found in the current page (`src/app/app/modules/fleet/page.tsx`)
1. **Comparison chart:**
   - Recharts drops the x-axis labels when there are many bars, so no vehicle names show.
   - No values on the bars.
   - Tare and gross are two separate bars, so the net load is hard to read.
2. **Drivers tab:** the comparison chart and the fleet filter are vehicle-only, so the drivers tab shows the wrong chart.
3. **Daily chart:** no axis titles or units on the axis, and dates are bare MM/DD.
4. **«نمایش همه»:** only expands the chart, not the table. The sort headers treat missing values oddly; there is no visible sort direction and no reset.
5. **Fleet filter:** does not change the summary cards or the daily chart, because both are computed server-side for all vehicles.
6. **Wide table:** columns run off-screen (last trip hidden). The table also prints badly.

## Changes
### A. Server (`fleetPerf` in `src/server/views.ts`)
- Accept filters `fleet=internal|external`, `carrierId` and `q`. The summary, daily series and both lists are computed only for the matching trips, so every card and chart follows the filter.
- Each row carries display fields: vehicle code + short tag + type + carrier name; driver name + card tag + carrier. The client stops guessing names.

### B. Comparison chart → own component `WeightCompare` (HTML/SVG, no Recharts)
- **One horizontal row per vehicle (or driver):**
  - label on the start side: «VH-004 · 1BBD-2071» or «امیر قاسمی»,
  - one stacked bar = loaded weight: grey part = empty weight (tare), blue part = net load,
  - numbers written on the bar: «۱۷ | ۲۸٫۵ = ۴۵٫۶ تن»,
  - at the end, a load-factor pill coloured by status,
  - a red marker when there was any overload.
- **Header controls:**
  - sort by: بیشترین تناژ / وزن پر / ضریب بارگیری / انحراف تارا,
  - «۱۰ اول / همه»,
  - a legend explaining grey = خالی, blue = بار خالص, whole bar = پر.
- Clicking a row opens the same scorecard drawer.
- Works on both tabs: vehicles use vehicle rows, drivers use driver rows.

### C. Daily chart
- Persian dates (۱۴۰۳/۰۴/۱۲), a y-axis titled «تن», a tooltip showing all three values plus the trip count.
- A second small bar row underneath with trips per day.
- Gets an `xLabel`/`yLabel` option in `components/charts` `Lines`.

### D. Table and controls
- **Columns are split into two views via a segmented control:**
  - «وزن و بار»: trips, tons, empty, loaded, net, load factor, over/under, tare drift.
  - «زمان و رفتار»: time on site, wait to first weigh, trips per day, holds, manual, last trip.

  It fits without horizontal scroll at 1440 px; on phone the rows turn into cards.
- **Sort headers:** ▲/▼ indicator, missing values always last, and the sort state kept per tab.
- **Shared «۱۰ / ۲۵ / همه» page size** for chart and table; a «پاک کردن فیلترها» button.
- **Filters:**
  - tabs drivers / vehicles,
  - fleet filter (applies to both, via the server),
  - carrier select,
  - search.
- **Summary cards:** show «فیلتر: …» when narrowed.
- **Print:** a clean A4 landscape layout of summary, both charts and the table; the drawer and controls are hidden.
- **Excel:** exports the visible columns plus the display names.

### E. Scorecard drawer
- The per-trip chart gets labelled axes and trip dates on hover. The same stacked-bar strip for the last 20 trips is added under it.

## Verification
- Unit tests:
  - `fleetPerf` with the fleet / carrier filter only counts matching trips,
  - display fields present.
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. e2e smoke green.
- Playwright click-through:
  - switch tabs, toggle fleet filter, carrier, sort, «همه», column view, open drawer.
  - Confirm the values change accordingly; no console errors.
- Screenshots of vehicles, drivers, drawer, mobile and print PDF.
- Commit and push. Send screenshots.
