declare global {
    interface D1Database { }
}

import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { getDb } from "../../server/db";
import * as schema from "../../shared/schema";
import { eq } from "drizzle-orm";

type Bindings = {
    DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

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

export const onRequest = handle(app);
