# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WeAreESAP (向那卫星许愿) is a Next.js website for a sci-fi worldbuilding project about androids and humans. The main codebase is in the `website/` directory.

## Common Commands

All commands run from `website/` directory. **pnpm is required** (use `corepack enable`).

```bash
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Production build
pnpm lint             # ESLint check
pnpm lint:fix         # Auto-fix lint issues
pnpm format           # Format with Prettier
pnpm test:unit        # Run Vitest unit tests
pnpm test:unit:run    # Run unit tests once (CI mode)
pnpm test:e2e         # Run Playwright E2E tests
```

## Architecture

### Tech Stack

- Next.js 16 with App Router and React Server Components
- React 19, TypeScript, Tailwind CSS 4
- next-intl for i18n (zh-CN default, en, ja)
- ReactFlow + ELK for character relation graphs
- Vitest (unit) + Playwright (E2E)

### Directory Structure (website/)

```text
app/[locale]/         # Pages with locale routing
components/           # React components by feature
data/                 # JSON content (characters, timeline, tech)
  ├── characters/
  │   ├── zh-CN/     # Localized character data
  │   ├── en/
  │   ├── ja/
  │   └── relations/ # Relationship definitions
  ├── timeline/
  └── tech/
types/                # TypeScript type definitions
lib/                  # Utilities and data loaders
messages/             # UI translation files (next-intl)
```

### Key Patterns

**Locale Routing**: All pages under `app/[locale]/`. URL structure: `/` (zh-CN), `/en`, `/ja`.

**Data Loading**: JSON files in `data/` are loaded via `lib/data-loader.ts`. When localized content is missing, falls back to zh-CN.

**Character Relations**: Uses `lib/relationship-parser.ts` to parse relation definitions and `lib/graph-layout.ts` (ELK algorithm) for auto-layout.

**Component Organization**: Feature-based folders (character/, timeline/, tech/, layout/, ui/).

### Testing

- Unit tests: `lib/__tests__/` using Vitest
- E2E tests: `e2e/` using Playwright (Chromium, Firefox, Mobile Chrome)
- Run single test: `pnpm vitest run path/to/test.ts`

### Build Output

Uses `standalone` output mode for Docker deployment. Build generates blur placeholders for images via `scripts/generate-blur-placeholders.mjs`.
