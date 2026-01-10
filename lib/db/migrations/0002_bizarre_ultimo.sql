CREATE TYPE "public"."alignment" AS ENUM('left', 'center', 'right');--> statement-breakpoint
CREATE TYPE "public"."animation" AS ENUM('none', 'fade', 'slide', 'scale');--> statement-breakpoint
CREATE TYPE "public"."avatar_shape" AS ENUM('circle', 'square', 'rounded');--> statement-breakpoint
CREATE TYPE "public"."avatar_size" AS ENUM('small', 'medium', 'large');--> statement-breakpoint
CREATE TYPE "public"."background_type" AS ENUM('solid', 'gradient', 'image');--> statement-breakpoint
CREATE TYPE "public"."bg_position" AS ENUM('cover', 'contain', 'center');--> statement-breakpoint
CREATE TYPE "public"."button_style" AS ENUM('solid', 'outline', 'ghost');--> statement-breakpoint
CREATE TYPE "public"."device_type" AS ENUM('desktop', 'mobile', 'tablet');--> statement-breakpoint
CREATE TYPE "public"."gradient_type" AS ENUM('linear', 'radial');--> statement-breakpoint
CREATE TYPE "public"."icon_position" AS ENUM('left', 'right', 'none');--> statement-breakpoint
CREATE TYPE "public"."icon_size" AS ENUM('small', 'medium', 'large');--> statement-breakpoint
CREATE TYPE "public"."image_position" AS ENUM('left', 'right', 'background');--> statement-breakpoint
CREATE TYPE "public"."image_size" AS ENUM('small', 'medium', 'large');--> statement-breakpoint
CREATE TYPE "public"."layout" AS ENUM('vertical', 'grid');--> statement-breakpoint
CREATE TYPE "public"."shadow" AS ENUM('none', 'small', 'medium', 'large');--> statement-breakpoint
CREATE TYPE "public"."spacing" AS ENUM('compact', 'normal', 'relaxed');--> statement-breakpoint
CREATE TABLE "bio_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bio_page_id" uuid NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"description" text,
	"icon_url" text,
	"image_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"theme_config" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bio_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"organization_id" uuid,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"avatar_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"published_at" timestamp,
	"theme_config" jsonb,
	"theme_preset_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bio_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "link_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bio_link_id" uuid NOT NULL,
	"bio_page_id" uuid NOT NULL,
	"clicked_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"referrer" text,
	"country" text,
	"city" text,
	"device_type" text,
	"browser" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_term" text,
	"utm_content" text
);
--> statement-breakpoint
CREATE TABLE "link_analytics_aggregates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bio_link_id" uuid NOT NULL,
	"bio_page_id" uuid NOT NULL,
	"date" date NOT NULL,
	"total_clicks" integer DEFAULT 0 NOT NULL,
	"unique_clicks" integer DEFAULT 0 NOT NULL,
	"desktop_clicks" integer DEFAULT 0 NOT NULL,
	"mobile_clicks" integer DEFAULT 0 NOT NULL,
	"tablet_clicks" integer DEFAULT 0 NOT NULL,
	"chrome_clicks" integer DEFAULT 0 NOT NULL,
	"firefox_clicks" integer DEFAULT 0 NOT NULL,
	"safari_clicks" integer DEFAULT 0 NOT NULL,
	"edge_clicks" integer DEFAULT 0 NOT NULL,
	"other_browser_clicks" integer DEFAULT 0 NOT NULL,
	"top_referrers" jsonb,
	"top_countries" jsonb,
	"utm_source_breakdown" jsonb,
	"utm_medium_breakdown" jsonb,
	"utm_campaign_breakdown" jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "theme_presets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"organization_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"thumbnail_url" text,
	"theme_config" jsonb NOT NULL,
	"is_system_preset" boolean DEFAULT false NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bio_links" ADD CONSTRAINT "bio_links_bio_page_id_bio_pages_id_fk" FOREIGN KEY ("bio_page_id") REFERENCES "public"."bio_pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bio_pages" ADD CONSTRAINT "bio_pages_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bio_pages" ADD CONSTRAINT "bio_pages_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link_analytics" ADD CONSTRAINT "link_analytics_bio_link_id_bio_links_id_fk" FOREIGN KEY ("bio_link_id") REFERENCES "public"."bio_links"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link_analytics" ADD CONSTRAINT "link_analytics_bio_page_id_bio_pages_id_fk" FOREIGN KEY ("bio_page_id") REFERENCES "public"."bio_pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link_analytics_aggregates" ADD CONSTRAINT "link_analytics_aggregates_bio_link_id_bio_links_id_fk" FOREIGN KEY ("bio_link_id") REFERENCES "public"."bio_links"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link_analytics_aggregates" ADD CONSTRAINT "link_analytics_aggregates_bio_page_id_bio_pages_id_fk" FOREIGN KEY ("bio_page_id") REFERENCES "public"."bio_pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_presets" ADD CONSTRAINT "theme_presets_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_presets" ADD CONSTRAINT "theme_presets_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bio_links_page_id_idx" ON "bio_links" USING btree ("bio_page_id");--> statement-breakpoint
CREATE INDEX "bio_links_order_idx" ON "bio_links" USING btree ("bio_page_id","order");--> statement-breakpoint
CREATE INDEX "bio_pages_user_id_idx" ON "bio_pages" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "bio_pages_slug_idx" ON "bio_pages" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "bio_pages_org_id_idx" ON "bio_pages" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "link_analytics_link_id_idx" ON "link_analytics" USING btree ("bio_link_id");--> statement-breakpoint
CREATE INDEX "link_analytics_page_id_idx" ON "link_analytics" USING btree ("bio_page_id");--> statement-breakpoint
CREATE INDEX "link_analytics_clicked_at_idx" ON "link_analytics" USING btree ("clicked_at");--> statement-breakpoint
CREATE INDEX "link_analytics_date_idx" ON "link_analytics" USING btree (DATE("clicked_at"));--> statement-breakpoint
CREATE INDEX "link_analytics_ip_idx" ON "link_analytics" USING btree ("ip_address");--> statement-breakpoint
CREATE INDEX "analytics_agg_link_date_idx" ON "link_analytics_aggregates" USING btree ("bio_link_id","date");--> statement-breakpoint
CREATE INDEX "analytics_agg_page_date_idx" ON "link_analytics_aggregates" USING btree ("bio_page_id","date");--> statement-breakpoint
CREATE INDEX "theme_presets_user_id_idx" ON "theme_presets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "theme_presets_org_id_idx" ON "theme_presets" USING btree ("organization_id");