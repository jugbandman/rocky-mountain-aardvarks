import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const classes = sqliteTable("classes", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    ageRange: text("age_range").notNull(),
    duration: text("duration").notNull(),
    price: integer("price").notNull(), // Price in cents
    imageUrl: text("image_url"),
});

export const locations = sqliteTable("locations", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    address: text("address").notNull(),
    lat: real("lat"),
    lng: real("lng"),
});

export const sessions = sqliteTable("sessions", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    classId: integer("class_id").references(() => classes.id).notNull(),
    locationId: integer("location_id").references(() => locations.id).notNull(),
    dayOfWeek: text("day_of_week").notNull(),
    time: text("time").notNull(),
    instructor: text("instructor").notNull(),
    status: text("status").notNull().default("Open"), // Open, Few Spots Left, Full, Waitlist
    startDate: integer("start_date", { mode: "timestamp" }).notNull(),
    endDate: integer("end_date", { mode: "timestamp" }).notNull(),
});

export const registrations = sqliteTable("registrations", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    sessionId: integer("session_id").references(() => sessions.id).notNull(),
    parentName: text("parent_name").notNull(),
    parentEmail: text("parent_email").notNull(),
    studentName: text("student_name").notNull(),
    studentAge: integer("student_age").notNull(),
    paymentStatus: text("payment_status").notNull().default("Pending"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const teachers = sqliteTable("teachers", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    bio: text("bio").notNull(),
    imageUrl: text("image_url"),
    active: integer("active", { mode: "boolean" }).default(true),
    displayOrder: integer("display_order").default(0),
});

export const testimonials = sqliteTable("testimonials", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    quote: text("quote").notNull(),
    author: text("author").notNull(),
    source: text("source"), // e.g. "Google", "Yelp"
    stars: integer("stars").default(5),
    active: integer("active", { mode: "boolean" }).default(true),
});

export const pageContent = sqliteTable("page_content", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").unique().notNull(), // e.g. "our-story", "refund-policy"
    title: text("title").notNull(),
    content: text("content").notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const events = sqliteTable("events", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    date: integer("date", { mode: "timestamp" }).notNull(),
    location: text("location"),
    imageUrl: text("image_url"),
});

export const contactSubmissions = sqliteTable("contact_submissions", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    inquiryType: text("inquiry_type").notNull(),
    message: text("message").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const photos = sqliteTable("photos", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    imageUrl: text("image_url").notNull(),
    category: text("category").notNull(), // Classes, Parties, Events
    description: text("description"),
    displayOrder: integer("display_order").default(0),
    active: integer("active", { mode: "boolean" }).default(true),
    createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const newsletterSubscribers = sqliteTable("newsletter_subscribers", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").unique().notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const insertClassSchema = createInsertSchema(classes);
export const insertLocationSchema = createInsertSchema(locations);
export const insertSessionSchema = createInsertSchema(sessions);
export const insertRegistrationSchema = createInsertSchema(registrations);
export const insertTeacherSchema = createInsertSchema(teachers);
export const insertTestimonialSchema = createInsertSchema(testimonials);
export const insertPageContentSchema = createInsertSchema(pageContent);
export const insertEventSchema = createInsertSchema(events);
export const insertContactSchema = createInsertSchema(contactSubmissions);
export const insertPhotoSchema = createInsertSchema(photos);
export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers);

export type Class = typeof classes.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;
export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Teacher = typeof teachers.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type PageContent = typeof pageContent.$inferSelect;
export type Event = typeof events.$inferSelect;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
