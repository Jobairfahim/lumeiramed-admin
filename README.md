# LumieraMed Admin Dashboard

Admin-side dashboard for the LumieraMed medical placement platform.

## Tech Stack

| Tool | Version |
|------|---------|
| Next.js | 15.1 (App Router, Turbopack) |
| React | 19 |
| TypeScript | 5.7 (strict) |
| Tailwind CSS | 4.0 (`@theme` variables) |
| Recharts | 2.13 (charts) |
| ESLint | 9 (flat config) |

## Getting Started

```bash
npm install
npm run dev        # Turbopack dev server
npm run type-check # TypeScript validation
npm run build      # Production build
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

| Screen | Component | Description |
|--------|-----------|-------------|
| Login | `Login.tsx` | Credentials form with loading state |
| Dashboard | `Dashboard.tsx` | Stats + bar/area charts (Recharts) + recent applications |
| All Applications | `AllApplications.tsx` | Table with Stage + Payment badges, search + filter |
| Application Detail | `ApplicationDetail.tsx` | Student profile, docs, Messages/Reject/Accept + Matching Placement |
| Matching Placement | `MatchingPlacement.tsx` | Selectable placement cards, Send Student, Create Placement modal |
| Hospital | `Hospital.tsx` | Hospital list table + Create Hospital modal |
| Hospital Placements | `HospitalPlacements.tsx` | Placement info cards grid with dept filter |
| Messages | `Messages.tsx` | Chat UI — contact list, live messages, auto-reply, send on Enter |
| Settings | `Settings.tsx` | Password change with strength meter + match indicator |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css          # Tailwind v4 @theme + fonts
├── components/
│   ├── AdminShell.tsx        # Client router
│   ├── Layout.tsx            # Sidebar + topbar
│   ├── Login.tsx
│   ├── Dashboard.tsx         # Recharts bar + area charts
│   ├── AllApplications.tsx
│   ├── ApplicationDetail.tsx
│   ├── MatchingPlacement.tsx
│   ├── Hospital.tsx
│   ├── HospitalPlacements.tsx
│   ├── Messages.tsx
│   ├── Settings.tsx
│   ├── Icon.tsx              # SVG primitive
│   └── ui.tsx                # Logo, Avatar, StageBadge, PayBadge
└── types/
    └── index.ts              # AdminPage, Application, Hospital, Placement…
```

## Key TypeScript Details

- `AdminPage` union type drives all navigation
- `StageStatus` and `PaymentStatus` discriminated unions for badge rendering
- `SaveState = "idle" | "saving" | "saved" | "error"` for async form UX
- All event handlers typed: `FormEvent`, `KeyboardEvent<HTMLInputElement>`
- `useMemo` for filtered lists, `useCallback` for send handlers
- `as const` on static data arrays for literal type inference
# lumeiramed-admin
