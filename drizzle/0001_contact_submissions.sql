CREATE TABLE `contact_submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`inquiry_type` text NOT NULL,
	`message` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch())
);
