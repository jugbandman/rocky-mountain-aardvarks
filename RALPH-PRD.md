# Rocky Mountain Aardvarks - Ralph Wiggum Build Plan

Build guide using autonomous Claude Code loops with clear completion criteria.

---

## Philosophy

From the Ralph Wiggum Technique:

> "Ralph is very good at making playgrounds, but he comes home bruised because he fell off the slide, so one then tunes Ralph by adding a sign next to the slide saying 'SLIDE DOWN, DON'T JUMP, LOOK AROUND.'"

**Key Principles:**
1. **Clear completion criteria** - "All tests passing" not "make it better"
2. **Small scope** - One feature, one task
3. **End-to-end** - Build vertically, not layer by layer
4. **Feedback loops** - Lint/type checks must pass before commit
5. **Progress tracking** - Commit often, append to progress.txt

---

## Build Order

### Phase 0: Foundation (HITL - Human Required)

These decisions are already made. Documented here for context.

| Decision | Choice |
|----------|--------|
| Tech stack | React, Vite, Hono, Cloudflare Pages |
| Database | Cloudflare D1 (SQLite via Drizzle) |
| UI Framework | shadcn/ui + TailwindCSS 4 |
| Auth model | Simple password (env var) + cookie |
| Payment | Stripe (future phase) |

---

### Phase 1: Local Development Environment (Ralph-Ready)

#### Task 1.1: Wrangler Local D1 Setup
```
COMPLETION CRITERIA:
- [ ] wrangler.toml configured for local D1
- [ ] `pnpm dev:full` script runs wrangler + vite
- [ ] /api/testimonials returns data (seeded)
- [ ] /api/teachers returns data (seeded)
- [ ] No TypeScript errors
- [ ] pnpm check passes
```

#### Task 1.2: Seed Database with Real Data
```
COMPLETION CRITERIA:
- [ ] drizzle/seed.ts file created
- [ ] Seed includes: 2 teachers (Hank, Brian)
- [ ] Seed includes: 3 locations (Cherry Creek, Wash Park, Cherry Hills)
- [ ] Seed includes: 5 testimonials (from current site)
- [ ] Seed includes: 1 class type (Music for Aardvarks)
- [ ] Seed includes: 3 sessions (Winter 2026)
- [ ] `pnpm db:seed` command works
- [ ] API endpoints return seeded data
```

---

### Phase 2: Admin Authentication (Ralph-Ready)

#### Task 2.1: Password Protection Middleware
```
COMPLETION CRITERIA:
- [ ] AUTH_PASSWORD env var documented in .env.example
- [ ] Hono middleware checks for auth cookie on /api/admin/* routes
- [ ] POST /api/auth/login accepts password, sets secure cookie
- [ ] POST /api/auth/logout clears cookie
- [ ] Unauthorized requests return 401
- [ ] No hardcoded passwords in code
```

#### Task 2.2: Login Page UI
```
COMPLETION CRITERIA:
- [ ] /admin redirects to /admin/login if not authenticated
- [ ] Login form with password input
- [ ] Error message on wrong password
- [ ] Redirect to /admin/dashboard on success
- [ ] "Logout" button in AdminDashboard header
- [ ] Works on mobile
```

---

### Phase 3: Admin CRUD Forms (Ralph-Ready)

Each admin page needs: list view, create form, edit form, delete confirmation.

#### Task 3.1: AdminTeachers CRUD
```
COMPLETION CRITERIA:
- [ ] Lists all teachers in card/table view
- [ ] "Add Teacher" button opens form dialog
- [ ] Form fields: name (required), bio (textarea), imageUrl, active, displayOrder
- [ ] Form validates with zod schema
- [ ] POST /api/teachers creates new teacher
- [ ] "Edit" button on each card opens pre-filled form
- [ ] PUT /api/teachers/:id updates teacher
- [ ] "Delete" button shows confirmation dialog
- [ ] DELETE /api/teachers/:id removes teacher
- [ ] Optimistic UI updates or refetch after mutation
- [ ] Loading states shown during API calls
- [ ] Error toast on failure
```

#### Task 3.2: AdminTestimonials CRUD
```
COMPLETION CRITERIA:
- [ ] Lists all testimonials in card view
- [ ] "Add Testimonial" button opens form dialog
- [ ] Form fields: quote (required), author (required), source, stars (1-5), active
- [ ] Star rating input component
- [ ] POST /api/testimonials creates new
- [ ] Edit and delete functionality (same as Teachers)
- [ ] Shows star rating visually in list
```

#### Task 3.3: AdminLocations CRUD
```
COMPLETION CRITERIA:
- [ ] Lists all locations with address
- [ ] "Add Location" button opens form dialog
- [ ] Form fields: name (required), address (required), lat, lng
- [ ] Optional: Google Places autocomplete for address
- [ ] CRUD operations same pattern as above
- [ ] Map preview of location (optional)
```

#### Task 3.4: AdminClasses CRUD
```
COMPLETION CRITERIA:
- [ ] Lists all class types
- [ ] Form fields: title, description, ageRange, duration, price, imageUrl
- [ ] Price displayed as dollars (stored as cents)
- [ ] CRUD operations same pattern
```

#### Task 3.5: AdminSessions CRUD
```
COMPLETION CRITERIA:
- [ ] Lists all sessions with location and day/time
- [ ] Filter by semester/date range
- [ ] Form fields: classId (dropdown), locationId (dropdown), dayOfWeek, time, instructor, status, startDate, endDate
- [ ] Date pickers for start/end
- [ ] Status dropdown: Open, Few Spots, Full, Waitlist
- [ ] Inline status toggle for quick updates
```

#### Task 3.6: AdminPages Content Editor
```
COMPLETION CRITERIA:
- [ ] Lists all page content slugs
- [ ] Pre-seed slugs: our-story, refund-policy, our-classes
- [ ] Rich text or markdown editor for content field
- [ ] Form fields: slug (readonly after create), title, content
- [ ] Preview button to see formatted output
- [ ] Last updated timestamp displayed
```

---

### Phase 4: Public Pages Polish (Ralph-Ready)

#### Task 4.1: Teachers Page Data Integration
```
COMPLETION CRITERIA:
- [ ] Fetches from /api/teachers
- [ ] Shows loading spinner while fetching
- [ ] Displays teachers sorted by displayOrder
- [ ] Only shows active=true teachers
- [ ] Teacher cards match design (photo, name, bio)
- [ ] Responsive grid layout
```

#### Task 4.2: Classes/Schedule Page
```
COMPLETION CRITERIA:
- [ ] Fetches sessions from /api/sessions
- [ ] Groups by semester (startDate range)
- [ ] Tab navigation between semesters
- [ ] Active tab clearly highlighted (per Hank's feedback)
- [ ] Shows: location, day, time, instructor, status
- [ ] "Register" button per session
- [ ] Status badges (Open = green, Full = red, etc.)
```

#### Task 4.3: Locations Page with Map
```
COMPLETION CRITERIA:
- [ ] Fetches from /api/locations
- [ ] Shows list of active locations
- [ ] Google Map with markers for each location
- [ ] Click marker shows location details
- [ ] Address links to Google Maps directions
- [ ] Responsive design
```

#### Task 4.4: About/Our Story Page
```
COMPLETION CRITERIA:
- [ ] Route: /about or /our-story
- [ ] Fetches content from /api/content/our-story
- [ ] Renders markdown/HTML content
- [ ] Includes origin story and program philosophy
- [ ] Navigation link in Navbar
```

---

### Phase 5: Registration Flow (Partial Ralph - HITL for Stripe)

#### Task 5.1: Registration Form UI
```
COMPLETION CRITERIA:
- [ ] Modal or page for registration
- [ ] Form fields: parentName, parentEmail, studentName, studentAge
- [ ] Session selector (pre-filled if coming from session card)
- [ ] Terms checkbox
- [ ] Form validation with zod
- [ ] Submit creates registration with status=Pending
```

#### Task 5.2: Stripe Checkout Integration (HITL Heavy)
```
COMPLETION CRITERIA:
- [ ] Stripe publishable key in env
- [ ] POST /api/checkout creates Stripe session
- [ ] Redirect to Stripe hosted checkout
- [ ] Webhook endpoint for payment confirmation
- [ ] Update registration status on success
- [ ] Confirmation page/email
```

---

### Phase 6: Content Migration (Manual + Ralph)

#### Task 6.1: Import Current Site Content
```
COMPLETION CRITERIA:
- [ ] All 3 current locations imported
- [ ] Both teacher bios imported (Hank, Brian)
- [ ] 5+ real testimonials imported
- [ ] Our Story content imported
- [ ] Refund policy imported
- [ ] Real photos added to /public
```

---

## PROMPT.md Template

Use this format for each Ralph task:

```markdown
# Task: [TASK NAME]

## Context
You are building the Rocky Mountain Aardvarks website. This is a React + Hono + Cloudflare D1 project.

## Prior Work
- Project status: See PROJECT-STATUS.md
- Previous tasks completed: [list]

## Requirements
[Copy completion criteria from above]

## Technical Constraints
- React 19 with TypeScript strict
- Use existing shadcn/ui components from client/src/components/ui/
- Use react-hook-form + zod for forms
- Use useApi hook for GET requests
- Use fetch for mutations (POST/PUT/DELETE)
- Match existing code style (see client/src/pages/Home.tsx)

## Files to Create/Modify
- [ ] client/src/pages/[file].tsx
- [ ] functions/api/[[route]].ts (if API changes needed)

## Success Metric
All completion criteria checked AND pnpm check passes AND pnpm dev runs without errors.

## DO NOT
- Commit if type errors exist
- Add new dependencies without approval
- Modify unrelated files
- Skip loading/error states
- Use inline styles (use Tailwind)

## Progress Tracking
Append progress to `progress.txt` after each significant step.
Commit after each criterion is met.
```

---

## Recommended Ralph Settings

```bash
# Conservative start for new task types
ralph-loop "Task description" --max-iterations 15

# After task pattern is proven
ralph-loop "Task description" --max-iterations 30

# Never exceed without human review
ralph-loop "Task description" --max-iterations 50
```

**Estimated costs:**
- Phase 1 (Dev Setup): ~$10-20
- Phase 2 (Auth): ~$15-25
- Phase 3 (Admin CRUD): ~$40-60 (largest phase)
- Phase 4 (Public Polish): ~$20-30
- Phase 5 (Registration): ~$30-50 (Stripe complexity)
- Phase 6 (Migration): ~$10-15

**Total estimate:** $125-200

---

## What NOT to Ralph

| Task | Why |
|------|-----|
| Stripe webhook logic | Security-critical, needs human review |
| Environment variables | Secrets handling |
| Database migrations in prod | Irreversible |
| Design decisions | Taste-based |
| Price/business logic | Business rules |

---

## Progress Tracking Template

Create `progress.txt` in project root:

```
# Progress: Rocky Mountain Aardvarks

## Phase 1: Local Dev

### Task 1.1: Wrangler Setup
- 2026-01-14 22:00 - Started task
- 2026-01-14 22:15 - wrangler.toml configured
- 2026-01-14 22:30 - COMPLETE: Local D1 working

### Task 1.2: Seed Data
- ...
```

---

## Quick Start Commands

```bash
# Development
pnpm dev                    # Frontend only (API fails)
pnpm dev:full               # Full stack with wrangler (after Phase 1)

# Database
pnpm db:push                # Push schema to D1
pnpm db:seed                # Run seed script
pnpm db:studio              # Open Drizzle Studio

# Checks
pnpm check                  # TypeScript check
pnpm format                 # Prettier

# Build
pnpm build                  # Production build
```

---

*Ralph PRD ready. Start with Phase 1, Task 1.1.*
