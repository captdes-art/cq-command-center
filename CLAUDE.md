# CQ Command Center — Claude Instructions

## Why This Exists
Central hub / launchpad for all Celtic Quest Fishing Fleet operations.
One page that links to every CQ app, shows live marine weather, local resources, regulations, and quick links.
Think of it as the home base — you open this and can jump to any part of the CQ system from here.
Next.js app deployed on Vercel.

## Map — Where Things Live
```
src/
  app/
    page.tsx          — Main command center home (the hub)
    login/            — Auth
    reset-password/   — Password reset
    setup/            — Initial setup flow
    api/              — API routes (marine weather, etc.)

  components/
    Header.tsx        — Top nav / header
    AppGrid.tsx       — Grid of app launch tiles (links to all CQ apps)
    MarineWidget.tsx  — Live marine weather + advisory alerts
    WeatherWidget.tsx — General weather widget
    QuickLinks.tsx    — Quick access links
    LocalResources.tsx — Local CQ resources
    RegulationsCard.tsx — Fishing regulations display

  data/               — Static JSON config files
    apps.json         — App tile config (name, URL, icon, color)
    local-resources.json — Local resource links
    regulations.json  — Regulations data

  lib/
    marine.ts         — Marine forecast API client (NOAA)

  hooks/              — Data hooks
  middleware.ts       — Auth protection
```

## Rules

### Deployment
- Auto-deploys to Vercel on push to `main`
- After any change: `git add <files> && git commit -m "description" && git push`

### App Grid (apps.json)
All CQ app tiles are configured in `src/data/apps.json` — this is where you add, remove, or update links.
Each tile has: `name`, `url`, `icon` (Lucide icon name), `description`, `accentColor`

**Current apps linked:**
- Reservation System → cqreservationsystem.vercel.app/admin
- Invoice App → nimble-invoice-buddy.vercel.app
- Facebook → facebook.com/celticquestfishing
- Instagram → instagram.com/celticquestfishing
- (+ others in the JSON)

To add a new app: edit `src/data/apps.json` only — no component changes needed.

### Marine Weather Widget
- Pulls from NOAA marine forecast API
- If it stops loading, check the NOAA API endpoint in `src/lib/marine.ts` — NOAA occasionally changes their API structure
- Shows advisory alerts when wind/seas exceed safe thresholds — never disable or hide advisory alerts

### Auth
- Login at `/login`
- Protected by Next.js middleware (`src/middleware.ts`)
- Keep auth simple — this is an internal ops tool, not a public app

## Workflows

### Adding a New App Tile
1. Open `src/data/apps.json`
2. Add entry: `{ "name": "...", "url": "https://...", "icon": "LucideIconName", "description": "...", "accentColor": "#hex" }`
3. `git add src/data/apps.json && git commit -m "feat: add [app name] to command center" && git push`

### Making a Code Change
```bash
git add <changed files>
git commit -m "type: what changed"
git push
# Verify deploy (~30s)
```

### Local Development
```bash
npm run dev    # localhost:3000
```
