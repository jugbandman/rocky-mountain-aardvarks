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

export const onRequest = handle(app);
