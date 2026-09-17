# VELOX — Supabase Setup

## 1. Create the project
Create a project at [supabase.com](https://supabase.com) and copy the **Project URL** and the **anon public key**.

## 2. Run the migrations
In the Supabase dashboard's SQL Editor, run the files in `migrations/` **in this order**:

1. `0001_schema.sql` — tables, relationships, indexes, triggers
2. `0002_rls.sql` — Row Level Security policies
3. `0003_storage.sql` — `product-images` bucket and storage policies

Or, using the Supabase CLI:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

## 3. Run the seed (optional, demo data)

```bash
psql "<connection-string>" -f seed.sql
```

Or paste the contents of `seed.sql` into the SQL Editor.

## 4. Environment variables
Copy `.env.example` to `.env` at the project root and fill it in:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxx
```

**Never** put the `service_role key` in the frontend — it's never needed on the client with RLS properly configured.

## 5. Make a user admin (access the `/admin` panel)
```sql
update public.profiles set role = 'admin' where email = 'your-email@example.com';
```
The `profiles` table already has a `role` column, and the `is_admin()` function is already used in the write policies for `products`, `categories`, `product_images`, and `product_variants` — that's why the `/admin` panel (create/edit/remove products, manage stock and variants, upload images) works with no schema changes at all.

**Important:** after running this SQL, if the person is already logged into the site, they need to **log out and back in** (or refresh the page) for the "Admin" link to show up in the menu — the app loads the profile (with the `role`) once per session.

The "Admin" link only appears in the menu for users with `role = 'admin'`. Anyone without admin access who tries to visit `/admin` directly by URL is redirected to the Home page, without seeing any content from that route.

## About `reviews`
The `reviews` table and its policies already exist in the schema, but no screen in the app uses it yet. This avoids a large migration/refactor when the reviews feature is implemented — you'll just need to create the `reviewService` and the UI components.
