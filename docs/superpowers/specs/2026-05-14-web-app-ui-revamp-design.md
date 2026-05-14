# Web App UI Revamp — Design

**Date:** 2026-05-14
**Status:** Design (awaiting user review → implementation plan)
**Scope:** Visual + mobile-responsive overhaul of `Homeauotmation_web-app`.

## Purpose

Replace the current ad-hoc styling (aquamarine cards, no theme, two-row headers, single-icon switches) with a Material You-based design system that is mobile-first responsive, supports light/dark mode, and surfaces information that matters for daily use (device types, room activity, snappy toggle feedback).

The current app works — this is a UX/visual revamp, not a behavior rewrite. URLs, data flow, auth, and backend contracts stay unchanged except where explicitly noted.

## Goals

- **Mobile-first daily use.** Optimize for "phone in hand, dim room, want to toggle a switch fast." Desktop must remain usable but is secondary.
- **Minimal & clean.** Remove visual chrome (always-visible logout, breadcrumb row, placeholder colors). One header row, type-aware switch tiles, generous spacing.
- **Material You + Purple.** Single seed color generates the palette. Auto light/dark following system. Confident accent without being garish.
- **Snappy toggles.** Optimistic flip + dim/disable card until server confirms. Replace blocking spinner.

## Non-goals

- No new routes or features beyond what the current data model supports.
- No Web Bluetooth (firmware Phase 3 g, parked).
- No Device Shadow / offline state-sync UX (firmware Phase 3 e2, parked).
- No dimmer/slider UI for fans (future, when ESP32 supports PWM).
- No scheduling/automations UI (future).
- No rewrite of auth, routing, data fetching, or backend.

## Decisions Locked During Brainstorm

| Area | Decision |
|---|---|
| Visual direction | Material You |
| Accent / seed color | Purple (`#6750a4`) |
| Theme mode | Auto (follows system), with explicit override in Settings |
| Information architecture | Unchanged: Login → UserHomes (favorites + homes) → HomeDetails → RoomDetails |
| Navigation pattern | Single-row top bar: back arrow + page title + settings ⚙ icon. No breadcrumb row, no always-visible greeting/logout. |
| Toggle feedback | Hybrid optimistic: icon flips instantly, card dims to ~55% and is non-interactive until server confirms (~600ms typical) |
| Device-type icons | 5 types — Light 💡, Fan 🌀, Plug 🔌, AC ❄️, Generic ⚡. Type picker in create/edit switch modal. Existing switches default to Light. |
| Loading state | Skeleton tiles (animated gray placeholders shaped like real tiles), replacing `CircularProgress` |
| Home card content | Home name + icon + "N of M switches on" sub-label. Whole card tappable. |
| Room-level master | "All off" button at top of RoomDetails, shown only when any switch in the room is on. No "All on". |
| Favorites placement | Stays at top of Homes landing (unchanged). |
| Switch card content | Type icon + name + ON/OFF pill. Star (favorite) overlay. Three-dot menu (hover desktop, long-press mobile). |
| Login/signup screen | Hero with app name + tagline, big Google login button, smaller "email signup" link below. |
| App name | Keep "Home-Automation" (no rename). |
| Implementation approach | In-place revamp: keep routing + data fetching, swap MUI theme + common components + per-page JSX. |

## Visual System

### Color palette (Material You from Purple seed)

| Token | Light mode | Dark mode |
|---|---|---|
| `primary` | `#6750a4` | `#d0bcff` |
| `onPrimary` | `#ffffff` | `#381e72` |
| `primaryContainer` | `#e8def8` | `#4f378b` |
| `onPrimaryContainer` | `#21005d` | `#eaddff` |
| `surface` | `#fef7ff` | `#141218` |
| `surfaceContainer` | `#f3edf7` | `#211f26` |
| `onSurface` | `#1d1b20` | `#e6e0e9` |
| `outline` | `#79747e` | `#938f99` |
| `error` | `#ba1a1a` | `#ffb4ab` |

Implemented via a custom MUI theme. Both modes are full implementations, not naïve color flips.

### Typography

Keep MUI default (`Roboto`). Override only:
- `h1` / page titles: 24px, weight 600.
- `body1`: 14px, weight 400.
- `caption` / labels: 11px, weight 600, uppercase letter-spacing 0.05em.

### Spacing & shape

- Border radius: cards 16px (tiles), buttons 999px (pills), top bar back/settings 16px (circles).
- Spacing rhythm: 4 / 8 / 12 / 16 / 24 px.
- Card padding: 12px mobile, 16px desktop.

### Responsive grid

Switch tiles and home cards use CSS Grid with `repeat(auto-fill, minmax(160px, 1fr))`. On a 360px phone that yields 2 columns; on a desktop 1200px width it yields 6+. No separate desktop/mobile layouts — one fluid grid.

## Navigation

Single top bar on every screen below login:

```
[← back]  Page title              [⚙]
```

- **Back arrow:** absent on root (Homes landing). Otherwise navigates one level up.
- **Page title:** current screen ("Homes", "My Home", "Living Room").
- **Settings ⚙:** opens bottom sheet (mobile) / dropdown (desktop) with theme override, display name, logout, app version.

Breadcrumbs component is removed. The back button + title carries the same info with half the vertical chrome.

## Pages

### Login / Signup

```
       Home-Automation
   Control every switch from one place

   ┌─────────────────────────────┐
   │  G   Continue with Google   │
   └─────────────────────────────┘

       or sign up with email →
```

- Centered hero.
- Single primary CTA (Google login).
- Secondary text link to email signup.
- Light/dark adapts automatically.

### Homes landing (UserHomes)

Top bar: title "Homes", no back, ⚙ on right.

1. **Favorites** section (only if user has favorites): horizontal-wrap grid of `SwitchCard` tiles. Section heading "Favorites".
2. **Homes** section: grid of `HomeCard` cards. Section heading "My Homes" + "+ Add" button.
3. Empty state if no homes: `EmptyState` with "Create your first home" button.

### HomeDetails

Top bar: title is the home name, back to Homes, ⚙ on right.

Two tabs (existing): **Rooms** and **Access**.

- **Rooms tab:** grid of `RoomCard` cards (name + active-switch count). "+ Add room" button at section top.
- **Access tab:** unchanged data model. List of users with role; restyled, same flow.

### RoomDetails

Top bar: title is the room name, back to HomeDetails Rooms tab, ⚙ on right.

- **"All off" button** at top, visible only when at least one switch is on. Tapping fires bulk off and triggers individual `dim+disable` on each affected card.
- **Switch tiles grid** below. Each tile = type icon + name + ON/OFF pill + favorite star overlay.
- "+ Add switch" button at section top.
- Empty state if room has no switches.

### Settings sheet

Bottom sheet on mobile, dropdown on desktop. Single screen, no nested nav.

```
Theme           [Auto ▾]   (Auto / Light / Dark)
Display name    Gaurang
─────────────────────────
Logout
─────────────────────────
v1.x.x
```

## Components

### New / heavily revised

| Component | Role |
|---|---|
| `theme/` | MUI theme factory: `getTheme('light' \| 'dark')`. Exports palette tokens. |
| `ThemeProvider` (in `App.js`) | Reads system preference + user override, applies MUI theme. |
| `TopBar` | Replaces the AppBar+Breadcrumbs combo. Props: `title`, `showBack` (default true), `onBackClick`, `rightAction`. |
| `SwitchTile` | Replaces `SwitchCard`. Renders type icon, name, ON/OFF pill, favorite star. Owns optimistic-toggle state machine (`idle` / `syncing` / `error`). |
| `HomeCard` | Replaces existing home card markup in UserHomes. Shows icon + name + "N of M on" + tap target. |
| `RoomCard` | New: home detail's Rooms tab card. Shows name + "N of M on". |
| `SkeletonTile` | Animated gray placeholder shaped like a `SwitchTile`. Used during fetch. |
| `SettingsSheet` | Bottom sheet (MUI `Drawer` anchor="bottom" on mobile, `Popover` on desktop). |
| `DeviceTypePicker` | Form control inside CreateEditModal. 5 selectable type icons with labels. |
| `EmptyState` (restyled) | Existing component, new visuals. |

### Removed

| Component | Why |
|---|---|
| `BreadCrumbs` | Replaced by back button in `TopBar`. |
| `Loader` (`CircularProgress` wrapper) | Replaced by `SkeletonTile` grids. |
| `FullScreenLoader` | Kept only for blocking ops (delete, save). Restyled. |

## Interaction details

### Optimistic toggle (per Q7)

`SwitchTile` local state machine:

```
idle (ON) ──tap──> syncing (visually OFF, card dimmed 0.55, pointer-events: none)
                 │
                 ├── server confirms within 5s ──> idle (OFF)
                 └── error or timeout ──> idle (ON) + Snackbar "Failed to toggle"
```

The visual flip happens immediately on tap. Backend call fires in parallel. On success, card un-dims silently. On failure, card reverts and a Snackbar shows the error.

The existing `roomSwitchesQueryProps.refetch()` after toggle is removed from the click handler — the optimistic update IS the source of truth for ~600ms, and a periodic refetch (or push from MQTT eventually) reconciles drift.

### Settings sheet open

Tap ⚙ → bottom sheet slides up. Dismiss by tap outside / drag down / back gesture.

### Device-type picker

When creating or editing a switch (`CreateEditModal`), show a row of 5 type chips: Light / Fan / Plug / AC / Generic. Selected chip highlights with primary color. Default for new switches: Light.

## Data model changes

Minimal. The DB schema already has `switch.type` (column in `switch` table). We're surfacing it in the UI.

- **REST API:** existing create/edit endpoints already accept `type`. Verify and (if missing) add default `'light'` server-side for legacy rows. No new endpoints.
- **DB migration (optional):** one-off update — `UPDATE switch SET type = 'light' WHERE type IS NULL;` so all existing switches show a lightbulb icon.

## Error handling

- Optimistic toggle failure → revert + Snackbar.
- API call failures (create/edit/delete) → Snackbar with retry option where applicable.
- Network offline → Snackbar persistent "Offline — changes won't apply" until reconnect.
- Auth expiry → existing redirect to login (unchanged).

## Testing

- **Manual responsive check.** Each route on iPhone Chrome, Android Chrome, desktop Chrome at 360 / 768 / 1200 / 1600 px widths.
- **Theme check.** Each route in forced light mode and forced dark mode.
- **Toggle latency check.** Tap a switch, confirm icon flips within one frame (~16ms), confirm dim/disable until server ack, confirm error revert.
- **Skeleton check.** Block network, reload a page, confirm skeleton tiles render in the right grid shape.
- **Real device check.** Toggle a real switch end-to-end from rebuilt UI, confirm ESP32 receives `incoming:` and relay clicks (existing test flow from firmware Phase 3).

Lighthouse mobile score target: 90+ on Performance, Accessibility, Best Practices.

## Implementation phases (high-level only — detailed plan to follow)

1. **Theme foundation.** Add `theme/` directory, ThemeProvider wired into `App.js`. No visual change yet (theme references existing components).
2. **Common components.** Build `TopBar`, `SwitchTile`, `HomeCard`, `RoomCard`, `SkeletonTile`, `SettingsSheet`, `DeviceTypePicker`. Each in isolation — testable in storybook-style sandbox if you want, or inline.
3. **Page migration.** Replace the JSX of each route component: Login, UserHomes, HomeDetails, RoomDetails. Routes/URLs unchanged.
4. **Device type wiring.** Update CreateEditModal to include picker. Backend default for legacy switches. Migration query if needed.
5. **Cleanup.** Delete unused `BreadCrumbs`, old `SwitchCard`, old `Loader`. Run through pages on phone + desktop in light + dark.

Each phase ends with a working app (no big "broken for a week" stretch).

## Files affected (rough)

```
src/
  App.js                           wrap with ThemeProvider, drop GoogleOAuthProvider position TBD
  theme/                           NEW — light.js, dark.js, index.js
  components/
    TopBar/                        NEW
    SwitchTile/                    NEW (replaces SwitchCard)
    HomeCard/                      NEW
    RoomCard/                      NEW
    SkeletonTile/                  NEW
    SettingsSheet/                 NEW
    DeviceTypePicker/              NEW
  commonComponents/
    EmptyState/                    restyle only
    Button/                        verify works with new theme
    Modal/                         verify works with new theme
    DialogModal/                   verify works with new theme
    BreadCrumbs/                   DELETE
    Loader/                        DELETE
  routes/
    components/RootPage.js         strip AppBar + greeting + logout button (moved to SettingsSheet)
    routes/Login/                  rebuild with hero treatment
    routes/SignUp/                 align with new Login style
    routes/UserHomes/              swap inner JSX to use HomeCard + SwitchTile
    routes/UserHomes/routes/HomeDetails/
                                   swap to TopBar + RoomCard grid
    .../Rooms/routes/RoomDetails/  swap to TopBar + SwitchTile grid + "All off"
    .../components/CreateEditModal in UserHomes / Rooms / Switches — restyle, switch modal adds DeviceTypePicker
```

Backend (`Homeautomation_lamda_REST_API`): minor — verify `type` field flow in `/switch/create` and `/switch/update`, default to 'light' if missing.

## Risks & open items

- **MUI 5 vs 6.** Web app currently on `@mui/material ^5.14.7`. Material You-style theming works on MUI 5; no upgrade needed. If we want some MUI 6-only features (e.g., `Drawer` API tweaks) we'd upgrade — not currently required.
- **Bundle size.** Adding more MUI imports + theme code may bump the bundle by ~30-50 KB gzipped. Should not affect Lighthouse meaningfully but worth monitoring.
- **Existing tests.** None exist. The implementation plan should include adding a minimal manual test checklist instead of trying to retrofit a test suite.
- **iOS Safari quirks.** Bottom sheet drag-to-dismiss has caveats. If MUI Drawer behaves oddly on iOS, fallback is a centered modal. Decide during implementation.
