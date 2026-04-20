CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"accessTokenExpiresAt" timestamp with time zone,
	"refreshTokenExpiresAt" timestamp with time zone,
	"scope" text,
	"idToken" text,
	"password" text,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text,
	"message" text,
	"page" text,
	"created" timestamp with time zone,
	"updated" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "measurements" (
	"id" text PRIMARY KEY NOT NULL,
	"device" text,
	"ldr1" double precision,
	"ldr2" double precision,
	"temp" double precision,
	"batt" double precision,
	"timestamp" timestamp with time zone,
	"created" timestamp with time zone,
	"updated" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"customer" text,
	"product" text,
	"deployed" boolean,
	"lon" double precision,
	"lat" double precision,
	"label" text,
	"dev_eui" text,
	"created" timestamp with time zone,
	"updated" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text,
	"name" text,
	"price" double precision,
	"created" timestamp with time zone,
	"updated" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"token" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"image" text,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"password" text NOT NULL,
	"token_key" text NOT NULL,
	"email" text NOT NULL,
	"email_visibility" boolean,
	"verified" boolean,
	"first_name" text,
	"last_name" text,
	"avatar" text,
	"street" text,
	"number" text,
	"postcode" text,
	"city" text,
	"role" text,
	"created" timestamp with time zone,
	"updated" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_device_orders_id_fk" FOREIGN KEY ("device") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_users_id_fk" FOREIGN KEY ("customer") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_product_products_id_fk" FOREIGN KEY ("product") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_measurements_device_timestamp" ON "measurements" USING btree ("device","timestamp");--> statement-breakpoint
CREATE INDEX "idx_orders_dev_eui" ON "orders" USING btree ("dev_eui");--> statement-breakpoint
CREATE INDEX "idx_users_token_key" ON "users" USING btree ("token_key");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");