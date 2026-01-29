# Plan: MainStreet Class Sync + Calendar View

**Goal:** Auto-sync classes from MainStreet, display as list AND calendar on RMA site.

---

## How It Works

```
MainStreet (source of truth)
         ↓
Daily Cron Worker scrapes classes.aspx
         ↓
Parses HTML → extracts sessions
         ↓
Stores in D1 sessions table
         ↓
RMA Site displays:
  - List view (current)
  - Calendar view (new)
         ↓
"Register" button → MainStreet
```

---

## What We Scrape

From `https://app.mainstreetsites.com/dmn2417/classes.aspx`:

| Field | Example |
|-------|---------|
| Session tab | "Spring 2026" |
| Location | "Wash Park" |
| Day | "Monday" |
| Time | "10:00 AM" |
| Start date | "Mar 03, 2026" |
| Duration | "10 weeks" |
| Instructor | "Hank Williams" |
| Register URL | Direct link to that class |

---

## Database Changes

Update sessions table to store scraped data:

```sql
ALTER TABLE sessions ADD COLUMN mainstreet_url TEXT;
ALTER TABLE sessions ADD COLUMN session_name TEXT; -- "Spring 2026"
ALTER TABLE sessions ADD COLUMN duration TEXT; -- "10 weeks"
```

---

## Implementation

### Step 1: Scraper Script

**File:** `functions/scheduled/sync-mainstreet.ts`

```typescript
export default {
  async scheduled(event, env, ctx) {
    // 1. Fetch MainStreet classes page
    const html = await fetch(MAINSTREET_URL).then(r => r.text());

    // 2. Parse HTML (use regex or cheerio-like parser)
    const sessions = parseMainStreetHTML(html);

    // 3. Upsert to D1
    for (const session of sessions) {
      await env.DB.prepare(`
        INSERT OR REPLACE INTO sessions (...)
        VALUES (...)
      `).bind(...).run();
    }
  }
}
```

### Step 2: Cron Trigger

**Add to `wrangler.toml`:**

```toml
[triggers]
crons = ["0 6 * * *"]  # Run daily at 6am UTC (midnight MT)
```

### Step 3: Calendar Component

**File:** `client/src/components/ClassCalendar.tsx`

Simple month view showing:
- Days with classes highlighted
- Click day → show classes for that day
- Color-coded by location

Libraries (pick one):
- `react-big-calendar` - Full featured, might be overkill
- `@fullcalendar/react` - Popular, good mobile support
- **Custom build** - Simple grid, we control everything

**Recommendation:** Custom build. It's just a month grid with dots/badges for class days. Clicking shows a popup with that day's classes.

### Step 4: Classes Page Update

**File:** `client/src/pages/Classes.tsx`

Add toggle between views:

```
[List View] [Calendar View]

┌─────────────────────────────────────┐
│  < January 2026 >                   │
├────┬────┬────┬────┬────┬────┬────┤
│ Su │ Mo │ Tu │ We │ Th │ Fr │ Sa │
├────┼────┼────┼────┼────┼────┼────┤
│    │  6 │  7 │  8 │  9 │ 10 │ 11 │
│    │ 🔵 │    │ 🔵 │    │ 🔵 │    │
├────┼────┼────┼────┼────┼────┼────┤
│ 12 │ 13 │ 14 │ 15 │ 16 │ 17 │ 18 │
│    │ 🔵 │    │ 🔵 │    │ 🔵 │    │
└────┴────┴────┴────┴────┴────┴────┘

🔵 = Wash Park  🟢 = Cherry Creek  🟡 = Cherry Hills
```

Click on a day with classes → modal shows:
- Class time
- Location
- Instructor
- [Register on MainStreet →] button

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `functions/scheduled/sync-mainstreet.ts` | **NEW** - Scraper cron job |
| `wrangler.toml` | Add cron trigger |
| `shared/schema.ts` | Add new session fields |
| `drizzle/0006_session_mainstreet.sql` | Migration for new fields |
| `client/src/components/ClassCalendar.tsx` | **NEW** - Calendar component |
| `client/src/pages/Classes.tsx` | Add calendar view toggle |

---

## Order of Work

1. **Schema + migration** - Add mainstreet_url, session_name, duration fields
2. **Scraper script** - Fetch and parse MainStreet HTML
3. **Test scraper locally** - Run manually, verify data
4. **Add cron trigger** - Schedule daily runs
5. **Calendar component** - Build the month view
6. **Integrate into Classes page** - Toggle between list/calendar
7. **Deploy + test** - Verify sync works in production

---

## Manual Sync Option

Also add an admin button to trigger sync on-demand:

```
Admin Dashboard
  [↻ Sync Classes from MainStreet]
```

Calls `/api/admin/sync-mainstreet` which runs the scraper immediately.

---

## What Hank Does

**Nothing.** Classes auto-sync from MainStreet daily. He manages everything in MainStreet as usual.

---

## Fallback

If MainStreet changes their HTML structure:
1. Sync fails (logged)
2. Site shows cached/last-synced data
3. Alert Hank to contact us

---

## Ready?

This replaces manual session entry entirely. Approve to start building.
