-- =========================================================
-- VELOX — Initial schema
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- PROFILES (1:1 com auth.users)
-- ---------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  -- reserved for a future /admin panel, without requiring a destructive migration
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- CATEGORIES
-- ---------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_categories_slug on public.categories (slug);

-- ---------------------------------------------------------
-- PRODUCTS
-- ---------------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  price numeric(10, 2) not null check (price >= 0),
  compare_at_price numeric(10, 2) check (compare_at_price is null or compare_at_price >= 0),
  category_id uuid references public.categories (id) on delete set null,
  brand text default 'VELOX',
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  featured boolean not null default false,
  is_new boolean not null default false,
  is_sale boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_products_slug on public.products (slug);
create index idx_products_category on public.products (category_id);
create index idx_products_status on public.products (status);
create index idx_products_featured on public.products (featured) where featured = true;
create index idx_products_is_new on public.products (is_new) where is_new = true;
create index idx_products_is_sale on public.products (is_sale) where is_sale = true;

-- ---------------------------------------------------------
-- PRODUCT IMAGES
-- ---------------------------------------------------------
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_product_images_product on public.product_images (product_id, sort_order);

-- ---------------------------------------------------------
-- PRODUCT VARIANTS (size / color / stock)
-- ---------------------------------------------------------
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  size text not null,
  color text,
  sku text unique,
  stock int not null default 0 check (stock >= 0),
  price numeric(10, 2) check (price is null or price >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, size, color)
);

create index idx_product_variants_product on public.product_variants (product_id);

-- ---------------------------------------------------------
-- FAVORITES / WISHLIST
-- ---------------------------------------------------------
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index idx_favorites_user on public.favorites (user_id);

-- ---------------------------------------------------------
-- ADDRESSES
-- ---------------------------------------------------------
create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  street text not null,
  number text not null,
  complement text,
  neighborhood text not null,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'BR',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_addresses_user on public.addresses (user_id);

-- ---------------------------------------------------------
-- ORDERS
-- ---------------------------------------------------------
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  shipping numeric(10, 2) not null default 0 check (shipping >= 0),
  total numeric(10, 2) not null check (total >= 0),
  shipping_address jsonb not null,
  payment_method text check (payment_method in ('credit_card', 'pix', 'boleto')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_user on public.orders (user_id, created_at desc);

-- ---------------------------------------------------------
-- ORDER ITEMS (snapshot — does not depend on the product's current data)
-- ---------------------------------------------------------
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  product_image text,
  size text,
  color text,
  quantity int not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  total_price numeric(10, 2) not null check (total_price >= 0)
);

create index idx_order_items_order on public.order_items (order_id);

-- ---------------------------------------------------------
-- REVIEWS (reserved structure — not exposed in the UI yet)
-- Created now so a large migration/refactor isn't needed later.
-- ---------------------------------------------------------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  title text,
  comment text,
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);

create index idx_reviews_product on public.reviews (product_id);

-- ---------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger trg_products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

create trigger trg_variants_updated_at before update on public.product_variants
  for each row execute function public.set_updated_at();

create trigger trg_addresses_updated_at before update on public.addresses
  for each row execute function public.set_updated_at();

create trigger trg_orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- Automatically creates a profile when a user registers
-- ---------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------
-- Ensures a single default address per user
-- ---------------------------------------------------------
create or replace function public.enforce_single_default_address()
returns trigger
language plpgsql
as $$
begin
  if new.is_default then
    update public.addresses
      set is_default = false
      where user_id = new.user_id and id <> new.id;
  end if;
  return new;
end;
$$;

create trigger trg_single_default_address
  after insert or update of is_default on public.addresses
  for each row when (new.is_default) execute function public.enforce_single_default_address();
