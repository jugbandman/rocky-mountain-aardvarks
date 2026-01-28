# Rocky Mountain Aardvarks - Production Issues Plan

**Date:** 2026-01-28
**Source:** Andy's production site walkthrough

---

## Critical (Blocking)

### 1. Admin API Errors
**Problem:** Admin panel not asking for password, all API calls returning errors (teachers, testimonials, locations, classes, sessions, pages)
**Root Cause:** Likely D1 database binding not connected properly in Cloudflare Pages
**Files:** `functions/api/[[route]].ts`, Cloudflare dashboard
**Fix:** Verify D1 binding in Cloudflare Pages settings, check that `DB` binding name matches

---

## High Priority (Visual/UX)

### 2. Logo Centering
**Problem:** Logo should be centered over "kids music that rocks" text
**File:** `client/src/pages/Home.tsx` (hero section)
**Fix:** Adjust flex alignment in hero section

### 3. Light Blue Background Between Sections
**Problem:** Goofy light blue strip between navy hero and white section above "not your average music class"
**File:** `client/src/pages/Home.tsx`, possibly `client/src/index.css`
**Fix:** Remove/change background color, let shadow sit on white

### 4. Left Text Margin Too Tight
**Problem:** Text on left side too close to margin, should be centered between margin and photo
**File:** `client/src/pages/Home.tsx`
**Fix:** Adjust padding/margin on text container

### 5. Classes Page - White on Light Blue Text
**Problem:** Class schedule text is white on very light blue - unreadable
**File:** `client/src/pages/Classes.tsx`
**Fix:** Change text color or background color for contrast

### 6. Locations Page - White on Light Blue + Missing Map
**Problem:** Same color issue, plus map area is blank
**File:** `client/src/pages/Locations.tsx`
**Fix:** Fix colors, verify Google Maps is rendering (may need API key in production)

### 7. About Page Text Styling
**Problem:** Text spacing looks goofy, not spaced well
**File:** `client/src/pages/About.tsx`
**Fix:** Improve typography, line-height, paragraph spacing

### 8. Teachers Page - Center Layout
**Problem:** Teachers left-justified, should be centered; Hank should always be primary/first
**File:** `client/src/pages/Teachers.tsx`
**Fix:** Center grid, ensure display_order puts Hank first

---

## Medium Priority (Content/Features)

### 9. Homepage Testimonials
**Problem:** Current quotes too verbose, wants celebrity quotes (Paige McConnell, John Stewart) on front page
**File:** `client/src/pages/Home.tsx`, database seed
**Fix:** Add celebrity testimonials to DB with special flag, filter for homepage display, add "See More" button

### 10. Parties Page - Needs Photos + Separate Reviews
**Problem:** No photos in banner (should use party photos), reviews mixed with class reviews
**File:** `client/src/pages/Parties.tsx`, database schema
**Fix:** Add party photos to banner, add category field to testimonials table to separate party vs class vs celebrity

### 11. Gallery Empty
**Problem:** Gallery page shows no photos
**File:** `client/src/pages/Gallery.tsx`, database
**Fix:** Populate photos table with images from `/images/classes/`, `/images/parties/` directories

### 12. Favicon
**Problem:** Wants circular logo as browser favicon
**File:** `client/index.html`, `client/public/`
**Fix:** Create favicon.ico from logo.png, add to index.html

### 13. Hero Images Admin-Editable
**Problem:** Wants to change hero images via admin, not code
**Files:** Schema, admin pages, Home.tsx
**Fix:** Add site_settings or hero_images table, create admin UI, make Home.tsx read from API

---

## Low Priority (External/Future)

### 14. MainStreet "Home" Link
**Problem:** Clicking "Home" on MainStreet booking page goes to old website
**Fix:** This is in MainStreet admin settings, not our codebase - log as TODO for Hank

### 15. MainStreet Calendar Embed
**Problem:** Would like to embed MainStreet calendar on homepage
**File:** `client/src/pages/Home.tsx` or `Classes.tsx`
**Fix:** Research if MainStreet provides embeddable iframe/widget, add if available

---

## Files to Modify

| File | Issues |
|------|--------|
| `client/src/pages/Home.tsx` | #2, #3, #4, #9, #13, #15 |
| `client/src/pages/Classes.tsx` | #5 |
| `client/src/pages/Locations.tsx` | #6 |
| `client/src/pages/About.tsx` | #7 |
| `client/src/pages/Teachers.tsx` | #8 |
| `client/src/pages/Parties.tsx` | #10 |
| `client/src/pages/Gallery.tsx` | #11 |
| `client/index.html` | #12 |
| `shared/schema.ts` | #10 (testimonial categories) |
| `drizzle/seed.sql` | #9, #11 |
| Cloudflare Dashboard | #1 (D1 binding) |

---

## Execution Order

1. **Fix #1 first** - Admin/API must work before anything else
2. Then visual fixes: #2, #3, #4, #5, #6, #7, #8
3. Then content: #9, #10, #11, #12
4. Then features: #13, #15
5. Log #14 for Hank to fix in MainStreet

---
