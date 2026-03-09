# Warframe Live Dashboard

A single-page React + TypeScript dashboard for live **PC** worldstate data from [WarframeStat.us](https://api.warframestat.us).

## Prerequisites

- Node.js 18+
- npm 9+

## Install

```bash
npm install
```

## Run dev server

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Test

```bash
npm run test
```

## Architecture summary

- `src/api/warframeApi.ts`: central API client and dashboard aggregate loader with partial-failure tolerance.
- `src/hooks/useDashboardData.ts`: polling and refresh hook (60-second interval).
- `src/components/*`: reusable dashboard UI pieces (layout, cards, nav, error handling, countdown badges).
- `src/utils/format.ts`: formatting and fallback helpers.
- `src/types/warframe.ts`: manually maintained API response types.
- `src/App.tsx`: section-based SPA dashboard rendering.

## API endpoints used

- `/pc/alerts`
- `/pc/fissures`
- `/pc/sortie`
- `/pc/nightwave`
- `/pc/voidTrader`
- `/pc/news`
- `/pc/cetusCycle`
- `/pc/earthCycle`
- `/pc/vallisCycle`
- `/pc/cambionCycle`
