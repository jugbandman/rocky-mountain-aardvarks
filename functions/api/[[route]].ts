declare global {
    interface D1Database { }
}

import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { getDb } from "../../server/db";
import * as schema from "../../shared/schema";
import { eq } from "drizzle-orm";

type Bindings = {
    DB: D1Database;
    AUTH_PASSWORD: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

// Session cookie config
const SESSION_COOKIE = "admin_session";
const SESSION_TOKEN = "authenticated";

// Auth endpoints
app.post("/auth/login", async (c) => {
    const body = await c.req.json<{ password: string }>();
    const authPassword = c.env.AUTH_PASSWORD;

    if (!authPassword) {
        return c.json({ error: "AUTH_PASSWORD not configured" }, 500);
    }

    if (body.password === authPassword) {
        setCookie(c, SESSION_COOKIE, SESSION_TOKEN, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        return c.json({ success: true });
    }

    return c.json({ error: "Invalid password" }, 401);
});

app.post("/auth/logout", async (c) => {
    deleteCookie(c, SESSION_COOKIE, { path: "/" });
    return c.json({ success: true });
});

app.get("/auth/status", async (c) => {
    const session = getCookie(c, SESSION_COOKIE);
    return c.json({ authenticated: session === SESSION_TOKEN });
});

// Admin middleware - protects /api/admin/* routes
app.use("/admin/*", async (c, next) => {
    const session = getCookie(c, SESSION_COOKIE);
    if (session !== SESSION_TOKEN) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    await next();
});

// Admin CRUD routes (protected)
// Admin Teachers
app.get("/admin/teachers", async (c) => {
    const db = getDb(c.env.DB);
    const result = await db.select().from(schema.teachers).all();
    return c.json(result);
});

app.post("/admin/teachers", async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertTeacherSchema.parse(body);
    const result = await db.insert(schema.teachers).values(validated).returning().get();
    return c.json(result, 201);
});

app.put("/admin/teachers/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertTeacherSchema.parse(body);
    const result = await db.update(schema.teachers).set(validated).where(eq(schema.teachers.id, id)).returning().get();
    return c.json(result);
});

app.delete("/admin/teachers/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    await db.delete(schema.teachers).where(eq(schema.teachers.id, id)).run();
    return c.json({ success: true });
});

// Admin Locations
app.get("/admin/locations", async (c) => {
    const db = getDb(c.env.DB);
    const result = await db.select().from(schema.locations).all();
    return c.json(result);
});

app.post("/admin/locations", async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertLocationSchema.parse(body);
    const result = await db.insert(schema.locations).values(validated).returning().get();
    return c.json(result, 201);
});

app.put("/admin/locations/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertLocationSchema.parse(body);
    const result = await db.update(schema.locations).set(validated).where(eq(schema.locations.id, id)).returning().get();
    return c.json(result);
});

app.delete("/admin/locations/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    await db.delete(schema.locations).where(eq(schema.locations.id, id)).run();
    return c.json({ success: true });
});

// Admin Testimonials
app.get("/admin/testimonials", async (c) => {
    const db = getDb(c.env.DB);
    const result = await db.select().from(schema.testimonials).all();
    return c.json(result);
});

app.post("/admin/testimonials", async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertTestimonialSchema.parse(body);
    const result = await db.insert(schema.testimonials).values(validated).returning().get();
    return c.json(result, 201);
});

app.put("/admin/testimonials/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertTestimonialSchema.parse(body);
    const result = await db.update(schema.testimonials).set(validated).where(eq(schema.testimonials.id, id)).returning().get();
    return c.json(result);
});

app.delete("/admin/testimonials/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    await db.delete(schema.testimonials).where(eq(schema.testimonials.id, id)).run();
    return c.json({ success: true });
});

// Admin Classes
app.get("/admin/classes", async (c) => {
    const db = getDb(c.env.DB);
    const result = await db.select().from(schema.classes).all();
    return c.json(result);
});

app.post("/admin/classes", async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertClassSchema.parse(body);
    const result = await db.insert(schema.classes).values(validated).returning().get();
    return c.json(result, 201);
});

app.put("/admin/classes/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertClassSchema.parse(body);
    const result = await db.update(schema.classes).set(validated).where(eq(schema.classes.id, id)).returning().get();
    return c.json(result);
});

app.delete("/admin/classes/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    await db.delete(schema.classes).where(eq(schema.classes.id, id)).run();
    return c.json({ success: true });
});

// Admin Sessions
app.get("/admin/sessions", async (c) => {
    const db = getDb(c.env.DB);
    const result = await db.select({
        id: schema.sessions.id,
        classId: schema.sessions.classId,
        locationId: schema.sessions.locationId,
        dayOfWeek: schema.sessions.dayOfWeek,
        time: schema.sessions.time,
        instructor: schema.sessions.instructor,
        status: schema.sessions.status,
        startDate: schema.sessions.startDate,
        endDate: schema.sessions.endDate,
    }).from(schema.sessions).all();
    return c.json(result);
});

app.post("/admin/sessions", async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertSessionSchema.parse(body);
    const result = await db.insert(schema.sessions).values({
        ...validated,
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate)
    }).returning().get();
    return c.json(result, 201);
});

app.put("/admin/sessions/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertSessionSchema.parse(body);
    const result = await db.update(schema.sessions).set({
        ...validated,
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate)
    }).where(eq(schema.sessions.id, id)).returning().get();
    return c.json(result);
});

app.delete("/admin/sessions/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    await db.delete(schema.sessions).where(eq(schema.sessions.id, id)).run();
    return c.json({ success: true });
});

// Admin Page Content
app.get("/admin/content", async (c) => {
    const db = getDb(c.env.DB);
    const result = await db.select().from(schema.pageContent).all();
    return c.json(result);
});

app.post("/admin/content", async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertPageContentSchema.parse(body);
    const result = await db.insert(schema.pageContent).values(validated).returning().get();
    return c.json(result, 201);
});

app.put("/admin/content/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertPageContentSchema.parse(body);
    const result = await db.update(schema.pageContent).set({
        ...validated,
        updatedAt: new Date()
    }).where(eq(schema.pageContent.id, id)).returning().get();
    return c.json(result);
});

app.delete("/admin/content/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    await db.delete(schema.pageContent).where(eq(schema.pageContent.id, id)).run();
    return c.json({ success: true });
});

// Classes API
app.get("/classes", async (c) => {
    const db = getDb(c.env.DB);
    const result = await db.select().from(schema.classes).all();
    return c.json(result);
});

app.post("/classes", async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertClassSchema.parse(body);
    const result = await db.insert(schema.classes).values(validated).returning().get();
    return c.json(result, 201);
});

app.put("/classes/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertClassSchema.parse(body);
    const result = await db.update(schema.classes).set(validated).where(eq(schema.classes.id, id)).returning().get();
    return c.json(result);
});

app.delete("/classes/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    await db.delete(schema.classes).where(eq(schema.classes.id, id)).run();
    return c.json({ success: true });
});

// Locations API
app.get("/locations", async (c) => {
    const db = getDb(c.env.DB);
    const result = await db.select().from(schema.locations).all();
    return c.json(result);
});

app.post("/locations", async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertLocationSchema.parse(body);
    const result = await db.insert(schema.locations).values(validated).returning().get();
    return c.json(result, 201);
});

app.put("/locations/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertLocationSchema.parse(body);
    const result = await db.update(schema.locations).set(validated).where(eq(schema.locations.id, id)).returning().get();
    return c.json(result);
});

app.delete("/locations/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    await db.delete(schema.locations).where(eq(schema.locations.id, id)).run();
    return c.json({ success: true });
});

// Testimonials API
app.get("/testimonials", async (c) => {
    const db = getDb(c.env.DB);
    const category = c.req.query("category");

    if (category) {
        const result = await db.select().from(schema.testimonials)
            .where(eq(schema.testimonials.category, category))
            .all();
        return c.json(result);
    }

    const result = await db.select().from(schema.testimonials).all();
    return c.json(result);
});

app.post("/testimonials", async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertTestimonialSchema.parse(body);
    const result = await db.insert(schema.testimonials).values(validated).returning().get();
    return c.json(result, 201);
});

app.put("/testimonials/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertTestimonialSchema.parse(body);
    const result = await db.update(schema.testimonials).set(validated).where(eq(schema.testimonials.id, id)).returning().get();
    return c.json(result);
});

app.delete("/testimonials/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    await db.delete(schema.testimonials).where(eq(schema.testimonials.id, id)).run();
    return c.json({ success: true });
});

// Sessions API (Manual Join)
app.get("/sessions", async (c) => {
    const db = getDb(c.env.DB);
    const result = await db.select({
        id: schema.sessions.id,
        dayOfWeek: schema.sessions.dayOfWeek,
        time: schema.sessions.time,
        instructor: schema.sessions.instructor,
        status: schema.sessions.status,
        startDate: schema.sessions.startDate,
        endDate: schema.sessions.endDate,
        class: {
            id: schema.classes.id,
            title: schema.classes.title,
        },
        location: {
            id: schema.locations.id,
            name: schema.locations.name,
            address: schema.locations.address,
        }
    })
        .from(schema.sessions)
        .leftJoin(schema.classes, eq(schema.sessions.classId, schema.classes.id))
        .leftJoin(schema.locations, eq(schema.sessions.locationId, schema.locations.id))
        .all();
    return c.json(result);
});

app.post("/sessions", async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertSessionSchema.parse(body);
    const result = await db.insert(schema.sessions).values({
        ...validated,
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate)
    }).returning().get();
    return c.json(result, 201);
});

app.put("/sessions/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertSessionSchema.parse(body);
    const result = await db.update(schema.sessions).set({
        ...validated,
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate)
    }).where(eq(schema.sessions.id, id)).returning().get();
    return c.json(result);
});

app.delete("/sessions/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    await db.delete(schema.sessions).where(eq(schema.sessions.id, id)).run();
    return c.json({ success: true });
});

// Teachers API
app.get("/teachers", async (c) => {
    const db = getDb(c.env.DB);
    const result = await db.select().from(schema.teachers).all();
    return c.json(result);
});

app.post("/teachers", async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertTeacherSchema.parse(body);
    const result = await db.insert(schema.teachers).values(validated).returning().get();
    return c.json(result, 201);
});

app.put("/teachers/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertTeacherSchema.parse(body);
    const result = await db.update(schema.teachers).set(validated).where(eq(schema.teachers.id, id)).returning().get();
    return c.json(result);
});

app.delete("/teachers/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    await db.delete(schema.teachers).where(eq(schema.teachers.id, id)).run();
    return c.json({ success: true });
});


// Page Content API
app.get("/content/:slug", async (c) => {
    const slug = c.req.param("slug");
    const db = getDb(c.env.DB);
    const result = await db.select().from(schema.pageContent).where(eq(schema.pageContent.slug, slug)).get();
    if (!result) return c.json({ error: "Not found" }, 404);
    return c.json(result);
});

app.get("/content", async (c) => {
    const db = getDb(c.env.DB);
    const result = await db.select().from(schema.pageContent).all();
    return c.json(result);
});

app.post("/content", async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertPageContentSchema.parse(body);
    const result = await db.insert(schema.pageContent).values(validated).returning().get();
    return c.json(result, 201);
});

app.put("/content/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertPageContentSchema.parse(body);
    const result = await db.update(schema.pageContent).set({
        ...validated,
        updatedAt: new Date()
    }).where(eq(schema.pageContent.id, id)).returning().get();
    return c.json(result);
});

app.delete("/content/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    await db.delete(schema.pageContent).where(eq(schema.pageContent.id, id)).run();
    return c.json({ success: true });
});

// Registrations API (Post)
app.post("/registrations", async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertRegistrationSchema.parse(body);
    const result = await db.insert(schema.registrations).values(validated).returning().get();
    return c.json(result, 201);
});

// Contact API (stores contact form submissions)
app.post("/contact", async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertContactSchema.parse(body);
    const result = await db.insert(schema.contactSubmissions).values(validated).returning().get();
    return c.json(result, 201);
});

// Newsletter subscription API
app.post("/newsletter", async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json<{ email: string }>();

    if (!body.email || !body.email.includes("@")) {
        return c.json({ error: "Valid email is required" }, 400);
    }

    // Check if already subscribed
    const existing = await db.select().from(schema.newsletterSubscribers).where(eq(schema.newsletterSubscribers.email, body.email)).get();
    if (existing) {
        return c.json({ error: "Email already subscribed", alreadySubscribed: true }, 409);
    }

    const result = await db.insert(schema.newsletterSubscribers).values({ email: body.email }).returning().get();
    return c.json(result, 201);
});

// Photos API (public - only active photos)
app.get("/photos", async (c) => {
    const db = getDb(c.env.DB);
    const result = await db.select().from(schema.photos).where(eq(schema.photos.active, true)).all();
    return c.json(result);
});

// Admin Photos CRUD
app.get("/admin/photos", async (c) => {
    const db = getDb(c.env.DB);
    const result = await db.select().from(schema.photos).all();
    return c.json(result);
});

app.post("/admin/photos", async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertPhotoSchema.parse(body);
    const result = await db.insert(schema.photos).values(validated).returning().get();
    return c.json(result, 201);
});

app.put("/admin/photos/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const validated = schema.insertPhotoSchema.parse(body);
    const result = await db.update(schema.photos).set(validated).where(eq(schema.photos.id, id)).returning().get();
    return c.json(result);
});

app.delete("/admin/photos/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const db = getDb(c.env.DB);
    await db.delete(schema.photos).where(eq(schema.photos.id, id)).run();
    return c.json({ success: true });
});

// MainStreet Sync
const MAINSTREET_URL = "https://app.mainstreetsites.com/dmn2417/classes.aspx";

interface ParsedSession {
    sessionName: string;
    locationName: string;
    dayOfWeek: string;
    time: string;
    startDate: Date;
    duration: string;
    instructor: string;
    mainstreetUrl: string;
    mainstreetId: string;
}

function parseMainStreetHTML(html: string): ParsedSession[] {
    const sessions: ParsedSession[] = [];

    // Find session name from page (Spring 2026, Winter 2026, etc.)
    const sessionMatch = html.match(/(?:Spring|Summer|Fall|Winter)\s+\d{4}/i);
    const sessionName = sessionMatch ? sessionMatch[0] : 'Spring 2026';

    // Parse table rows - look for classTableItemTR rows (the actual class entries)
    // These have class="classTableItemTR tableRow dataRow" or "classTableItemTR tableRow altDataRow"
    const rowPattern = /<tr[^>]*class="classTableItemTR[^"]*"[^>]*>([\s\S]*?)<\/tr>/gi;
    const linkPattern = /href="(register\.aspx\?cls=\d+)"/i;

    let rowMatch;
    while ((rowMatch = rowPattern.exec(html)) !== null) {
        const rowHtml = rowMatch[1];
        const cells: string[] = [];

        // Extract cell contents from classTableItemTD cells
        const cellRegex = /<td[^>]*class="classTableItemTD"[^>]*>([\s\S]*?)<\/td>/gi;
        let cellMatch;
        while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
            // Strip HTML tags and decode entities
            const text = cellMatch[1]
                .replace(/<[^>]+>/g, ' ')
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/\s+/g, ' ')
                .trim();
            cells.push(text);
        }

        // Extract registration URL
        const linkMatch = rowHtml.match(linkPattern);
        const registerUrl = linkMatch ? linkMatch[1] : '';

        // Columns: Class/Location, Schedule, Start Date, Duration, Instructor, Register(empty)
        // Example: "Washington Park", "Tuesday 10:00 AM - 10:45 AM", "Mar 03, 2026", "10 weeks", "Hank Williams"
        if (cells.length >= 5) {
            const locationName = cells[0] || '';
            const schedule = cells[1] || '';
            const startDateStr = cells[2] || '';
            const duration = cells[3] || '';
            const instructor = cells[4] || '';

            // Parse schedule - format: "Tuesday 10:00 AM - 10:45 AM"
            const scheduleMatch = schedule.match(/(\w+)\s+(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
            const dayOfWeek = scheduleMatch ? scheduleMatch[1] : '';
            const time = scheduleMatch ? scheduleMatch[2] : '';

            // Parse start date - format: "Mar 03, 2026"
            let startDate = new Date();
            const dateMatch = startDateStr.match(/(\w+)\s+(\d{1,2}),?\s*(\d{4})/);
            if (dateMatch) {
                const monthStr = dateMatch[1];
                const day = parseInt(dateMatch[2]);
                const year = parseInt(dateMatch[3]);
                const monthMap: Record<string, number> = {
                    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
                    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
                };
                const month = monthMap[monthStr.toLowerCase().slice(0, 3)] ?? 0;
                startDate = new Date(year, month, day);
            }

            // Calculate end date based on duration
            const weeksMatch = duration.match(/(\d+)\s*weeks?/i);
            const weeks = weeksMatch ? parseInt(weeksMatch[1]) : 10;
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + (weeks * 7));

            // Generate unique ID using the class ID from register URL
            const classIdMatch = registerUrl.match(/cls=(\d+)/);
            const mainstreetId = classIdMatch ? `cls-${classIdMatch[1]}` : `${locationName}-${dayOfWeek}-${time}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            if (locationName && dayOfWeek && time) {
                sessions.push({
                    sessionName,
                    locationName,
                    dayOfWeek,
                    time,
                    startDate,
                    duration,
                    instructor: instructor || 'TBD',
                    mainstreetUrl: `https://app.mainstreetsites.com/dmn2417/${registerUrl}`,
                    mainstreetId
                });
            }
        }
    }

    return sessions;
}

app.post("/admin/sync-mainstreet", async (c) => {
    try {
        // Fetch MainStreet page with browser-like headers
        const response = await fetch(MAINSTREET_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            }
        });
        if (!response.ok) {
            return c.json({ error: `Failed to fetch MainStreet page: ${response.status} ${response.statusText}` }, 500);
        }

        const html = await response.text();
        const parsedSessions = parseMainStreetHTML(html);

        if (parsedSessions.length === 0) {
            // Debug: check what we can find
            const hasTable = html.includes('classTable');
            const hasItemRows = html.includes('classTableItemTR');
            const hasItemCells = html.includes('classTableItemTD');
            const rowMatches = html.match(/<tr[^>]*classTableItemTR[^>]*>/gi) || [];

            // Try to find the table section
            const tableStart = html.indexOf('id="ctl04_ctl00_phClassesClassTable"');
            const tableSample = tableStart > -1 ? html.slice(tableStart, tableStart + 3000) : 'table not found';

            return c.json({
                error: "No sessions found on MainStreet page",
                debug: {
                    hasTable,
                    hasItemRows,
                    hasItemCells,
                    rowMatchCount: rowMatches.length,
                    htmlLength: html.length,
                    tableSample
                }
            }, 400);
        }

        const db = getDb(c.env.DB);
        const now = new Date();
        let synced = 0;
        let errors: string[] = [];

        for (const session of parsedSessions) {
            try {
                // Check if session already exists by mainstreetId
                const existing = await db.select()
                    .from(schema.sessions)
                    .where(eq(schema.sessions.mainstreetId, session.mainstreetId))
                    .get();

                // Calculate end date
                const weeksMatch = session.duration.match(/(\d+)\s*weeks?/i);
                const weeks = weeksMatch ? parseInt(weeksMatch[1]) : 10;
                const endDate = new Date(session.startDate);
                endDate.setDate(endDate.getDate() + (weeks * 7));

                if (existing) {
                    // Update existing session
                    await db.update(schema.sessions)
                        .set({
                            locationName: session.locationName,
                            dayOfWeek: session.dayOfWeek,
                            time: session.time,
                            instructor: session.instructor,
                            startDate: session.startDate,
                            endDate: endDate,
                            sessionName: session.sessionName,
                            duration: session.duration,
                            mainstreetUrl: session.mainstreetUrl,
                            syncedAt: now,
                        })
                        .where(eq(schema.sessions.id, existing.id))
                        .run();
                } else {
                    // Insert new session
                    await db.insert(schema.sessions)
                        .values({
                            locationName: session.locationName,
                            dayOfWeek: session.dayOfWeek,
                            time: session.time,
                            instructor: session.instructor,
                            status: "Open",
                            startDate: session.startDate,
                            endDate: endDate,
                            sessionName: session.sessionName,
                            duration: session.duration,
                            mainstreetUrl: session.mainstreetUrl,
                            mainstreetId: session.mainstreetId,
                            syncedAt: now,
                        })
                        .run();
                }
                synced++;
            } catch (err) {
                errors.push(`Failed to sync ${session.mainstreetId}: ${err}`);
            }
        }

        return c.json({
            success: true,
            synced,
            total: parsedSessions.length,
            errors: errors.length > 0 ? errors : undefined,
            timestamp: now.toISOString()
        });

    } catch (err) {
        return c.json({ error: `Sync failed: ${err}` }, 500);
    }
});

// Debug endpoint to test MainStreet fetch
app.get("/admin/debug-mainstreet", async (c) => {
    try {
        const response = await fetch(MAINSTREET_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html',
            }
        });
        const html = await response.text();
        const hasTable = html.includes('classTable');
        const hasItemRows = html.includes('classTableItemTR');
        const rowMatches = html.match(/<tr[^>]*class="classTableItemTR[^"]*"[^>]*>/gi) || [];

        return c.json({
            status: response.status,
            contentType: response.headers.get('content-type'),
            htmlLength: html.length,
            hasTable,
            hasItemRows,
            rowMatchCount: rowMatches.length,
            firstRows: rowMatches.slice(0, 2),
            htmlSample: html.slice(0, 1000)
        });
    } catch (err) {
        return c.json({ error: String(err) }, 500);
    }
});

// Public endpoint to get sync status
app.get("/sync-status", async (c) => {
    const db = getDb(c.env.DB);
    const latest = await db.select()
        .from(schema.sessions)
        .where(eq(schema.sessions.mainstreetId, schema.sessions.mainstreetId)) // Has mainstreetId = synced
        .limit(1)
        .get();

    return c.json({
        lastSync: latest?.syncedAt || null,
        hasSyncedData: !!latest?.mainstreetId
    });
});

export const onRequest = handle(app);
