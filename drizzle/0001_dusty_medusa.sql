CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" varchar(255) NOT NULL,
	"customer_name" varchar(255) DEFAULT 'Visitor',
	"customer_email" varchar(255),
	"message" text NOT NULL,
	"is_admin" boolean DEFAULT false,
	"read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
