-- ============================================================================
-- Migration: 0002_cleanup_legacy_tables.sql
-- Description: Drop all legacy Payload CMS tables, versions tables, and any
--              unrelated tables in the public schema.
-- ============================================================================

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename NOT IN (
            'courses',
            'sections',
            'lessons',
            'course_resources',
            'categories',
            'lesson_progress',
            'users',
            'enrollments',
            'reviews',
            'testimonials',
            'orders',
            'coupons',
            'pages',
            'posts',
            'media',
            'site_settings',
            '_migrations'
          )
    ) LOOP
        RAISE NOTICE 'Dropping legacy table: %', r.tablename;
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;
