# Ralph Task Plan

JSON-formatted task list. Agent modifies ONLY `passes` field.

## Phase 1: Local Development (COMPLETE)

```json
{
  "id": "1.1",
  "linear": "OPT-97",
  "category": "setup",
  "description": "Configure wrangler for local D1 database",
  "passes": true
}
```

```json
{
  "id": "1.2",
  "linear": "OPT-98",
  "category": "setup",
  "description": "Seed database with real data",
  "passes": true
}
```

## Phase 2: Admin Authentication (COMPLETE)

```json
{
  "id": "2.1",
  "linear": "OPT-99",
  "category": "feature",
  "description": "Add password protection middleware",
  "passes": true
}
```

```json
{
  "id": "2.2",
  "linear": "OPT-100",
  "category": "feature",
  "description": "Build login page UI",
  "passes": true
}
```

## Phase 3: Admin CRUD Forms (COMPLETE)

```json
{
  "id": "3.1",
  "linear": "OPT-101",
  "category": "feature",
  "description": "AdminTeachers CRUD",
  "passes": true
}
```

```json
{
  "id": "3.2",
  "linear": "OPT-102",
  "category": "feature",
  "description": "AdminTestimonials CRUD",
  "passes": true
}
```

```json
{
  "id": "3.3",
  "linear": "OPT-103",
  "category": "feature",
  "description": "AdminLocations CRUD",
  "passes": true
}
```

```json
{
  "id": "3.4",
  "linear": "OPT-104",
  "category": "feature",
  "description": "AdminClasses CRUD",
  "passes": true
}
```

```json
{
  "id": "3.5",
  "linear": "OPT-105",
  "category": "feature",
  "description": "AdminSessions CRUD",
  "passes": true
}
```

```json
{
  "id": "3.6",
  "linear": "OPT-106",
  "category": "feature",
  "description": "AdminPages content editor",
  "passes": true
}
```

## Phase 4: Public Pages (PARTIAL)

```json
{
  "id": "4.1",
  "linear": "OPT-107",
  "category": "feature",
  "description": "Teachers page data integration",
  "passes": true
}
```

```json
{
  "id": "4.2",
  "linear": "OPT-108",
  "category": "feature",
  "description": "Classes/Schedule page improvements",
  "passes": true
}
```

```json
{
  "id": "4.3",
  "linear": "OPT-109",
  "category": "feature",
  "description": "Locations page with Google Map",
  "steps": [
    "Fetch from /api/locations",
    "Show list of active locations",
    "Add Google Map with markers for each location",
    "Click marker shows location details",
    "Address links to Google Maps directions"
  ],
  "passes": true
}
```

```json
{
  "id": "4.4",
  "linear": "OPT-110",
  "category": "feature",
  "description": "About/Our Story page",
  "steps": [
    "Create /about or /our-story route",
    "Fetch content from /api/content/our-story",
    "Render markdown/HTML content",
    "Add navigation link in Navbar"
  ],
  "passes": true
}
```

## Phase 5: Additional Features

```json
{
  "id": "5.1",
  "linear": "OPT-111",
  "category": "feature",
  "description": "Contact page with form",
  "steps": [
    "Create /contact route",
    "Build contact form (name, email, phone, message, inquiry type)",
    "Form validation with zod",
    "Display Hank's contact info (720-515-8275)",
    "Add navigation link in Navbar"
  ],
  "passes": false
}
```

```json
{
  "id": "5.2",
  "linear": "OPT-112",
  "category": "feature",
  "description": "Photo gallery page",
  "steps": [
    "Create /gallery route",
    "Grid layout with lightbox on click",
    "Categories/albums (Classes, Parties, Events)",
    "Lazy loading for performance",
    "Add navigation link in Navbar"
  ],
  "passes": false
}
```

```json
{
  "id": "5.3",
  "linear": "OPT-113",
  "category": "feature",
  "description": "MailChimp newsletter signup",
  "steps": [
    "Add newsletter signup form in footer",
    "Connect to MailChimp (embed form or API)",
    "Success/error messaging"
  ],
  "passes": false
}
```

## Phase 6: Registration Flow

```json
{
  "id": "6.1",
  "linear": "OPT-114",
  "category": "feature",
  "description": "Registration form UI",
  "steps": [
    "Create registration modal or page",
    "Form fields: parentName, parentEmail, studentName, studentAge",
    "Session selector (pre-filled from session card)",
    "Terms checkbox",
    "Form validation with zod",
    "Submit creates registration with status=Pending"
  ],
  "passes": false
}
```

```json
{
  "id": "6.2",
  "linear": "OPT-115",
  "category": "feature",
  "description": "Stripe checkout integration (HITL)",
  "steps": [
    "Add Stripe publishable key to env",
    "Create POST /api/checkout endpoint",
    "Redirect to Stripe hosted checkout",
    "Create webhook endpoint for payment confirmation",
    "Update registration status on success"
  ],
  "passes": false
}
```

## Phase 7: Content Migration

```json
{
  "id": "7.1",
  "linear": "OPT-116",
  "category": "content",
  "description": "Import current site content",
  "steps": [
    "Import real locations (only 2 still operating)",
    "Import teacher bios (Hank, Brian)",
    "Import 5+ real testimonials",
    "Import Our Story content",
    "Import refund policy",
    "Add real photos to /public"
  ],
  "passes": false
}
```
