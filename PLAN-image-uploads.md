# Plan: Admin Image Uploads

**Goal:** Let Hank upload/change images for teachers, classes, gallery, and hero sections.

---

## What Makes This Simple

1. **R2 is already part of Cloudflare** - No external service, just add a bucket binding
2. **No image processing** - Require correct dimensions, reject wrong sizes
3. **Existing URL fields** - Teachers, classes, photos tables already have `image_url` columns
4. **One reusable component** - Same upload widget everywhere

---

## Required Dimensions (enforce on upload)

| Use Case | Dimensions | Aspect Ratio |
|----------|------------|--------------|
| Teacher photo | 400x400 | 1:1 (square) |
| Class image | 800x600 | 4:3 |
| Gallery photo | 1200x800 | 3:2 |
| Hero image | 1920x1080 | 16:9 |

Upload rejects images that don't match. Simple error message: "Image must be 400x400 pixels"

---

## Implementation (4 steps)

### Step 1: R2 Bucket Setup (manual, 2 min)
```
1. Cloudflare Dashboard → R2 → Create bucket → "rma-images"
2. Bucket Settings → Public access → Allow
3. Copy public URL (e.g., https://pub-xxx.r2.dev)
```

Add to `wrangler.toml`:
```toml
[[r2_buckets]]
binding = "IMAGES"
bucket_name = "rma-images"
```

### Step 2: Upload API Endpoint
**File:** `functions/api/[[route]].ts`

```typescript
app.post("/admin/upload", async (c) => {
    // 1. Check auth
    // 2. Get file from form data
    // 3. Validate dimensions match required size (passed as query param)
    // 4. Generate unique filename
    // 5. Upload to R2: c.env.IMAGES.put(filename, file)
    // 6. Return public URL
});
```

### Step 3: ImageUpload Component
**File:** `client/src/components/ImageUpload.tsx`

Props:
- `currentUrl` - Show current image
- `requiredWidth` / `requiredHeight` - Enforce dimensions
- `onUpload(url)` - Callback with new URL

Features:
- Drag & drop or click to select
- Preview before upload
- Client-side dimension check (fast feedback)
- Shows upload progress
- Error message if wrong size

### Step 4: Add to Admin Pages

**AdminTeachers.tsx:**
```tsx
<ImageUpload
  currentUrl={teacher.imageUrl}
  requiredWidth={400}
  requiredHeight={400}
  onUpload={(url) => updateTeacher({ ...teacher, imageUrl: url })}
/>
```

**AdminClasses.tsx:** Same pattern, 800x600

**AdminPhotos.tsx:** New page for gallery management, 1200x800

**AdminSettings.tsx:** New page for hero images, 1920x1080

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `wrangler.toml` | Add R2 binding |
| `functions/api/[[route]].ts` | Add upload endpoint |
| `client/src/components/ImageUpload.tsx` | **NEW** - Reusable upload component |
| `client/src/pages/AdminTeachers.tsx` | Add ImageUpload to form |
| `client/src/pages/AdminClasses.tsx` | Add ImageUpload to form |
| `client/src/pages/AdminPhotos.tsx` | **NEW** - Gallery management |
| `client/src/pages/AdminSettings.tsx` | **NEW** - Hero images config |
| `shared/schema.ts` | Add `site_settings` table for hero images |

---

## Database Addition

```sql
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Hero images stored as:
-- key: "hero_home", value: "https://pub-xxx.r2.dev/hero-home.jpg"
-- key: "hero_classes", value: "https://pub-xxx.r2.dev/hero-classes.jpg"
```

---

## Order of Work

1. **You:** Create R2 bucket, add binding, deploy
2. **Me:** Create upload endpoint + ImageUpload component
3. **Me:** Add to AdminTeachers (test with one page first)
4. **Me:** Add AdminPhotos page
5. **Me:** Add AdminSettings for hero images
6. **Me:** Update frontend pages to use dynamic hero images

---

## What We're NOT Doing (keeping it simple)

- ❌ Image resizing/cropping (require correct size)
- ❌ Multiple file formats (accept jpg/png/webp only)
- ❌ Thumbnails (use CSS for sizing)
- ❌ Image optimization (Cloudflare handles this automatically)
- ❌ Drag-to-reorder (just use display_order number field)

---

## Ready?

1. Create the R2 bucket in Cloudflare dashboard
2. Add the binding to wrangler.toml
3. Tell me and I'll build the rest
