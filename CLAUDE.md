# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Studio Admin — a Next.js 16 admin dashboard template built with React 19, TypeScript, Tailwind CSS v4, and Shadcn UI (new-york style). Currently frontend-only with mock data; no backend auth or real APIs.

## Commands

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm run lint             # Lint with Biome
npm run format           # Format with Biome
npm run check:fix        # Fix all lint + format issues
npm run generate:presets # Regenerate theme preset CSS files
```

Biome is the sole linter/formatter (no ESLint/Prettier). Husky + lint-staged run `biome check` on pre-commit. No test framework is configured.

## Code Style (Biome)

- Double quotes, trailing commas, 2-space indent, 120-char line width
- Imports sorted: React → Next → packages → `@/` aliases → relative paths
- Tailwind class sorting enforced (`useSortedClasses` rule)

## Architecture

### Routing (Next.js App Router)

All source code lives under `src/`. Path alias: `@/*` → `./src/*`.

Route groups:
- `(external)` — public pages (landing)
- `(main)/auth/` — auth screens (v1 and v2 variants for login/register)
- `(main)/dashboard/` — sidebar layout with dashboards (default, crm, finance, coming-soon)

`/dashboard` redirects to `/dashboard/default` via `next.config.mjs`.

### Colocation Pattern

Each route keeps its own `_components/` directory for feature-specific components. Underscore prefix prevents Next.js from treating them as routes.

### Component Layers

- `src/components/ui/` — Shadcn UI primitives (managed by Shadcn CLI via `components.json`)
- `src/components/data-table/` — reusable data table with TanStack Table, DnD support
- Route-level `_components/` — feature-specific components

### Preferences & Theming System

This is the most complex subsystem. User preferences (theme mode, preset, font, layout, sidebar variant, etc.) flow through:

1. **Zustand store** (`src/stores/preferences/`) — client-side state with `PreferencesStoreProvider` context wrapper in root layout
2. **Server Actions** (`src/server/server-actions.ts`) — read/write cookies for SSR-critical prefs (sidebar settings) to prevent layout shift
3. **HTML data attributes** — bridge server/client rendering
4. **CSS variables + theme presets** (`src/styles/presets/`) — visual application
5. **Persistence** (`src/lib/preferences/`) — cookies (default) or localStorage; layout-critical prefs always use cookies

Theme presets: default, brutalist, soft-pop, tangerine. Each is a CSS file with color variable overrides.

### State Management

Zustand with React Context provider pattern. The preferences store uses `useShallow` for render optimization.

### Data Tables

`useDataTableInstance` hook (`src/hooks/`) wraps TanStack React Table v8. DnD column reordering via `withDndColumn` utility in `src/components/data-table/table-utils.ts`.

### Navigation

Sidebar menu structure defined in `src/navigation/sidebar/sidebar-items.ts`. Sidebar components live in `src/app/(main)/dashboard/_components/sidebar/`.

### Key Utilities

- `src/lib/utils.ts` — `cn()` (class merging), `getInitials()`, `formatCurrency()`
- `src/lib/fonts/registry.ts` — font system with 11 Google Fonts via Next.js font optimization
- `src/lib/preferences/` — theme/layout application functions and persistence logic

### Server vs Client Components

Layouts and pages default to server components. Interactive components use `"use client"` directive. The dashboard layout reads preferences via Server Actions during SSR, then hydrates the Zustand store client-side.

## Adding New Features

- New dashboard: create directory under `src/app/(main)/dashboard/` with `page.tsx` and `_components/`. Add nav entry in `sidebar-items.ts`.
- New Shadcn component: use `npx shadcn@latest add <component>` (configured in `components.json`).
- New theme preset: add CSS file in `src/styles/presets/`, import in `globals.css`, register in preferences config.
