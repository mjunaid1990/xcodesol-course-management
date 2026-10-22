import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Seed Users (Admin & Editor)
  await db.execute(sql`
    INSERT INTO "users" ("name", "email", "role", "salt", "hash", "updated_at", "created_at")
    VALUES 
      (
        'Course Administrator',
        'admin@example.com',
        'admin',
        'a50fd2586d8cfc34da4484f4caf74823',
        'pbkdf2-sha256-v1:afc43ebb280989c145dbee92c1705876400f52426c5d34e3448597ed4968b114',
        now(),
        now()
      ),
      (
        'Course Editor',
        'editor@example.com',
        'editor',
        '28c78f66e5435b209969a811c52c0ed3',
        'pbkdf2-sha256-v1:852507945f36b88c23c37ce3137d57afcf205db8a282a09786897500f818a73b',
        now(),
        now()
      )
    ON CONFLICT ("email") DO UPDATE SET
      "salt" = EXCLUDED."salt",
      "hash" = EXCLUDED."hash",
      "role" = EXCLUDED."role",
      "login_attempts" = 0,
      "lock_until" = NULL,
      "updated_at" = now();
  `)

  // 2. Seed Categories
  await db.execute(sql`
    INSERT INTO "categories" ("name", "slug", "description", "updated_at", "created_at")
    VALUES 
      ('Web Development', 'web-development', 'Build and ship modern web applications.', now(), now()),
      ('Design', 'design', 'Practical foundations for digital product design.', now(), now())
    ON CONFLICT ("slug") DO NOTHING;
  `)

  // 3. Seed Instructor
  await db.execute(sql`
    INSERT INTO "instructors" ("name", "title", "updated_at", "created_at")
    SELECT 'Alex Morgan', 'Instructor', now(), now()
    WHERE NOT EXISTS (SELECT 1 FROM "instructors" WHERE "name" = 'Alex Morgan');
  `)

  // 4. Seed Courses
  await db.execute(sql`
    DO $$
    DECLARE
      v_cat_dev integer;
      v_cat_design integer;
      v_inst_id integer;
      v_course_web integer;
      v_course_design integer;
      v_sec_web integer;
      v_sec_design integer;
      v_admin_id integer;
      v_post_id integer;
      v_page_id integer;
    BEGIN
      SELECT id INTO v_cat_dev FROM "categories" WHERE "slug" = 'web-development' LIMIT 1;
      SELECT id INTO v_cat_design FROM "categories" WHERE "slug" = 'design' LIMIT 1;
      SELECT id INTO v_inst_id FROM "instructors" WHERE "name" = 'Alex Morgan' LIMIT 1;
      SELECT id INTO v_admin_id FROM "users" WHERE "email" = 'admin@example.com' LIMIT 1;

      -- Course 1: Build Your First Website
      IF NOT EXISTS (SELECT 1 FROM "courses" WHERE "slug" = 'build-your-first-website') THEN
        INSERT INTO "courses" (
          "title", "slug", "summary", "category_id", "instructor_id", "level", "language", "price", "currency",
          "description", "_status", "seo_title", "seo_description", "updated_at", "created_at"
        ) VALUES (
          'Build Your First Website',
          'build-your-first-website',
          'Learn the foundations of HTML, CSS, and responsive layouts.',
          v_cat_dev,
          v_inst_id,
          'beginner',
          'English',
          0,
          'USD',
          '{"root":{"type":"root","format":"","indent":0,"version":1,"children":[{"type":"paragraph","format":"","indent":0,"version":1,"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"A friendly, project-based introduction to the building blocks of the web.","type":"text","version":1}]},{"type":"paragraph","format":"","indent":0,"version":1,"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"By the end, you will have a responsive personal page and a clear path for continuing your web development journey.","type":"text","version":1}]}]}}'::jsonb,
          'published',
          'Build Your First Website',
          'Learn the foundations of HTML, CSS, and responsive layouts.',
          now(),
          now()
        ) RETURNING id INTO v_course_web;

        INSERT INTO "courses_learning_outcomes" ("_order", "_parent_id", "id", "item") VALUES
          (1, v_course_web, 'outcome_1_1', 'Explain how browsers load a website'),
          (2, v_course_web, 'outcome_1_2', 'Structure clear pages with semantic HTML'),
          (3, v_course_web, 'outcome_1_3', 'Create a responsive layout with CSS');

        INSERT INTO "courses_requirements" ("_order", "_parent_id", "id", "item") VALUES
          (1, v_course_web, 'req_1_1', 'No prior experience required');

        INSERT INTO "sections" ("title", "course_id", "order", "updated_at", "created_at")
        VALUES ('Build Your First Website - Getting Started', v_course_web, 1, now(), now())
        RETURNING id INTO v_sec_web;

        INSERT INTO "lessons" ("title", "section_id", "order", "type", "free_preview", "duration_minutes", "content", "updated_at", "created_at") VALUES
          (
            'How the web works',
            v_sec_web,
            1,
            'text',
            true,
            6,
            '{"root":{"type":"root","format":"","indent":0,"version":1,"children":[{"type":"paragraph","format":"","indent":0,"version":1,"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"A website is a set of files that a browser requests from a server. In this lesson, follow a request from a link click to the page appearing on screen.","type":"text","version":1}]}]}}'::jsonb,
            now(),
            now()
          ),
          (
            'Structure a page with HTML',
            v_sec_web,
            2,
            'text',
            false,
            9,
            '{"root":{"type":"root","format":"","indent":0,"version":1,"children":[{"type":"paragraph","format":"","indent":0,"version":1,"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"HTML gives content meaning and structure. Start with a page landmark, add a clear heading, and group related information into sections.","type":"text","version":1}]}]}}'::jsonb,
            now(),
            now()
          ),
          (
            'Style a responsive layout',
            v_sec_web,
            3,
            'text',
            false,
            12,
            '{"root":{"type":"root","format":"","indent":0,"version":1,"children":[{"type":"paragraph","format":"","indent":0,"version":1,"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"CSS controls the visual presentation. Build a flexible layout that adjusts naturally from a narrow phone screen to a wide desktop.","type":"text","version":1}]}]}}'::jsonb,
            now(),
            now()
          );
      ELSE
        SELECT id INTO v_course_web FROM "courses" WHERE "slug" = 'build-your-first-website' LIMIT 1;
      END IF;

      -- Course 2: Product Design Foundations
      IF NOT EXISTS (SELECT 1 FROM "courses" WHERE "slug" = 'product-design-foundations') THEN
        INSERT INTO "courses" (
          "title", "slug", "summary", "category_id", "instructor_id", "level", "language", "price", "currency",
          "description", "_status", "seo_title", "seo_description", "updated_at", "created_at"
        ) VALUES (
          'Product Design Foundations',
          'product-design-foundations',
          'Practice user flows, visual hierarchy, and interface decisions.',
          v_cat_design,
          v_inst_id,
          'beginner',
          'English',
          49,
          'USD',
          '{"root":{"type":"root","format":"","indent":0,"version":1,"children":[{"type":"paragraph","format":"","indent":0,"version":1,"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Learn a practical process for turning a user need into a clear, usable interface.","type":"text","version":1}]},{"type":"paragraph","format":"","indent":0,"version":1,"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"You will work through a small product challenge and leave with a user flow and a tested screen concept.","type":"text","version":1}]}]}}'::jsonb,
          'published',
          'Product Design Foundations',
          'Practice user flows, visual hierarchy, and interface decisions.',
          now(),
          now()
        ) RETURNING id INTO v_course_design;

        INSERT INTO "courses_learning_outcomes" ("_order", "_parent_id", "id", "item") VALUES
          (1, v_course_design, 'outcome_2_1', 'Frame a problem around a real user need'),
          (2, v_course_design, 'outcome_2_2', 'Map a focused task flow'),
          (3, v_course_design, 'outcome_2_3', 'Use hierarchy to make an interface easier to scan');

        INSERT INTO "courses_requirements" ("_order", "_parent_id", "id", "item") VALUES
          (1, v_course_design, 'req_2_1', 'No prior experience required');

        INSERT INTO "sections" ("title", "course_id", "order", "updated_at", "created_at")
        VALUES ('Product Design Foundations - Getting Started', v_course_design, 1, now(), now())
        RETURNING id INTO v_sec_design;

        INSERT INTO "lessons" ("title", "section_id", "order", "type", "free_preview", "duration_minutes", "content", "updated_at", "created_at") VALUES
          (
            'Understand the user problem',
            v_sec_design,
            1,
            'text',
            true,
            8,
            '{"root":{"type":"root","format":"","indent":0,"version":1,"children":[{"type":"paragraph","format":"","indent":0,"version":1,"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Good design starts with understanding the person and task. Separate what you observed from what you assumed, then write a concise problem statement.","type":"text","version":1}]}]}}'::jsonb,
            now(),
            now()
          ),
          (
            'Map a simple user flow',
            v_sec_design,
            2,
            'text',
            false,
            10,
            '{"root":{"type":"root","format":"","indent":0,"version":1,"children":[{"type":"paragraph","format":"","indent":0,"version":1,"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"A user flow shows the steps someone takes to finish a task. Keep the main path visible and remove decisions that do not help the user move forward.","type":"text","version":1}]}]}}'::jsonb,
            now(),
            now()
          ),
          (
            'Create a clear interface',
            v_sec_design,
            3,
            'text',
            false,
            14,
            '{"root":{"type":"root","format":"","indent":0,"version":1,"children":[{"type":"paragraph","format":"","indent":0,"version":1,"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Use spacing, contrast, and type size to guide attention. Give each screen one clear purpose and make the next action easy to find.","type":"text","version":1}]}]}}'::jsonb,
            now(),
            now()
          );
      ELSE
        SELECT id INTO v_course_design FROM "courses" WHERE "slug" = 'product-design-foundations' LIMIT 1;
      END IF;

      -- 5. Seed Site Settings
      IF NOT EXISTS (SELECT 1 FROM "site_settings" LIMIT 1) THEN
        INSERT INTO "site_settings" ("site_name", "brand_primary_color", "brand_radius", "updated_at", "created_at")
        VALUES ('Fieldnotes', '#465640', '12px', now(), now());

        INSERT INTO "site_settings_navigation" ("_order", "_parent_id", "id", "label", "url") VALUES
          (1, 1, 'nav_1', 'Courses', '/courses'),
          (2, 1, 'nav_2', 'About', '/about'),
          (3, 1, 'nav_3', 'Journal', '/blog');

        INSERT INTO "site_settings_footer_navigation" ("_order", "_parent_id", "id", "label", "url") VALUES
          (1, 1, 'fnav_1', 'Courses', '/courses'),
          (2, 1, 'fnav_2', 'Journal', '/blog');
      END IF;

      -- 6. Seed Sample Post
      IF NOT EXISTS (SELECT 1 FROM "posts" WHERE "slug" = 'start-with-small-steps') THEN
        INSERT INTO "posts" (
          "title", "slug", "excerpt", "content", "reading_time", "published_at", "author_id", "seo_title", "seo_description", "_status", "updated_at", "created_at"
        ) VALUES (
          'Start with small steps',
          'start-with-small-steps',
          'A practical note on making room for steady progress when you are learning something new.',
          '{"root":{"type":"root","format":"","indent":0,"version":1,"children":[{"type":"paragraph","format":"","indent":0,"version":1,"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Learning something new can feel like a large project before you have even begun. Shrink the first step until it is easy to start.","type":"text","version":1}]},{"type":"paragraph","format":"","indent":0,"version":1,"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Choose one question to answer, one small exercise to finish, or one idea to explain in your own words. A short, focused session gives you something useful to build on.","type":"text","version":1}]},{"type":"paragraph","format":"","indent":0,"version":1,"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Return to the work regularly. Progress becomes easier to see when you keep a record of what you tried and what you learned.","type":"text","version":1}]}]}}'::jsonb,
          2,
          now(),
          v_admin_id,
          'Start with small steps',
          'A practical note on steady progress while learning.',
          'published',
          now(),
          now()
        ) RETURNING id INTO v_post_id;

        IF v_cat_dev IS NOT NULL THEN
          INSERT INTO "posts_rels" ("order", "parent_id", "path", "categories_id")
          VALUES (1, v_post_id, 'categories', v_cat_dev);
        END IF;
      END IF;

      -- 7. Seed Home Page (with blocks)
      IF NOT EXISTS (SELECT 1 FROM "pages" WHERE "slug" = 'home') THEN
        INSERT INTO "pages" ("title", "slug", "_status", "seo_title", "seo_description", "updated_at", "created_at")
        VALUES ('Home', 'home', 'published', 'Fieldnotes | Learn by building', 'Practical courses to help you move from an idea to a finished project.', now(), now())
        RETURNING id INTO v_page_id;

        -- Block 1: hero
        INSERT INTO "pages_blocks_hero" ("_order", "_parent_id", "_path", "id", "eyebrow", "heading", "body", "button_label", "button_link")
        VALUES (1, v_page_id, 'layout', 'home_hero', 'FIELDNOTES COURSE PLATFORM', 'Learn by building something real.', 'Practical courses to help you move from an idea to a finished project.', 'Explore courses', '/courses');

        -- Block 2: courseGrid
        INSERT INTO "pages_blocks_course_grid" ("_order", "_parent_id", "_path", "id", "heading", "intro", "limit")
        VALUES (2, v_page_id, 'layout', 'home_course_grid', 'Start learning', 'Choose a course and make your next idea practical.', 2);

        IF v_course_web IS NOT NULL THEN
          INSERT INTO "pages_rels" ("order", "parent_id", "path", "courses_id")
          VALUES (1, v_page_id, 'layout.courses', v_course_web);
        END IF;
        IF v_course_design IS NOT NULL THEN
          INSERT INTO "pages_rels" ("order", "parent_id", "path", "courses_id")
          VALUES (2, v_page_id, 'layout.courses', v_course_design);
        END IF;

        -- Block 3: stats
        INSERT INTO "pages_blocks_stats" ("_order", "_parent_id", "_path", "id", "heading")
        VALUES (3, v_page_id, 'layout', 'home_stats', 'Learning, made practical');

        INSERT INTO "pages_blocks_stats_items" ("_order", "_parent_id", "id", "value", "label") VALUES
          (1, 'home_stats', 'stat_1', '3', 'Focused lessons per course'),
          (2, 'home_stats', 'stat_2', '100%', 'Learn at your own pace');

        -- Block 4: testimonials
        INSERT INTO "pages_blocks_testimonials" ("_order", "_parent_id", "_path", "id", "heading")
        VALUES (4, v_page_id, 'layout', 'home_testimonials', 'A thoughtful way to learn');

        INSERT INTO "pages_blocks_testimonials_items" ("_order", "_parent_id", "id", "quote", "name", "detail") VALUES
          (1, 'home_testimonials', 'test_1', 'Clear, practical lessons made it easy to keep going and finish a project I am proud of.', 'Jamie R.', 'Web development student'),
          (2, 'home_testimonials', 'test_2', 'The course helped me turn a vague idea into a simple flow I could share with my team.', 'Morgan L.', 'Product design student');

        -- Block 5: cta
        INSERT INTO "pages_blocks_cta" ("_order", "_parent_id", "_path", "id", "heading", "button_label", "button_link")
        VALUES (5, v_page_id, 'layout', 'home_cta', 'Make room for your next idea.', 'Browse courses', '/courses');
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "pages" WHERE "slug" = 'home';
    DELETE FROM "posts" WHERE "slug" = 'start-with-small-steps';
    DELETE FROM "courses" WHERE "slug" IN ('build-your-first-website', 'product-design-foundations');
    DELETE FROM "categories" WHERE "slug" IN ('web-development', 'design');
    DELETE FROM "instructors" WHERE "name" = 'Alex Morgan';
    DELETE FROM "users" WHERE "email" IN ('admin@example.com', 'editor@example.com');
  `)
}
