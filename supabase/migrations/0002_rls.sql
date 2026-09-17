-- =========================================================
-- VELOX — Row Level Security
-- =========================================================

-- Helper: checks whether the current user is an admin (for future use in /admin)
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------
-- PROFILES
-- ---------------------------------------------------------
alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------------------------------------------------------
-- CATEGORIES (public read, write restricted to admin)
-- ---------------------------------------------------------
alter table public.categories enable row level security;

create policy "categories_select_public"
  on public.categories for select
  using (true);

create policy "categories_write_admin"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------
-- PRODUCTS (public read of active items, write restricted to admin)
-- ---------------------------------------------------------
alter table public.products enable row level security;

create policy "products_select_active"
  on public.products for select
  using (status = 'active' or public.is_admin());

create policy "products_write_admin"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------
-- PRODUCT IMAGES
-- ---------------------------------------------------------
alter table public.product_images enable row level security;

create policy "product_images_select_public"
  on public.product_images for select
  using (true);

create policy "product_images_write_admin"
  on public.product_images for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------
-- PRODUCT VARIANTS
-- ---------------------------------------------------------
alter table public.product_variants enable row level security;

create policy "product_variants_select_public"
  on public.product_variants for select
  using (true);

create policy "product_variants_write_admin"
  on public.product_variants for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------
-- FAVORITES
-- ---------------------------------------------------------
alter table public.favorites enable row level security;

create policy "favorites_select_own"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "favorites_insert_own"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "favorites_delete_own"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------
-- ADDRESSES
-- ---------------------------------------------------------
alter table public.addresses enable row level security;

create policy "addresses_select_own"
  on public.addresses for select
  using (auth.uid() = user_id);

create policy "addresses_insert_own"
  on public.addresses for insert
  with check (auth.uid() = user_id);

create policy "addresses_update_own"
  on public.addresses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "addresses_delete_own"
  on public.addresses for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------
-- ORDERS
-- ---------------------------------------------------------
alter table public.orders enable row level security;

create policy "orders_select_own"
  on public.orders for select
  using (auth.uid() = user_id or public.is_admin());

create policy "orders_insert_own"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- orders are not editable/deletable by the customer in this version
create policy "orders_update_admin"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------
-- ORDER ITEMS (acesso via join com orders.user_id)
-- ---------------------------------------------------------
alter table public.order_items enable row level security;

create policy "order_items_select_own"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "order_items_insert_own"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------
-- REVIEWS (reserved — policies are already correct for when the feature is enabled)
-- ---------------------------------------------------------
alter table public.reviews enable row level security;

create policy "reviews_select_public"
  on public.reviews for select
  using (true);

create policy "reviews_insert_own"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "reviews_update_own"
  on public.reviews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "reviews_delete_own"
  on public.reviews for delete
  using (auth.uid() = user_id or public.is_admin());
