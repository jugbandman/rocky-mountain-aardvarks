CREATE TABLE `photos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`image_url` text NOT NULL,
	`category` text NOT NULL,
	`description` text,
	`display_order` integer DEFAULT 0,
	`active` integer DEFAULT 1,
	`created_at` integer DEFAULT (unixepoch())
);
