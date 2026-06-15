CREATE TABLE IF NOT EXISTS "story_items" (
  "id" serial PRIMARY KEY,
  "story_id" integer NOT NULL REFERENCES "stories"("id") ON DELETE CASCADE,
  "type" varchar(20) NOT NULL DEFAULT 'image',
  "content" text NOT NULL,
  "caption" text,
  "sort_order" integer NOT NULL DEFAULT 0
);
