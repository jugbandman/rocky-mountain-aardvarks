CREATE TABLE `classes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`age_range` text NOT NULL,
	`duration` text NOT NULL,
	`price` integer NOT NULL,
	`image_url` text
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`date` integer NOT NULL,
	`location` text,
	`image_url` text
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`address` text NOT NULL,
	`lat` real,
	`lng` real
);
--> statement-breakpoint
CREATE TABLE `page_content` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`updated_at` integer DEFAULT '"2026-01-08T02:07:42.873Z"'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `page_content_slug_unique` ON `page_content` (`slug`);--> statement-breakpoint
CREATE TABLE `registrations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` integer NOT NULL,
	`parent_name` text NOT NULL,
	`parent_email` text NOT NULL,
	`student_name` text NOT NULL,
	`student_age` integer NOT NULL,
	`payment_status` text DEFAULT 'Pending' NOT NULL,
	`created_at` integer DEFAULT '"2026-01-08T02:07:42.873Z"',
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`class_id` integer NOT NULL,
	`location_id` integer NOT NULL,
	`day_of_week` text NOT NULL,
	`time` text NOT NULL,
	`instructor` text NOT NULL,
	`status` text DEFAULT 'Open' NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `teachers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`bio` text NOT NULL,
	`image_url` text,
	`active` integer DEFAULT true,
	`display_order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quote` text NOT NULL,
	`author` text NOT NULL,
	`source` text,
	`stars` integer DEFAULT 5,
	`active` integer DEFAULT true
);
