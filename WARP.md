# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development commands

### Start the development server
- `npm run dev`

This runs the Next.js development server on `http://localhost:3000` with hot reloading. The README also documents equivalent commands for other package managers (`yarn dev`, `pnpm dev`, `bun dev`), but `npm run dev` is the default here.

### Build for production
- `npm run build`

This runs `next build` to produce an optimized production build.

### Run the production server
- `npm run start`

This runs `next start` to serve the production build. Run `npm run build` first.

### Linting
- `npm run lint`
  - Runs ESLint using the project configuration and `eslint-config-next`.
- Lint a specific file or directory (example):
  - `npm run lint -- src/app/page.tsx`

There is currently no test script defined in `package.json`, so there is no standard command to run tests yet.

### Supabase local development
- `supabase login` — authenticate with Supabase (follow interactive prompts).
- `supabase init` — initialize Supabase config in this project if not already present.
- `supabase start` — start the local Supabase stack (Postgres and services); note the local URL and anon key for wiring the app to the local DB.

## Project structure and architecture

### Framework and entrypoints
- This is a TypeScript Next.js **App Router** project (Next `16.1.2`, React `19.2.3`), with source code under `src/`.
- The main application entrypoints are:
  - `src/app/layout.tsx`: Root layout that defines the HTML skeleton for all routes.
  - `src/app/page.tsx`: The default route for `/`.

### Root layout (`src/app/layout.tsx`)
- Imports and configures the Geist and Geist Mono fonts via `next/font/google`, exposing them as CSS variables (`--font-geist-sans`, `--font-geist-mono`).
- Imports global styles from `src/app/globals.css`.
- Exports `metadata` (title/description) used by Next.js for the document head.
- Wraps all pages in an `<html lang="en">` and `<body>` element, applying the font variables and `antialiased` via Tailwind utility classes:
  - `className={`${geistSans.variable} ${geistMono.variable} antialiased`}`.

All future routes/components rendered by the app will ultimately be children of this layout.

### Home page (`src/app/page.tsx`)
- Implements the `/` route.
- Uses `next/image` for the Next and Vercel logos.
- Uses Tailwind utility classes for layout and theming, with a responsive centered layout:
  - `flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black` on the outer wrapper.
  - Inner `main` uses width constraints and padding to create a content column.
- Currently renders the default create-next-app content (links to Templates, Learning, and Documentation). This file is intended to be replaced with the actual token tracker UI.

When adding new pages, follow the Next.js App Router convention: create new route segments and page components under `src/app` (e.g. `src/app/dashboard/page.tsx`).

### Styling, theming, and Tailwind CSS

#### Global styles (`src/app/globals.css`)
- Uses Tailwind CSS v4 via PostCSS:
  - `@import "tailwindcss";`
  - `@import "tw-animate-css";` for animation utilities.
- Defines a `dark` variant based on the `.dark` class:
  - `@custom-variant dark (&:is(.dark *));`
- Uses `@theme inline` to map CSS custom properties (e.g. `--background`, `--primary`) to Tailwind design tokens (`--color-background`, `--color-primary`, etc.).
- Declares a rich set of CSS variables on `:root` for color tokens (background, foreground, card, popover, primary/secondary, chart colors, sidebar colors, etc.) and radii (`--radius`, `--radius-sm` ... `--radius-4xl`).
- Provides a `.dark` theme block that overrides the same variables for dark mode.
- In `@layer base`:
  - Applies `border-border` and `outline-ring/50` to all elements via `@apply`.
  - Applies `bg-background` and `text-foreground` to `body`.

Together, these patterns provide a design-token-based theming system that Tailwind utilities read from, with light/dark modes driven by CSS variables.

#### Tailwind / PostCSS configuration
- `postcss.config.mjs` configures PostCSS with the `@tailwindcss/postcss` plugin used by Tailwind v4.

### Shared utilities (`src/lib/utils.ts`)
- Exposes a single utility:
  - `cn(...inputs: ClassValue[])`: wraps `clsx` and `tailwind-merge` to safely merge conditional class names while resolving Tailwind class conflicts.
- Intended to be used across components/pages whenever building dynamic `className` strings.

### Configuration and dependencies
- `next.config.ts` currently exports a minimal `nextConfig` object placeholder. Update this file when you need to customize Next.js behavior (experimental flags, redirects, rewrites, etc.).
- `package.json` scripts:
  - `dev`: `next dev`
  - `build`: `next build`
  - `start`: `next start`
  - `lint`: `eslint`
- Key runtime dependencies include:
  - `next`, `react`, `react-dom` for the core framework and UI.
  - `@supabase/supabase-js` for interacting with Supabase (not yet wired into the app code).
  - `recharts` for charting/visualizations (not yet used in the current pages).
  - `class-variance-authority`, `clsx`, and `tailwind-merge` to help build composable, type-safe UI components and className strings.
- Dev dependencies include `eslint`, `eslint-config-next`, `tailwindcss` v4, `@tailwindcss/postcss`, `tw-animate-css`, and TypeScript tooling.

### Database and usage tracking
- The intended backing store is a Supabase Postgres database.
- Core table (in `public` schema): `usage`
  - `id uuid default gen_random_uuid() primary key`
  - `created_at timestamptz default timezone('utc', now()) not null`
  - `project_name text not null`
  - `model text not null`
  - `input_tokens integer not null`
  - `output_tokens integer not null`
  - `total_tokens integer not null`
  - `cost_usd numeric(10,4) not null`
- Row Level Security (RLS) is enabled on `public.usage` with a permissive policy (`using (true)`) for now. Tighten this policy once you have an auth model in place.

As the project grows, prefer routing and page/layout components under `src/app`, shared UI primitives and hooks in dedicated subdirectories (e.g. `src/components`, `src/hooks`), and cross-cutting utilities in `src/lib` to keep the architecture consistent with the current structure.
