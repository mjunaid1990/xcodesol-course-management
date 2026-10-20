# Editor guide

Open `/admin` and sign in with your editor or administrator account. Editors can manage course and site content. Administrators can also manage users, enrollments, and review approvals.

## Add a course

1. Open **Courses** and choose **Create New**.
2. Enter the title, unique URL slug, summary, description, price, currency, level, and category. Add learning outcomes, requirements, FAQs, thumbnail, and SEO fields as needed.
3. Save the course as a draft.
4. In **Sections**, create ordered sections linked to the course. In **Lessons**, create lessons linked to each section, set their order and type, and mark only suitable lessons as free previews.
5. Return to the course and use its preview link to review the draft. Publish it when ready or set a scheduled publish date using the version controls.

## Build a page from blocks

1. Open **Pages**, create a page, and set its title and unique slug. Use `home` for the homepage.
2. Add blocks in **Layout** and fill in each block's fields. Reorder blocks in the editor to change their display order.
3. Save as a draft, open the preview link, then publish when ready.

## Publish a blog post

1. Open **Posts** and create a post with a title, unique slug, excerpt, content, author, categories, and cover image.
2. Add SEO title and description. Set the published date if needed.
3. Preview the draft, then publish now or schedule it from the version controls.

## Edit navigation and site details

1. Open **Site Settings**.
2. Edit the **Navigation** and **Footer Navigation** rows. Each row has a visible label and destination URL.
3. Save. The public layout is revalidated after the change. Site name, announcement, social links, SEO defaults, logo, and brand settings are managed here too.

## Manage students and reviews

Administrators manage accounts in **Users** and can create or update enrollments in **Enrollments**. Students can see only their own enrollment and progress records. Enrolled students submit reviews through the API; an administrator must approve each review in **Reviews** before it appears on a public course page.

## Media and course files

Use **Media** for public images such as thumbnails and blog covers, and provide accurate alt text. Attach lesson downloads in the lesson's **Resources** field; these use the private Course Resources collection and are available only to staff, free-preview viewers, or students enrolled in the published course. Files are stored in a private Supabase Storage bucket and downloads use short-lived signed links. Uploads are limited to 4 MiB. Configure the `SUPABASE_S3_*` environment variables on Vercel; the S3 credentials must remain server-side. Supabase's Free plan includes 1 GB of storage and may pause projects after a week without activity.

For video lessons, enter the Mux **signed playback ID** in the lesson's video field; this is the playback ID associated with a signed playback policy, not the Mux asset ID. Add `MUX_SIGNING_KEY_ID` and the base64-encoded `MUX_PRIVATE_KEY` to the server environment. The player requests a short-lived token after the lesson page checks access.
