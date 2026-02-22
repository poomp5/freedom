# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Freedom is a Thai educational resource website for secondary school students (ม.1–ม.6) at Assumption University Thonburi. It aggregates and distributes free study summary sheets ("ชีทสรุป") organized by grade level and exam type (midterm/final). Built with Next.js 16, React 19, TypeScript 5, and Tailwind CSS 3.4.

## Commands

```bash
bun dev          # Start development server with hot reload
bun run build    # Production build
bun start        # Run production server
bun run lint     # ESLint
```

Package manager is **Bun** (`bun.lockb`). No test framework is configured.

## Architecture

**Next.js App Router** with the following structure:

- `app/page.tsx` — Landing page with exam countdown
- `app/select/page.tsx` — Grade selection page
- `app/[m1-m6]/[midterm1|midterm2|final1|final2]/page.tsx` — Sheet listing pages per grade and exam type
- `app/donate/` — Donation pages with individual donor routes (`/donate/[username]`)
- `app/components/` — Shared React components
- `app/config/` — Data configuration (donor info)
- `public/assets/m1-m6/` — PDF files organized by grade and exam type

**Key components:**
- `SheetRow` — Table row for each sheet entry, handles links to PDFs
- `SearchModal` — Client-side fuzzy search across all sheets
- `Countdown` — Exam countdown timer with Thailand timezone (GMT+7) awareness
- `Navbar` / `Bottombar` — Desktop and mobile navigation respectively
- `config.tsx` — App-wide settings (academic year, timezone, exam target date)
- `searchData.ts` — Large dataset (~32KB) of all sheet metadata powering search

## Key Patterns

- **"use client"** directive on interactive components (search, countdown, dropdowns); other pages are server-rendered
- **Thai-first UI** — All user-facing text is in Thai; use Thai for any new UI strings
- **Kanit font** from Google Fonts for Thai language support
- **Dynamic Tailwind color safelist** in `tailwind.config.ts` for subject-based theming (pink/blue/green/red/purple at 100/600 shades)
- **Configuration-driven** — Exam dates, donor info, and sheet data are all in config files rather than hardcoded in pages
- **SmartLink** component handles both internal and external links
- **Path alias** `@/*` maps to project root (configured in `tsconfig.json`)
- External images allowed from `promptpay.io` (payment QR codes) in `next.config.mjs`

## Dashboard & Admin

- `app/dashboard/` — Authenticated dashboard area with sidebar navigation (`DashboardSidebar.tsx`)
- `app/dashboard/admin/users/` — Admin user management page with `UserTable.tsx` (expandable rows showing uploaded sheets per user)
- `app/dashboard/admin/sheets/` — Admin sheet management

## tRPC & Data Layer

- **tRPC** with `@trpc/server` v11 + `@tanstack/react-query` for data fetching
- Routers live in `trpc/routers/` — key routers: `users.ts`, `sheets.ts`, `dashboard.ts`
- Procedure types: `protectedProcedure` (any logged-in user), `adminProcedure` (admin only), `publisherOrAdminProcedure`
- Client-side: use `useTRPC()` hook from `@/trpc/client` to get typed query/mutation options, then pass to `useSuspenseQuery`, `useQuery`, `useMutation`
- **Prisma** ORM with `@/lib/prisma` singleton — models include `User`, `Sheet`, `School`, ratings
- Sheet queries commonly include `ratings: { select: { score: true } }` and compute `averageRating`/`totalRatings` in the router
- Use `_count` on relations (e.g., `_count: { select: { sheets: true } }`) for efficient counting

## Common Pitfalls

- **Optional chaining on Prisma `_count`**: When adding `_count` to an existing query, always use optional chaining (`user._count?.sheets ?? 0`) in the client because stale cached data from React Query may not include the new field yet
- **`stopPropagation` on nested interactive elements**: When table rows are clickable (e.g., expandable rows), add `onClick={(e) => e.stopPropagation()}` on nested interactive elements like `<select>` dropdowns to prevent row click handlers from firing
- **Lazy loading with `useQuery`**: For expandable/conditional data fetching, use `useQuery` (not `useSuspenseQuery`) so the query only runs when the component mounts (e.g., when a row is expanded)
