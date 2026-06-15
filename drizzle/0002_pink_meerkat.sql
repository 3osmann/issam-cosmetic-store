CREATE TABLE "stories" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(20) NOT NULL DEFAULT 'image',
	"content" text NOT NULL,
	"duration" integer NOT NULL DEFAULT 1,
	"link" text,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL
);
