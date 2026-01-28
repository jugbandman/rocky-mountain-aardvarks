# Plan: Admin Panel Improvements

**Goal:** Make admin panel simple for non-technical users (Hank)

---

## Changes Overview

### 1. Photo Upload via Cloudflare R2
**Current:** Photos are static files in `/client/public/images/`, URLs stored in DB
**New:** Upload photos to Cloudflare R2, serve from R2 public URL

**Why R2:**
- Free tier: 10GB storage, 1M writes/month, 10M reads/month
- Native Cloudflare integration (just add binding)
- No external services needed
- Photos served via CDN

**Setup required:**
1. Create R2 bucket in Cloudflare dashboard
2. Add R2 binding to wrangler.toml
3. Create upload API endpoint
4. Build upload UI component

**Files to modify/create:**
- `wrangler.toml` - add R2 binding
- `functions/api/[[route]].ts` - add upload endpoint
- `client/src/components/ImageUpload.tsx` - **NEW** reusable upload component
- `client/src/pages/AdminTeachers.tsx` - use ImageUpload
- `client/src/pages/AdminPhotos.tsx` - **NEW** gallery management with upload

### 2. Gallery Management Admin Page
**Current:** No admin UI for gallery
**New:** Full CRUD with image upload

**Features:**
- Grid view of all photos with thumbnails
- Upload new photos (drag & drop or click)
- Edit title, description, category (Classes/Parties/Events)
- Reorder via display_order
- Toggle active/inactive
- Delete with confirmation

**Files:**
- `client/src/pages/AdminPhotos.tsx` - **NEW**
- `client/src/pages/AdminDashboard.tsx` - add Photos card

### 3. Markdown Content Editor
**Current:** Raw HTML textarea
**New:** Markdown editor with preview and cheat sheet

**Features:**
- Split view: edit left, preview right
- Cheat sheet popup (headers, bold, italic, links, lists)
- "Preview" mode to see final result before saving
- Save button only enabled after preview confirmed

**Components:**
- `@uiw/react-md-editor` - MIT license, popular, has preview built-in
- `react-markdown` - for rendering on frontend

**Files:**
- `client/src/pages/AdminPages.tsx` - replace textarea with MD editor
- `client/src/components/MarkdownCheatSheet.tsx` - **NEW** popup component
- `client/src/pages/About.tsx` - render with react-markdown

---

## Implementation Order

### Phase 1: R2 Setup + Image Upload Component
```
1. User creates R2 bucket in Cloudflare dashboard
2. Add R2 binding to wrangler.toml
3. Create /api/upload endpoint
4. Create ImageUpload.tsx component
5. Test upload flow
```

### Phase 2: Gallery Admin
```
1. Create AdminPhotos.tsx with upload + CRUD
2. Add to AdminDashboard
3. Test full gallery management
```

### Phase 3: Teacher Photo Upload
```
1. Update AdminTeachers.tsx to use ImageUpload
2. Show current photo preview
3. Test teacher photo updates
```

### Phase 4: Markdown Editor
```
1. Install dependencies
2. Create MarkdownCheatSheet.tsx
3. Update AdminPages.tsx with MD editor + preview
4. Convert existing HTML content to Markdown
5. Update About.tsx to render Markdown
```

---

## Dependencies to Add

```bash
pnpm add react-markdown @uiw/react-md-editor remark-gfm
```

---

## Cloudflare R2 Setup (Manual Steps)

1. Go to Cloudflare Dashboard → R2
2. Create bucket named `rma-photos`
3. Enable public access (Settings → Public access → Allow)
4. Copy the public URL (e.g., `https://pub-xxx.r2.dev`)
5. Add binding to wrangler.toml:
```toml
[[r2_buckets]]
binding = "PHOTOS"
bucket_name = "rma-photos"
```

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `wrangler.toml` | Modify | Add R2 bucket binding |
| `functions/api/[[route]].ts` | Modify | Add upload endpoint |
| `client/src/components/ImageUpload.tsx` | **NEW** | Drag-drop upload component |
| `client/src/components/MarkdownCheatSheet.tsx` | **NEW** | Formatting help popup |
| `client/src/pages/AdminPhotos.tsx` | **NEW** | Gallery management page |
| `client/src/pages/AdminDashboard.tsx` | Modify | Add Photos link |
| `client/src/pages/AdminTeachers.tsx` | Modify | Use ImageUpload component |
| `client/src/pages/AdminPages.tsx` | Modify | Markdown editor with preview |
| `client/src/pages/About.tsx` | Modify | Render markdown |
| `drizzle/seed.sql` | Modify | Convert HTML to Markdown |
| `package.json` | Modify | Add markdown dependencies |

---

## Ready to Start

Approve to begin with Phase 1 (R2 setup instructions + upload component).
