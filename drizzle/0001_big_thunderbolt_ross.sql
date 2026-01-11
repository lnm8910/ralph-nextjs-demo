ALTER TABLE `notes` ADD `is_checklist` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `notes` ADD `checklist_items` text;