# Ralph Task Plan

JSON-formatted task list. Agent modifies ONLY `passes` field.

## Phase 1: Local Development

```json
{
  "id": "1.1",
  "category": "setup",
  "description": "Configure wrangler for local D1 database",
  "steps": [
    "Update wrangler.toml with [[d1_databases]] binding",
    "Add dev:full script to package.json",
    "Create local D1 database",
    "Verify /api/testimonials returns JSON"
  ],
  "passes": true
}
```

```json
{
  "id": "1.2",
  "category": "setup",
  "description": "Seed database with real data",
  "steps": [
    "Create drizzle/seed.ts",
    "Add 2 teachers (Hank, Brian)",
    "Add 3 locations",
    "Add 5 testimonials",
    "Add pnpm db:seed command"
  ],
  "passes": true
}
```

## Phase 2: Admin Authentication

```json
{
  "id": "2.1",
  "category": "feature",
  "description": "Add password protection middleware",
  "steps": [
    "Create .env.example with AUTH_PASSWORD",
    "Add Hono middleware for /api/admin/* routes",
    "Create POST /api/auth/login endpoint",
    "Create POST /api/auth/logout endpoint"
  ],
  "passes": true
}
```

```json
{
  "id": "2.2",
  "category": "feature",
  "description": "Build login page UI",
  "steps": [
    "Create /admin/login route",
    "Add password form with error handling",
    "Redirect to /admin on success",
    "Add logout button to AdminDashboard"
  ],
  "passes": true
}
```

## Phase 3: Admin CRUD Forms

```json
{
  "id": "3.1",
  "category": "feature",
  "description": "AdminTeachers CRUD",
  "steps": [
    "List all teachers in card view",
    "Add Teacher form dialog (name, bio, imageUrl, active)",
    "Edit button opens pre-filled form",
    "Delete button with confirmation",
    "Loading and error states"
  ],
  "passes": true
}
```

```json
{
  "id": "3.2",
  "category": "feature",
  "description": "AdminTestimonials CRUD",
  "steps": [
    "List all testimonials with star rating display",
    "Add Testimonial form (quote, author, source, stars, active)",
    "Star rating input component",
    "Edit and delete functionality"
  ],
  "passes": true
}
```

```json
{
  "id": "3.3",
  "category": "feature",
  "description": "AdminLocations CRUD",
  "steps": [
    "List locations with address",
    "Add Location form (name, address, lat, lng)",
    "Edit and delete functionality"
  ],
  "passes": true
}
```

```json
{
  "id": "3.4",
  "category": "feature",
  "description": "AdminClasses CRUD",
  "steps": [
    "List class types",
    "Add Class form (title, description, ageRange, duration, price, imageUrl)",
    "Price displayed as dollars (stored cents)",
    "Edit and delete functionality"
  ],
  "passes": true
}
```

```json
{
  "id": "3.5",
  "category": "feature",
  "description": "AdminSessions CRUD",
  "steps": [
    "List sessions with location and day/time",
    "Add Session form with dropdowns for class and location",
    "Date pickers for start/end",
    "Status dropdown (Open, Few Spots, Full, Waitlist)"
  ],
  "passes": false
}
```

```json
{
  "id": "3.6",
  "category": "feature",
  "description": "AdminPages content editor",
  "steps": [
    "List page content slugs",
    "Textarea editor for content field",
    "Form: slug (readonly), title, content",
    "Show last updated timestamp"
  ],
  "passes": false
}
```

## Phase 4: Public Pages

```json
{
  "id": "4.1",
  "category": "feature",
  "description": "Teachers page data integration",
  "steps": [
    "Fetch from /api/teachers",
    "Show loading spinner",
    "Display only active teachers",
    "Sort by displayOrder"
  ],
  "passes": false
}
```

```json
{
  "id": "4.2",
  "category": "feature",
  "description": "Classes/Schedule page improvements",
  "steps": [
    "Fetch sessions from /api/sessions",
    "Group by semester (date range)",
    "Tab navigation between semesters",
    "Active tab clearly highlighted"
  ],
  "passes": false
}
```
