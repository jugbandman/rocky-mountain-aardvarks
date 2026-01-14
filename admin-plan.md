# Admin Backdoor Implementation Plan

Hank needs autonomous access to update his business content. We will build a password-protected dashboard to manage the following:

## Proposed Changes

### Admin UI Components
- **[NEW] [AdminLayout.tsx](file:///Users/andycarlson/Documents/Coding/rocky-mountain-aardvarks/client/src/components/AdminLayout.tsx)**: Sidebar navigation for different management sections.
- **[NEW] [AdminDashboard.tsx](file:///Users/andycarlson/Documents/Coding/rocky-mountain-aardvarks/client/src/pages/AdminDashboard.tsx)**: Overview and quick stats.
- **[NEW] [AdminTeachers.tsx](file:///Users/andycarlson/Documents/Coding/rocky-mountain-aardvarks/client/src/pages/AdminTeachers.tsx)**: Add/Edit/Remove teacher bios and photos.
- **[NEW] [AdminTestimonials.tsx](file:///Users/andycarlson/Documents/Coding/rocky-mountain-aardvarks/client/src/pages/AdminTestimonials.tsx)**: Manage current student reviews.
- **[NEW] [AdminPages.tsx](file:///Users/andycarlson/Documents/Coding/rocky-mountain-aardvarks/client/src/pages/AdminPages.tsx)**: Edit text content for Refund Policy, Our Story, etc.

### Security
- **Simple Authentication**: For the free tier on Cloudflare, we will use a secret password environment variable and a session cookie/token check.

## Next Steps
1. Create the Admin pages and routing in `App.tsx`.
2. Implement CRUD logic in the Hono API for each category.
3. Build the forms using `react-hook-form` and `zod`.
