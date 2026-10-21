import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- 1. Payload System Tables
    CREATE TABLE IF NOT EXISTS "payload_migrations" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar,
      "batch" numeric,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "payload_preferences" (
      "id" serial PRIMARY KEY NOT NULL,
      "key" varchar,
      "value" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "payload_kv" (
      "id" serial PRIMARY KEY NOT NULL,
      "key" varchar NOT NULL,
      "data" jsonb NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "payload_kv_key_idx" ON "payload_kv" ("key");

    -- 2. Users Collection
    CREATE TABLE IF NOT EXISTS "users" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar,
      "role" varchar DEFAULT 'student' NOT NULL,
      "email" varchar NOT NULL UNIQUE,
      "reset_password_token" varchar,
      "reset_password_expiration" timestamp(3) with time zone,
      "reset_password_requested_at" timestamp(3) with time zone,
      "salt" varchar,
      "hash" varchar,
      "login_attempts" numeric DEFAULT 0,
      "lock_until" timestamp(3) with time zone,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");
    CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" ("created_at");

    CREATE TABLE IF NOT EXISTS "users_sessions" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "id" varchar PRIMARY KEY NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now(),
      "expires_at" timestamp(3) with time zone NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "users_sessions_parent_idx" ON "users_sessions" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "users_sessions_order_idx" ON "users_sessions" ("_order");

    CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL REFERENCES "payload_preferences"("id") ON DELETE CASCADE,
      "path" varchar NOT NULL,
      "users_id" integer REFERENCES "users"("id") ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" ("parent_id");

    -- 3. Media Collection
    CREATE TABLE IF NOT EXISTS "media" (
      "id" serial PRIMARY KEY NOT NULL,
      "alt" varchar NOT NULL,
      "url" varchar,
      "thumbnail_u_r_l" varchar,
      "filename" varchar,
      "mime_type" varchar,
      "filesize" numeric,
      "width" numeric,
      "height" numeric,
      "focal_x" numeric,
      "focal_y" numeric,
      "sizes_card_url" varchar,
      "sizes_card_width" numeric,
      "sizes_card_height" numeric,
      "sizes_card_mime_type" varchar,
      "sizes_card_filesize" numeric,
      "sizes_card_filename" varchar,
      "sizes_thumbnail_url" varchar,
      "sizes_thumbnail_width" numeric,
      "sizes_thumbnail_height" numeric,
      "sizes_thumbnail_mime_type" varchar,
      "sizes_thumbnail_filesize" numeric,
      "sizes_thumbnail_filename" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "media_filename_idx" ON "media" ("filename");
    CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" ("created_at");

    CREATE TABLE IF NOT EXISTS "media_tags" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "media"("id") ON DELETE CASCADE,
      "id" varchar PRIMARY KEY NOT NULL,
      "tag" varchar
    );
    CREATE INDEX IF NOT EXISTS "media_tags_parent_idx" ON "media_tags" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "media_tags_order_idx" ON "media_tags" ("_order");

    -- 4. Categories Collection
    CREATE TABLE IF NOT EXISTS "categories" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL UNIQUE,
      "description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories" ("slug");
    CREATE INDEX IF NOT EXISTS "categories_created_at_idx" ON "categories" ("created_at");

    -- 5. Instructors Collection
    CREATE TABLE IF NOT EXISTS "instructors" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "title" varchar,
      "portrait_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "bio" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "instructors_created_at_idx" ON "instructors" ("created_at");

    CREATE TABLE IF NOT EXISTS "instructors_social_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "instructors"("id") ON DELETE CASCADE,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "url" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "instructors_social_links_parent_idx" ON "instructors_social_links" ("_parent_id");

    -- 6. Courses Collection
    CREATE TABLE IF NOT EXISTS "courses" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL UNIQUE,
      "summary" varchar NOT NULL,
      "description" jsonb,
      "thumbnail_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "category_id" integer REFERENCES "categories"("id") ON DELETE SET NULL,
      "instructor_id" integer REFERENCES "instructors"("id") ON DELETE SET NULL,
      "level" varchar DEFAULT 'beginner',
      "language" varchar DEFAULT 'English',
      "price" numeric DEFAULT 0,
      "currency" varchar DEFAULT 'USD',
      "seo_title" varchar,
      "seo_description" varchar,
      "_status" varchar DEFAULT 'draft',
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "courses_slug_idx" ON "courses" ("slug");
    CREATE INDEX IF NOT EXISTS "courses_category_idx" ON "courses" ("category_id");
    CREATE INDEX IF NOT EXISTS "courses_status_idx" ON "courses" ("_status");
    CREATE INDEX IF NOT EXISTS "courses_created_at_idx" ON "courses" ("created_at");

    CREATE TABLE IF NOT EXISTS "courses_learning_outcomes" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
      "id" varchar PRIMARY KEY NOT NULL,
      "item" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "courses_learning_outcomes_parent_idx" ON "courses_learning_outcomes" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "courses_requirements" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
      "id" varchar PRIMARY KEY NOT NULL,
      "item" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "courses_requirements_parent_idx" ON "courses_requirements" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "courses_faqs" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
      "id" varchar PRIMARY KEY NOT NULL,
      "question" varchar NOT NULL,
      "answer" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "courses_faqs_parent_idx" ON "courses_faqs" ("_parent_id");

    -- Courses Versions
    CREATE TABLE IF NOT EXISTS "_courses_versions" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer REFERENCES "courses"("id") ON DELETE SET NULL,
      "version_title" varchar NOT NULL,
      "version_slug" varchar NOT NULL,
      "version_summary" varchar NOT NULL,
      "version_description" jsonb,
      "version_thumbnail_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "version_category_id" integer REFERENCES "categories"("id") ON DELETE SET NULL,
      "version_instructor_id" integer REFERENCES "instructors"("id") ON DELETE SET NULL,
      "version_level" varchar DEFAULT 'beginner',
      "version_language" varchar DEFAULT 'English',
      "version_price" numeric DEFAULT 0,
      "version_currency" varchar DEFAULT 'USD',
      "version_seo_title" varchar,
      "version_seo_description" varchar,
      "version__status" varchar DEFAULT 'draft',
      "version_created_at" timestamp(3) with time zone,
      "version_updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean,
      "autosave" boolean
    );
    CREATE INDEX IF NOT EXISTS "_courses_versions_parent_idx" ON "_courses_versions" ("parent_id");
    CREATE INDEX IF NOT EXISTS "_courses_versions_latest_idx" ON "_courses_versions" ("latest");
    CREATE INDEX IF NOT EXISTS "_courses_versions_created_at_idx" ON "_courses_versions" ("created_at");

    CREATE TABLE IF NOT EXISTS "_courses_versions_learning_outcomes" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "_courses_versions"("id") ON DELETE CASCADE,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "item" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "_courses_versions_learning_outcomes_parent_idx" ON "_courses_versions_learning_outcomes" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "_courses_versions_requirements" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "_courses_versions"("id") ON DELETE CASCADE,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "item" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "_courses_versions_requirements_parent_idx" ON "_courses_versions_requirements" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "_courses_versions_faqs" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "_courses_versions"("id") ON DELETE CASCADE,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "question" varchar NOT NULL,
      "answer" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "_courses_versions_faqs_parent_idx" ON "_courses_versions_faqs" ("_parent_id");

    -- 7. Sections Collection
    CREATE TABLE IF NOT EXISTS "sections" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "course_id" integer NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
      "order" numeric DEFAULT 0 NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "sections_course_idx" ON "sections" ("course_id");
    CREATE INDEX IF NOT EXISTS "sections_order_idx" ON "sections" ("order");
    CREATE INDEX IF NOT EXISTS "sections_created_at_idx" ON "sections" ("created_at");

    -- 8. Lessons Collection
    CREATE TABLE IF NOT EXISTS "lessons" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "section_id" integer NOT NULL REFERENCES "sections"("id") ON DELETE CASCADE,
      "order" numeric DEFAULT 0 NOT NULL,
      "type" varchar DEFAULT 'text' NOT NULL,
      "free_preview" boolean DEFAULT false,
      "duration_minutes" numeric,
      "video_asset_id" varchar,
      "content" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "lessons_section_idx" ON "lessons" ("section_id");
    CREATE INDEX IF NOT EXISTS "lessons_order_idx" ON "lessons" ("order");
    CREATE INDEX IF NOT EXISTS "lessons_free_preview_idx" ON "lessons" ("free_preview");
    CREATE INDEX IF NOT EXISTS "lessons_created_at_idx" ON "lessons" ("created_at");

    -- 9. Course Resources Collection
    CREATE TABLE IF NOT EXISTS "course_resources" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "lesson_id" integer NOT NULL REFERENCES "lessons"("id") ON DELETE CASCADE,
      "url" varchar,
      "filename" varchar,
      "mime_type" varchar,
      "filesize" numeric,
      "width" numeric,
      "height" numeric,
      "focal_x" numeric,
      "focal_y" numeric,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "course_resources_lesson_idx" ON "course_resources" ("lesson_id");
    CREATE INDEX IF NOT EXISTS "course_resources_created_at_idx" ON "course_resources" ("created_at");

    CREATE TABLE IF NOT EXISTS "lessons_resources" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "lessons"("id") ON DELETE CASCADE,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "file_id" integer NOT NULL REFERENCES "course_resources"("id") ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS "lessons_resources_parent_idx" ON "lessons_resources" ("_parent_id");

    -- 10. Enrollments Collection
    CREATE TABLE IF NOT EXISTS "enrollments" (
      "id" serial PRIMARY KEY NOT NULL,
      "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "course_id" integer NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
      "status" varchar DEFAULT 'active' NOT NULL,
      "source" varchar DEFAULT 'manual' NOT NULL,
      "order_reference" varchar,
      "payment_intent_id" varchar,
      "enrolled_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "enrollments_user_course_unique" UNIQUE ("user_id", "course_id")
    );
    CREATE INDEX IF NOT EXISTS "enrollments_user_idx" ON "enrollments" ("user_id");
    CREATE INDEX IF NOT EXISTS "enrollments_course_idx" ON "enrollments" ("course_id");
    CREATE INDEX IF NOT EXISTS "enrollments_status_idx" ON "enrollments" ("status");
    CREATE INDEX IF NOT EXISTS "enrollments_order_ref_idx" ON "enrollments" ("order_reference");
    CREATE INDEX IF NOT EXISTS "enrollments_created_at_idx" ON "enrollments" ("created_at");

    -- 11. Lesson Progress Collection
    CREATE TABLE IF NOT EXISTS "lesson_progress" (
      "id" serial PRIMARY KEY NOT NULL,
      "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "lesson_id" integer NOT NULL REFERENCES "lessons"("id") ON DELETE CASCADE,
      "completed" boolean DEFAULT false,
      "completed_at" timestamp(3) with time zone,
      "notes" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "lesson_progress_user_lesson_unique" UNIQUE ("user_id", "lesson_id")
    );
    CREATE INDEX IF NOT EXISTS "lesson_progress_user_idx" ON "lesson_progress" ("user_id");
    CREATE INDEX IF NOT EXISTS "lesson_progress_lesson_idx" ON "lesson_progress" ("lesson_id");
    CREATE INDEX IF NOT EXISTS "lesson_progress_created_at_idx" ON "lesson_progress" ("created_at");

    -- 12. Reviews Collection
    CREATE TABLE IF NOT EXISTS "reviews" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "body" varchar NOT NULL,
      "rating" numeric NOT NULL,
      "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "course_id" integer NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
      "approved" boolean DEFAULT false,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "reviews_user_course_unique" UNIQUE ("user_id", "course_id")
    );
    CREATE INDEX IF NOT EXISTS "reviews_user_idx" ON "reviews" ("user_id");
    CREATE INDEX IF NOT EXISTS "reviews_course_idx" ON "reviews" ("course_id");
    CREATE INDEX IF NOT EXISTS "reviews_approved_idx" ON "reviews" ("approved");
    CREATE INDEX IF NOT EXISTS "reviews_created_at_idx" ON "reviews" ("created_at");

    -- 13. Testimonials Collection
    CREATE TABLE IF NOT EXISTS "testimonials" (
      "id" serial PRIMARY KEY NOT NULL,
      "quote" varchar NOT NULL,
      "name" varchar NOT NULL,
      "detail" varchar,
      "portrait_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "course_id" integer REFERENCES "courses"("id") ON DELETE SET NULL,
      "featured" boolean DEFAULT false,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "testimonials_created_at_idx" ON "testimonials" ("created_at");

    -- 14. Posts Collection
    CREATE TABLE IF NOT EXISTS "posts" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL UNIQUE,
      "excerpt" varchar,
      "cover_image_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "author_id" integer REFERENCES "users"("id") ON DELETE SET NULL,
      "content" jsonb,
      "reading_time" numeric,
      "published_at" timestamp(3) with time zone,
      "seo_title" varchar,
      "seo_description" varchar,
      "_status" varchar DEFAULT 'draft',
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "posts_slug_idx" ON "posts" ("slug");
    CREATE INDEX IF NOT EXISTS "posts_published_at_idx" ON "posts" ("published_at");
    CREATE INDEX IF NOT EXISTS "posts_created_at_idx" ON "posts" ("created_at");

    CREATE TABLE IF NOT EXISTS "posts_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL REFERENCES "posts"("id") ON DELETE CASCADE,
      "path" varchar NOT NULL,
      "categories_id" integer REFERENCES "categories"("id") ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS "posts_rels_parent_idx" ON "posts_rels" ("parent_id");
    CREATE INDEX IF NOT EXISTS "posts_rels_path_idx" ON "posts_rels" ("path");

    -- Posts Versions
    CREATE TABLE IF NOT EXISTS "_posts_versions" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer REFERENCES "posts"("id") ON DELETE SET NULL,
      "version_title" varchar NOT NULL,
      "version_slug" varchar NOT NULL,
      "version_excerpt" varchar,
      "version_cover_image_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "version_author_id" integer REFERENCES "users"("id") ON DELETE SET NULL,
      "version_content" jsonb,
      "version_reading_time" numeric,
      "version_published_at" timestamp(3) with time zone,
      "version_seo_title" varchar,
      "version_seo_description" varchar,
      "version__status" varchar DEFAULT 'draft',
      "version_created_at" timestamp(3) with time zone,
      "version_updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean,
      "autosave" boolean
    );
    CREATE INDEX IF NOT EXISTS "_posts_versions_parent_idx" ON "_posts_versions" ("parent_id");
    CREATE INDEX IF NOT EXISTS "_posts_versions_latest_idx" ON "_posts_versions" ("latest");
    CREATE INDEX IF NOT EXISTS "_posts_versions_created_at_idx" ON "_posts_versions" ("created_at");

    CREATE TABLE IF NOT EXISTS "_posts_versions_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL REFERENCES "_posts_versions"("id") ON DELETE CASCADE,
      "path" varchar NOT NULL,
      "categories_id" integer REFERENCES "categories"("id") ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS "_posts_versions_rels_parent_idx" ON "_posts_versions_rels" ("parent_id");

    -- 15. Pages Collection
    CREATE TABLE IF NOT EXISTS "pages" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL UNIQUE,
      "seo_title" varchar,
      "seo_description" varchar,
      "seo_image_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "_status" varchar DEFAULT 'draft',
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages" ("slug");
    CREATE INDEX IF NOT EXISTS "pages_created_at_idx" ON "pages" ("created_at");

    CREATE TABLE IF NOT EXISTS "pages_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL REFERENCES "pages"("id") ON DELETE CASCADE,
      "path" varchar NOT NULL,
      "courses_id" integer REFERENCES "courses"("id") ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS "pages_rels_parent_idx" ON "pages_rels" ("parent_id");

    -- Pages Versions
    CREATE TABLE IF NOT EXISTS "_pages_versions" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer REFERENCES "pages"("id") ON DELETE SET NULL,
      "version_title" varchar NOT NULL,
      "version_slug" varchar NOT NULL,
      "version_seo_title" varchar,
      "version_seo_description" varchar,
      "version_seo_image_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "version__status" varchar DEFAULT 'draft',
      "version_created_at" timestamp(3) with time zone,
      "version_updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean,
      "autosave" boolean
    );
    CREATE INDEX IF NOT EXISTS "_pages_versions_parent_idx" ON "_pages_versions" ("parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_versions_latest_idx" ON "_pages_versions" ("latest");
    CREATE INDEX IF NOT EXISTS "_pages_versions_created_at_idx" ON "_pages_versions" ("created_at");

    CREATE TABLE IF NOT EXISTS "_pages_versions_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL REFERENCES "_pages_versions"("id") ON DELETE CASCADE,
      "path" varchar NOT NULL,
      "courses_id" integer REFERENCES "courses"("id") ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS "_pages_versions_rels_parent_idx" ON "_pages_versions_rels" ("parent_id");

    -- Pages Blocks Tables
    CREATE TABLE IF NOT EXISTS "pages_blocks_hero" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "pages"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "heading" varchar NOT NULL,
      "body" varchar,
      "image_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "button_label" varchar,
      "button_link" varchar
    );
    CREATE INDEX IF NOT EXISTS "pages_blocks_hero_parent_idx" ON "pages_blocks_hero" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "pages_blocks_course_grid" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "pages"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "heading" varchar,
      "intro" varchar,
      "limit" numeric DEFAULT 3
    );
    CREATE INDEX IF NOT EXISTS "pages_blocks_course_grid_parent_idx" ON "pages_blocks_course_grid" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "pages_blocks_featured_course" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "pages"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "course_id" integer NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
      "eyebrow" varchar
    );
    CREATE INDEX IF NOT EXISTS "pages_blocks_featured_course_parent_idx" ON "pages_blocks_featured_course" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "pages_blocks_rich_text" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "pages"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "content" jsonb NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "pages_blocks_rich_text_parent_idx" ON "pages_blocks_rich_text" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "pages_blocks_image_text" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "pages"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "heading" varchar NOT NULL,
      "body" varchar NOT NULL,
      "image_id" integer NOT NULL REFERENCES "media"("id") ON DELETE CASCADE,
      "image_side" varchar DEFAULT 'left'
    );
    CREATE INDEX IF NOT EXISTS "pages_blocks_image_text_parent_idx" ON "pages_blocks_image_text" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "pages_blocks_testimonials" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "pages"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "heading" varchar
    );
    CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_parent_idx" ON "pages_blocks_testimonials" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "pages_blocks_testimonials_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "quote" varchar NOT NULL,
      "name" varchar NOT NULL,
      "detail" varchar
    );
    CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_items_parent_idx" ON "pages_blocks_testimonials_items" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "pages_blocks_faq" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "pages"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "heading" varchar
    );
    CREATE INDEX IF NOT EXISTS "pages_blocks_faq_parent_idx" ON "pages_blocks_faq" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "pages_blocks_faq_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "question" varchar NOT NULL,
      "answer" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "pages_blocks_faq_items_parent_idx" ON "pages_blocks_faq_items" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "pages_blocks_cta" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "pages"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "heading" varchar NOT NULL,
      "body" varchar,
      "button_label" varchar NOT NULL,
      "button_link" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "pages_blocks_cta_parent_idx" ON "pages_blocks_cta" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "pages_blocks_instructor_bio" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "pages"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "instructor_id" integer NOT NULL REFERENCES "instructors"("id") ON DELETE CASCADE,
      "heading" varchar
    );
    CREATE INDEX IF NOT EXISTS "pages_blocks_instructor_bio_parent_idx" ON "pages_blocks_instructor_bio" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "pages_blocks_stats" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "pages"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "heading" varchar
    );
    CREATE INDEX IF NOT EXISTS "pages_blocks_stats_parent_idx" ON "pages_blocks_stats" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "pages_blocks_stats_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "value" varchar NOT NULL,
      "label" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "pages_blocks_stats_items_parent_idx" ON "pages_blocks_stats_items" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "pages_blocks_newsletter" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "pages"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "heading" varchar NOT NULL,
      "body" varchar,
      "button_label" varchar DEFAULT 'Subscribe'
    );
    CREATE INDEX IF NOT EXISTS "pages_blocks_newsletter_parent_idx" ON "pages_blocks_newsletter" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "pages_blocks_video_embed" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "pages"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "heading" varchar,
      "url" varchar NOT NULL,
      "caption" varchar
    );
    CREATE INDEX IF NOT EXISTS "pages_blocks_video_embed_parent_idx" ON "pages_blocks_video_embed" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "pages_blocks_contact_form" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "pages"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "heading" varchar NOT NULL,
      "intro" varchar,
      "recipient_email" varchar
    );
    CREATE INDEX IF NOT EXISTS "pages_blocks_contact_form_parent_idx" ON "pages_blocks_contact_form" ("_parent_id");

    -- Pages Versions Blocks Tables
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_hero" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "_pages_versions"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "eyebrow" varchar,
      "heading" varchar NOT NULL,
      "body" varchar,
      "image_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "button_label" varchar,
      "button_link" varchar
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_parent_idx" ON "_pages_v_blocks_hero" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_course_grid" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "_pages_versions"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "heading" varchar,
      "intro" varchar,
      "limit" numeric DEFAULT 3
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_course_grid_parent_idx" ON "_pages_v_blocks_course_grid" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_featured_course" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "_pages_versions"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "course_id" integer NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
      "eyebrow" varchar
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_featured_course_parent_idx" ON "_pages_v_blocks_featured_course" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_rich_text" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "_pages_versions"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "content" jsonb NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_rich_text_parent_idx" ON "_pages_v_blocks_rich_text" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_image_text" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "_pages_versions"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "heading" varchar NOT NULL,
      "body" varchar NOT NULL,
      "image_id" integer NOT NULL REFERENCES "media"("id") ON DELETE CASCADE,
      "image_side" varchar DEFAULT 'left'
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_text_parent_idx" ON "_pages_v_blocks_image_text" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_testimonials" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "_pages_versions"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "heading" varchar
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_parent_idx" ON "_pages_v_blocks_testimonials" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_testimonials_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "quote" varchar NOT NULL,
      "name" varchar NOT NULL,
      "detail" varchar
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_items_parent_idx" ON "_pages_v_blocks_testimonials_items" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_faq" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "_pages_versions"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "heading" varchar
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_parent_idx" ON "_pages_v_blocks_faq" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_faq_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "question" varchar NOT NULL,
      "answer" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_items_parent_idx" ON "_pages_v_blocks_faq_items" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_cta" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "_pages_versions"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "heading" varchar NOT NULL,
      "body" varchar,
      "button_label" varchar NOT NULL,
      "button_link" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_parent_idx" ON "_pages_v_blocks_cta" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_instructor_bio" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "_pages_versions"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "instructor_id" integer NOT NULL REFERENCES "instructors"("id") ON DELETE CASCADE,
      "heading" varchar
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_instructor_bio_parent_idx" ON "_pages_v_blocks_instructor_bio" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_stats" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "_pages_versions"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "heading" varchar
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_stats_parent_idx" ON "_pages_v_blocks_stats" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_stats_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "value" varchar NOT NULL,
      "label" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_stats_items_parent_idx" ON "_pages_v_blocks_stats_items" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_newsletter" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "_pages_versions"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "heading" varchar NOT NULL,
      "body" varchar,
      "button_label" varchar DEFAULT 'Subscribe'
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_newsletter_parent_idx" ON "_pages_v_blocks_newsletter" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_video_embed" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "_pages_versions"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "heading" varchar,
      "url" varchar NOT NULL,
      "caption" varchar
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_embed_parent_idx" ON "_pages_v_blocks_video_embed" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_contact_form" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "_pages_versions"("id") ON DELETE CASCADE,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "heading" varchar NOT NULL,
      "intro" varchar,
      "recipient_email" varchar
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_contact_form_parent_idx" ON "_pages_v_blocks_contact_form" ("_parent_id");

    -- 16. Globals: Site Settings
    CREATE TABLE IF NOT EXISTS "site_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "site_name" varchar DEFAULT 'Fieldnotes' NOT NULL,
      "logo_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "favicon_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "announcement_enabled" boolean DEFAULT false,
      "announcement_text" varchar,
      "announcement_link" varchar,
      "seo_title" varchar,
      "seo_description" varchar,
      "seo_open_graph_image_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "brand_primary_color" varchar DEFAULT '#465640',
      "brand_radius" varchar DEFAULT '12px',
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "site_settings_navigation" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "site_settings"("id") ON DELETE CASCADE,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "url" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "site_settings_navigation_parent_idx" ON "site_settings_navigation" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "site_settings_footer_navigation" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "site_settings"("id") ON DELETE CASCADE,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "url" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "site_settings_footer_navigation_parent_idx" ON "site_settings_footer_navigation" ("_parent_id");

    CREATE TABLE IF NOT EXISTS "site_settings_social_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "site_settings"("id") ON DELETE CASCADE,
      "id" varchar PRIMARY KEY NOT NULL,
      "platform" varchar NOT NULL,
      "url" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "site_settings_social_links_parent_idx" ON "site_settings_social_links" ("_parent_id");

    -- 17. Payload Locked Documents
    CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
      "id" serial PRIMARY KEY NOT NULL,
      "global_slug" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL REFERENCES "payload_locked_documents"("id") ON DELETE CASCADE,
      "path" varchar NOT NULL,
      "users_id" integer REFERENCES "users"("id") ON DELETE CASCADE,
      "media_id" integer REFERENCES "media"("id") ON DELETE CASCADE,
      "categories_id" integer REFERENCES "categories"("id") ON DELETE CASCADE,
      "courses_id" integer REFERENCES "courses"("id") ON DELETE CASCADE,
      "sections_id" integer REFERENCES "sections"("id") ON DELETE CASCADE,
      "lessons_id" integer REFERENCES "lessons"("id") ON DELETE CASCADE,
      "course_resources_id" integer REFERENCES "course_resources"("id") ON DELETE CASCADE,
      "enrollments_id" integer REFERENCES "enrollments"("id") ON DELETE CASCADE,
      "lesson_progress_id" integer REFERENCES "lesson_progress"("id") ON DELETE CASCADE,
      "reviews_id" integer REFERENCES "reviews"("id") ON DELETE CASCADE,
      "pages_id" integer REFERENCES "pages"("id") ON DELETE CASCADE,
      "posts_id" integer REFERENCES "posts"("id") ON DELETE CASCADE,
      "instructors_id" integer REFERENCES "instructors"("id") ON DELETE CASCADE,
      "testimonials_id" integer REFERENCES "testimonials"("id") ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" ("parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "payload_locked_documents_rels" CASCADE;
    DROP TABLE IF EXISTS "payload_locked_documents" CASCADE;
    DROP TABLE IF EXISTS "site_settings_social_links" CASCADE;
    DROP TABLE IF EXISTS "site_settings_footer_navigation" CASCADE;
    DROP TABLE IF EXISTS "site_settings_navigation" CASCADE;
    DROP TABLE IF EXISTS "site_settings" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_contact_form" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_video_embed" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_newsletter" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_stats_items" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_stats" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_instructor_bio" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_cta" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_faq_items" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_faq" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_testimonials_items" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_testimonials" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_image_text" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_rich_text" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_featured_course" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_course_grid" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_hero" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_contact_form" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_video_embed" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_newsletter" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_stats_items" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_stats" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_instructor_bio" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_cta" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_faq_items" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_faq" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_testimonials_items" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_testimonials" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_image_text" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_rich_text" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_featured_course" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_course_grid" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_hero" CASCADE;
    DROP TABLE IF EXISTS "_pages_versions_rels" CASCADE;
    DROP TABLE IF EXISTS "_pages_versions" CASCADE;
    DROP TABLE IF EXISTS "pages_rels" CASCADE;
    DROP TABLE IF EXISTS "pages" CASCADE;
    DROP TABLE IF EXISTS "_posts_versions_rels" CASCADE;
    DROP TABLE IF EXISTS "_posts_versions" CASCADE;
    DROP TABLE IF EXISTS "posts_rels" CASCADE;
    DROP TABLE IF EXISTS "posts" CASCADE;
    DROP TABLE IF EXISTS "testimonials" CASCADE;
    DROP TABLE IF EXISTS "reviews" CASCADE;
    DROP TABLE IF EXISTS "lesson_progress" CASCADE;
    DROP TABLE IF EXISTS "enrollments" CASCADE;
    DROP TABLE IF EXISTS "lessons_resources" CASCADE;
    DROP TABLE IF EXISTS "course_resources" CASCADE;
    DROP TABLE IF EXISTS "lessons" CASCADE;
    DROP TABLE IF EXISTS "sections" CASCADE;
    DROP TABLE IF EXISTS "_courses_versions_faqs" CASCADE;
    DROP TABLE IF EXISTS "_courses_versions_requirements" CASCADE;
    DROP TABLE IF EXISTS "_courses_versions_learning_outcomes" CASCADE;
    DROP TABLE IF EXISTS "_courses_versions" CASCADE;
    DROP TABLE IF EXISTS "courses_faqs" CASCADE;
    DROP TABLE IF EXISTS "courses_requirements" CASCADE;
    DROP TABLE IF EXISTS "courses_learning_outcomes" CASCADE;
    DROP TABLE IF EXISTS "courses" CASCADE;
    DROP TABLE IF EXISTS "instructors_social_links" CASCADE;
    DROP TABLE IF EXISTS "instructors" CASCADE;
    DROP TABLE IF EXISTS "categories" CASCADE;
    DROP TABLE IF EXISTS "media_tags" CASCADE;
    DROP TABLE IF EXISTS "media" CASCADE;
    DROP TABLE IF EXISTS "payload_preferences_rels" CASCADE;
    DROP TABLE IF EXISTS "payload_preferences" CASCADE;
    DROP TABLE IF EXISTS "users_sessions" CASCADE;
    DROP TABLE IF EXISTS "users" CASCADE;
    DROP TABLE IF EXISTS "payload_kv" CASCADE;
    DROP TABLE IF EXISTS "payload_migrations" CASCADE;
  `)
}
