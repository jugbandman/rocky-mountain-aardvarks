# Rocky Mountain Aardvarks - Ownership Migration Plan

## Current State (Andy's Cloudflare)

| Component | Location | Notes |
|-----------|----------|-------|
| Domain | Cloudflare (Andy) | rockymtnaardvarks.com |
| Hosting | Cloudflare Pages (Andy) | Free tier |
| Database | Cloudflare D1 (Andy) | Free tier |
| Images | Static in repo | `/client/public/images/` |
| Code | GitHub (jugbandman) | Andy's account |

---

## Phase 1: NOW (Ship on Andy's Account)

**Image Management:**
- Admin selects from existing images in `/public/images/`
- No upload functionality yet
- Add new images via git commit (Andy does this)

**Class Sync:**
- MainStreet scraper runs on Andy's Cloudflare
- Calendar view on Classes page

**What Hank Can Do:**
- Edit teachers, testimonials, page content
- Select hero images from existing library
- Manage gallery display order
- Trigger MainStreet sync

**What Hank Can't Do (Yet):**
- Upload new images (must ask Andy)
- Access Cloudflare dashboard
- Manage DNS/domain

---

## Phase 2: MIGRATION (Move to Hank's Cloudflare)

### Prerequisites
1. Hank creates Cloudflare account
2. Hank adds payment method (for domain, optional for services)
3. Hank creates GitHub account (or we transfer repo)

### Migration Steps

#### Step 1: Transfer Domain (15 min)
```
Andy's Cloudflare → Hank's Cloudflare
1. Andy initiates domain transfer
2. Hank accepts in his dashboard
3. Update nameservers if needed
```

#### Step 2: Create New Cloudflare Pages Project (10 min)
```
1. Hank connects GitHub repo (or fork)
2. Create new Pages project "rma-production"
3. Set build command: pnpm build
4. Set output directory: dist/public
```

#### Step 3: Create D1 Database (10 min)
```
1. Create database "rma-database" in Hank's account
2. Run all migrations
3. Export data from Andy's D1 → Import to Hank's D1
```

#### Step 4: Create R2 Bucket (5 min)
```
1. Create bucket "rma-images"
2. Enable public access
3. Upload existing images from /public/images/
4. Update image URLs in database
```

#### Step 5: Update Bindings (5 min)
```
wrangler.toml:
- Update D1 database_id
- Add R2 bucket binding
```

#### Step 6: Set Secrets (2 min)
```
wrangler secret put AUTH_PASSWORD
```

#### Step 7: Deploy & Test (15 min)
```
1. Deploy to Hank's Pages
2. Test all functionality
3. Verify MainStreet sync works
4. Verify admin login
```

#### Step 8: DNS Cutover (5 min)
```
1. Update DNS to point to Hank's Pages
2. Verify SSL works
3. Old site stops receiving traffic
```

**Total Migration Time: ~1-2 hours**

---

## Phase 3: POST-MIGRATION (Enable Full Features)

Once on Hank's Cloudflare with R2:

### Image Uploads
- Enable drag-drop upload in admin
- Upload to R2, store URLs in D1
- Hank fully self-sufficient for images

### Enhanced Admin
- Image cropping/resizing (if needed)
- Bulk photo upload for gallery
- Hero image management per page

---

## Future Enhancements Roadmap

### Near-Term (Post-Migration)
| Feature | Effort | Description |
|---------|--------|-------------|
| Image uploads | 1 day | R2 upload + admin UI |
| Gallery management | 0.5 day | Reorder, categories, bulk upload |
| Hero image admin | 0.5 day | Pick hero images per page |

### Medium-Term
| Feature | Effort | Description |
|---------|--------|-------------|
| Email notifications | 1 day | Contact form → email to Hank |
| SEO improvements | 0.5 day | Meta tags, sitemap, structured data |
| Analytics dashboard | 0.5 day | Simple page view stats |
| Blog/News section | 1-2 days | Announcements, updates |

### Long-Term / Nice-to-Have
| Feature | Effort | Description |
|---------|--------|-------------|
| Online payments | 3-5 days | Stripe for drop-ins (if MainStreet ever dropped) |
| Parent portal | 5+ days | Login, view enrolled classes, history |
| Waitlist automation | 2 days | Auto-notify when spot opens |
| Multi-language | 2 days | Spanish support |

---

## Cost Comparison

### Current (Andy's Account)
| Service | Cost |
|---------|------|
| Cloudflare Pages | Free |
| Cloudflare D1 | Free |
| Domain | ~$10/year |
| **Total** | **~$10/year** |

### After Migration (Hank's Account)
| Service | Cost |
|---------|------|
| Cloudflare Pages | Free |
| Cloudflare D1 | Free |
| Cloudflare R2 | Free (under 10GB) |
| Domain | ~$10/year |
| Workers (if needed) | Free tier or $5/mo |
| **Total** | **$10-70/year** |

---

## Handoff Checklist

When ready to migrate:

- [ ] Hank has Cloudflare account
- [ ] Hank has GitHub access (or repo transferred)
- [ ] Export D1 data from Andy's account
- [ ] Document admin password
- [ ] Schedule 1-hour migration window
- [ ] Test on Hank's account before DNS switch
- [ ] Verify MainStreet sync works
- [ ] Verify all admin functions
- [ ] Update any hardcoded URLs
- [ ] DNS cutover
- [ ] Monitor for 24 hours
- [ ] Close out Andy's resources

---

## Support Model

### During Andy's Ownership
- Andy handles all infrastructure
- Andy deploys code changes
- Andy adds new images to repo
- Hank manages content via admin

### After Migration
**Option A: Hank Self-Sufficient**
- Hank manages everything
- Andy available for paid consulting

**Option B: Ongoing Support Contract**
- Monthly retainer for updates/fixes
- Priority response for issues
- Quarterly feature reviews

---

## Files Updated for This Plan

| File | Purpose |
|------|---------|
| `PLAN-ownership-migration.md` | This document |
| `PLAN-image-uploads.md` | Image upload feature (post-migration) |
| `PLAN-mainstreet-sync.md` | Class sync + calendar |

---

## Next Steps

1. **NOW:** Build with "select from existing images" approach
2. **NOW:** Build MainStreet sync + calendar
3. **LATER:** When Hank ready, execute migration
4. **LATER:** Enable R2 uploads on Hank's account
