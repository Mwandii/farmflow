# 🌽 Kiriku Farm Tracker

A mobile-first farm management web app built for tracking maize seasons on a 6-acre shamba in Kiriku, Kwale County, Kenya. Built with React + Vite + Tailwind CSS v4, deployed on Vercel.

---

## What It Does

Tracks a maize season from start to finish across five stages:

1. **Land Preparation** — date and cost of digging/tilling
2. **Planting** — date and cost of planting (this date drives all scheduling)
3. **First Weeding** — suggested ~3 weeks after planting
4. **Second Weeding** — suggested ~7 weeks after planting
5. **Harvesting** — date, cost, and number of sacks harvested

At the end of a season, generates a full **Season Report** with:
- Total expenses broken down by stage
- Revenue calculation (sell price per sack or per kg)
- Profit or loss verdict
- Average yield per acre
- Most expensive activity

Completed seasons are archived for year-over-year comparison.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React 18 |
| Build tool | Vite |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite` plugin) |
| Persistence | `localStorage` (no backend) |
| Deployment | Vercel |
| Fonts | Barlow Condensed + DM Sans (Google Fonts) |

No database. No authentication. No external APIs. All data lives in the browser.

---

## Project Structure

```
kiriku-farm/
├── index.html
├── vite.config.js
├── vercel.json
├── src/
│   ├── App.jsx                          # Root component, conditional render
│   ├── main.jsx
│   ├── index.css                        # Tailwind + @theme tokens + component classes
│   ├── data/
│   │   └── siteData.js                  # Farm config, stage definitions, schedule constants
│   ├── hooks/
│   │   └── useFarmData.js               # All localStorage read/write logic
│   ├── pages/
│   │   └── Home.jsx                     # Landing screen (no active season)
│   └── components/
│       ├── layout/
│       │   └── Navbar.jsx
│       ├── ui/
│       │   └── FadeIn.jsx               # IntersectionObserver scroll animation
│       └── sections/
│           ├── ActiveSeason.jsx         # Season progress, tabs, delete
│           ├── StageCard.jsx            # Individual stage card + inline log form
│           ├── SeasonReport.jsx         # Full report + profit calculator
│           └── PastSeasons.jsx          # Archived seasons, expandable
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install and run locally

```bash
git clone https://github.com/Mwandii/farmflow.git
cd Farm-Flow
npm install
npm run dev
```

Open `http://localhost:5173` on your browser or phone (same network).

### Build for production

```bash
npm run build
```

Output goes to `/dist`.

---

## Deploying to Vercel

1. Push the project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**
3. Import the GitHub repo
4. Leave all build settings as default — Vercel detects Vite automatically
5. Click **Deploy**

The `vercel.json` file handles SPA routing so direct URL access works correctly:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

No environment variables needed.

---

## How the Data Model Works

Everything is stored as a single JSON object in `localStorage` under the key `kiriku_farm_data`:

```json
{
  "activeSeason": {
    "id": "1716547200000",
    "year": "2026",
    "startedAt": "2026-05-14T08:00:00.000Z",
    "stages": {
      "landPrep": { "date": "2026-05-01", "cost": 8000 },
      "planting": { "date": "2026-05-10", "cost": 14000 },
      "firstWeeding": null,
      "secondWeeding": null,
      "harvesting": null
    }
  },
  "pastSeasons": []
}
```

When a season is completed it moves from `activeSeason` to `pastSeasons` with the sell price saved alongside it.

---

## Stage Scheduling Logic

All suggested dates are calculated relative to the planting date:

| Stage | Days After Planting |
|---|---|
| First Weeding | 21 days (~3 weeks) |
| Second Weeding | 49 days (~7 weeks) |
| Harvesting | 100 days (~3.5 months) |

These are estimates based on common hybrid maize varieties in Kenya (e.g. H614D). Adjust the constants in `src/data/siteData.js` if the variety runs shorter or longer:

```js
export const STAGE_SCHEDULE = {
  firstWeeding: 21,
  secondWeeding: 49,
  harvest: 100,
}
```

---

## Customising the App

All farm-specific config lives in `src/data/siteData.js`. To adapt this for a different farm:

```js
export const FARM_INFO = {
  name: 'Kiriku Shamba',
  location: 'Kiriku, Kwale County',
  size: '6 acres',
  crop: 'Maize',
}
```

Change the name, location, size, and crop here and it updates across the entire app.

---

## Design System

Design tokens are defined in `src/index.css` via Tailwind's `@theme {}` block:

```css
@theme {
  --color-soil: #1A2E1A;        /* dark green background */
  --color-soil-light: #243824;  /* card background */
  --color-gold: #D4A843;        /* primary accent */
  --color-cream: #F5EDD8;       /* body text */
  --color-cream-dim: #C8BC9E;   /* secondary text */
}
```

Reusable component classes (`.btn-primary`, `.card`, `.form-input`, `.overline`, etc.) are defined in `@layer components` in the same file.

---

## Limitations

- **Data is device-specific.** localStorage doesn't sync across devices. If your dad switches phones, the data doesn't move with him automatically. A future export/import feature or Supabase sync would solve this.
- **No push notifications.** The app shows Due badges but doesn't proactively notify. A PWA with a service worker or SMS via Africa's Talking would enable real alerts.
- **One active season at a time.** Designed for one shamba, one crop, one season. Multi-farm support would require a redesigned data model.

---

## Potential Future Features

- [ ] PWA manifest + service worker for home screen install and offline support
- [ ] Local push notifications for weeding and harvest reminders
- [ ] Export season report as PDF
- [ ] SMS reminders via Africa's Talking API
- [ ] Support for multiple shambas (home shamba + Kiriku)
- [ ] Rainfall and weather notes per season
- [ ] Input cost breakdown within each stage (labour, fertiliser, transport separately)

---

## Author

Built by [Athanas Muinde](https://github.com/Mwandii) for personal family use.  
Frontend development — Vite + React + Tailwind CSS.