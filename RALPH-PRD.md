# Rocky Mountain Aardvarks - Ralph Wiggum Build Plan

Build guide using autonomous Claude Code loops with clear completion criteria.

**Linear Project:** [Rocky Mountain Aardvarks Website](https://linear.app/overphlowtank/project/rocky-mountain-aardvarks-website-308508a0195b)

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

## Linear Issue Map

| Phase | Task | Linear ID | Description |
|-------|------|-----------|-------------|
| 1.1 | Wrangler D1 Setup | [OPT-97](https://linear.app/overphlowtank/issue/OPT-97) | Local dev environment |
| 1.2 | Seed Database | [OPT-98](https://linear.app/overphlowtank/issue/OPT-98) | Real data for dev |
| 2.1 | Auth Middleware | [OPT-99](https://linear.app/overphlowtank/issue/OPT-99) | Password protection |
| 2.2 | Login UI | [OPT-100](https://linear.app/overphlowtank/issue/OPT-100) | Admin login page |
| 3.1 | AdminTeachers | [OPT-101](https://linear.app/overphlowtank/issue/OPT-101) | Teacher CRUD |
| 3.2 | AdminTestimonials | [OPT-102](https://linear.app/overphlowtank/issue/OPT-102) | Testimonial CRUD |
| 3.3 | AdminLocations | [OPT-103](https://linear.app/overphlowtank/issue/OPT-103) | Location CRUD |
| 3.4 | AdminClasses | [OPT-104](https://linear.app/overphlowtank/issue/OPT-104) | Class CRUD |
| 3.5 | AdminSessions | [OPT-105](https://linear.app/overphlowtank/issue/OPT-105) | Session CRUD |
| 3.6 | AdminPages | [OPT-106](https://linear.app/overphlowtank/issue/OPT-106) | Content editor |
| 4.1 | Teachers Page | [OPT-107](https://linear.app/overphlowtank/issue/OPT-107) | Data integration |
| 4.2 | Classes Page | [OPT-108](https://linear.app/overphlowtank/issue/OPT-108) | Schedule + tabs |
| 4.3 | Locations Page | [OPT-109](https://linear.app/overphlowtank/issue/OPT-109) | Google Maps |
| 4.4 | About Page | [OPT-110](https://linear.app/overphlowtank/issue/OPT-110) | Our Story |
| - | Contact Page | [OPT-111](https://linear.app/overphlowtank/issue/OPT-111) | Contact form |
| - | Photo Gallery | [OPT-112](https://linear.app/overphlowtank/issue/OPT-112) | Gallery + admin |
| - | MailChimp | [OPT-113](https://linear.app/overphlowtank/issue/OPT-113) | Newsletter signup |
| 5.1 | Registration UI | [OPT-114](https://linear.app/overphlowtank/issue/OPT-114) | Registration form |
| 5.2 | Stripe (HITL) | [OPT-115](https://linear.app/overphlowtank/issue/OPT-115) | Payment checkout |
| 6 | Content Migration | [OPT-116](https://linear.app/overphlowtank/issue/OPT-116) | Import real data |

**Parent PRDs:**
- [OPT-96: Site Architecture & Navigation](https://linear.app/overphlowtank/issue/OPT-96) - UI/UX stories
- [OPT-78: MSS Integration Strategy](https://linear.app/overphlowtank/issue/OPT-78) - Registration/workflow stories

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

#### Task 1.1: Wrangler Local D1 Setup - [OPT-97](https://linear.app/overphlowtank/issue/OPT-97)
```
COMPLETION CRITERIA:
- [ ] wrangler.toml configured for local D1
- [ ] `pnpm dev:full` script runs wrangler + vite
- [ ] /api/testimonials returns data (seeded)
- [ ] /api/teachers returns data (seeded)
- [ ] No TypeScript errors
- [ ] pnpm check passes
```

#### Task 1.2: Seed Database with Real Data - [OPT-98](https://linear.app/overphlowtank/issue/OPT-98)
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

#### Task 2.1: Password Protection Middleware - [OPT-99](https://linear.app/overphlowtank/issue/OPT-99)
```
COMPLETION CRITERIA:
- [ ] AUTH_PASSWORD env var documented in .env.example
- [ ] Hono middleware checks for auth cookie on /api/admin/* routes
- [ ] POST /api/auth/login accepts password, sets secure cookie
- [ ] POST /api/auth/logout clears cookie
- [ ] Unauthorized requests return 401
- [ ] No hardcoded passwords in code
```

#### Task 2.2: Login Page UI - [OPT-100](https://linear.app/overphlowtank/issue/OPT-100)
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

#### Task 3.1: AdminTeachers CRUD - [OPT-101](https://linear.app/overphlowtank/issue/OPT-101)
**Enables:** [OPT-91](https://linear.app/overphlowtank/issue/OPT-91) (Instructors/About Page)
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

#### Task 3.2: AdminTestimonials CRUD - [OPT-102](https://linear.app/overphlowtank/issue/OPT-102)
**Enables:** [OPT-90](https://linear.app/overphlowtank/issue/OPT-90) (Testimonials & Social Proof)
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

#### Task 3.3: AdminLocations CRUD - [OPT-103](https://linear.app/overphlowtank/issue/OPT-103)
**Enables:** [OPT-82](https://linear.app/overphlowtank/issue/OPT-82) (Location Management)
```
COMPLETION CRITERIA:
- [ ] Lists all locations with address
- [ ] "Add Location" button opens form dialog
- [ ] Form fields: name (required), address (required), lat, lng
- [ ] Optional: Google Places autocomplete for address
- [ ] CRUD operations same pattern as above
- [ ] Map preview of location (optional)
```

#### Task 3.4: AdminClasses CRUD - [OPT-104](https://linear.app/overphlowtank/issue/OPT-104)
**Enables:** [OPT-84](https://linear.app/overphlowtank/issue/OPT-84) (Class Descriptions - 13 Years Out of Date)
```
COMPLETION CRITERIA:
- [ ] Lists all class types
- [ ] Form fields: title, description, ageRange, duration, price, imageUrl
- [ ] Price displayed as dollars (stored as cents)
- [ ] CRUD operations same pattern
```

#### Task 3.5: AdminSessions CRUD - [OPT-105](https://linear.app/overphlowtank/issue/OPT-105)
**Enables:** [OPT-80](https://linear.app/overphlowtank/issue/OPT-80) (Class Schedule Display)
```
COMPLETION CRITERIA:
- [ ] Lists all sessions with location and day/time
- [ ] Filter by semester/date range
- [ ] Form fields: classId (dropdown), locationId (dropdown), dayOfWeek, time, instructor, status, startDate, endDate
- [ ] Date pickers for start/end
- [ ] Status dropdown: Open, Few Spots, Full, Waitlist
- [ ] Inline status toggle for quick updates
```

#### Task 3.6: AdminPages Content Editor - [OPT-106](https://linear.app/overphlowtank/issue/OPT-106)
**Enables:** [OPT-92](https://linear.app/overphlowtank/issue/OPT-92) (Terms & Conditions)
```
COMPLETION CRITERIA:
- [ ] Lists all page content slugs
- [ ] Pre-seed slugs: our-story, refund-policy, our-classes, terms-conditions
- [ ] Rich text or markdown editor for content field
- [ ] Form fields: slug (readonly after create), title, content
- [ ] Preview button to see formatted output
- [ ] Last updated timestamp displayed
```

---

### Phase 4: Public Pages Polish (Ralph-Ready)

#### Task 4.1: Teachers Page Data Integration - [OPT-107](https://linear.app/overphlowtank/issue/OPT-107)
**Completes:** [OPT-91](https://linear.app/overphlowtank/issue/OPT-91) (Instructors/About Page)
```
COMPLETION CRITERIA:
- [ ] Fetches from /api/teachers
- [ ] Shows loading spinner while fetching
- [ ] Displays teachers sorted by displayOrder
- [ ] Only shows active=true teachers
- [ ] Teacher cards match design (photo, name, bio)
- [ ] Responsive grid layout
```

#### Task 4.2: Classes/Schedule Page - [OPT-108](https://linear.app/overphlowtank/issue/OPT-108)
**Completes:** [OPT-80](https://linear.app/overphlowtank/issue/OPT-80) (Class Schedule Display)
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

#### Task 4.3: Locations Page with Map - [OPT-109](https://linear.app/overphlowtank/issue/OPT-109)
**Completes:** [OPT-82](https://linear.app/overphlowtank/issue/OPT-82) (Location Management)
```
COMPLETION CRITERIA:
- [ ] Fetches from /api/locations
- [ ] Shows list of active locations
- [ ] Google Map with markers for each location
- [ ] Click marker shows location details
- [ ] Address links to Google Maps directions
- [ ] Responsive design
```

#### Task 4.4: About/Our Story Page - [OPT-110](https://linear.app/overphlowtank/issue/OPT-110)
```
COMPLETION CRITERIA:
- [ ] Route: /about or /our-story
- [ ] Fetches content from /api/content/our-story
- [ ] Renders markdown/HTML content
- [ ] Includes origin story and program philosophy
- [ ] Navigation link in Navbar
```

---

### Additional Features (Ralph-Ready)

#### Contact Page & Form - [OPT-111](https://linear.app/overphlowtank/issue/OPT-111)
**Implements:** [OPT-85](https://linear.app/overphlowtank/issue/OPT-85) (Contact Page - Broken)
```
COMPLETION CRITERIA:
- [ ] Route: /contact
- [ ] Contact form (name, email, phone, message, inquiry type)
- [ ] Form validation with zod
- [ ] Submit sends email or stores in DB
- [ ] Hank's contact info displayed (720-515-8275)
- [ ] Navigation link in Navbar
```

#### Photo Gallery - [OPT-112](https://linear.app/overphlowtank/issue/OPT-112)
**Implements:** [OPT-83](https://linear.app/overphlowtank/issue/OPT-83) (Photo Gallery - Cannot Access)
```
COMPLETION CRITERIA:
- [ ] Route: /gallery
- [ ] Grid layout with lightbox on click
- [ ] Categories/albums (Classes, Parties, Events)
- [ ] Lazy loading for performance
- [ ] Admin page for uploading/managing photos
```

#### MailChimp Newsletter Signup - [OPT-113](https://linear.app/overphlowtank/issue/OPT-113)
**Implements:** [OPT-86](https://linear.app/overphlowtank/issue/OPT-86) (Newsletter Signup)
```
COMPLETION CRITERIA:
- [ ] Newsletter signup form in footer
- [ ] Connects to MailChimp API or uses embed form
- [ ] Success/error messaging
- [ ] Double opt-in flow
```

---

### Phase 5: Registration Flow (Partial Ralph - HITL for Stripe)

#### Task 5.1: Registration Form UI - [OPT-114](https://linear.app/overphlowtank/issue/OPT-114)
**Related to:** [OPT-79](https://linear.app/overphlowtank/issue/OPT-79) (Registration & Enrollment Flow)
```
COMPLETION CRITERIA:
- [ ] Modal or page for registration
- [ ] Form fields: parentName, parentEmail, studentName, studentAge
- [ ] Session selector (pre-filled if coming from session card)
- [ ] Terms checkbox
- [ ] Form validation with zod
- [ ] Submit creates registration with status=Pending
```

#### Task 5.2: Stripe Checkout Integration (HITL Heavy) - [OPT-115](https://linear.app/overphlowtank/issue/OPT-115)
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

#### Task 6.1: Import Current Site Content - [OPT-116](https://linear.app/overphlowtank/issue/OPT-116)
```
COMPLETION CRITERIA:
- [ ] All 3 current locations imported (only 2 still operating)
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

**Linear:** [OPT-XXX](https://linear.app/overphlowtank/issue/OPT-XXX)

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

### Task 1.1: Wrangler Setup (OPT-97)
- 2026-01-14 22:00 - Started task
- 2026-01-14 22:15 - wrangler.toml configured
- 2026-01-14 22:30 - COMPLETE: Local D1 working

### Task 1.2: Seed Data (OPT-98)
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

*Ralph PRD ready. Start with Phase 1, Task 1.1 ([OPT-97](https://linear.app/overphlowtank/issue/OPT-97)).*
