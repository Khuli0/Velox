-- =========================================================
-- VELOX — Demo seed data
-- Replace the image URLs with real Storage assets.
-- =========================================================

insert into public.categories (name, slug, description, image_url, sort_order) values
  ('Men', 'men', 'Performance clothing and footwear for men.', 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=1200', 1),
  ('Women', 'women', 'Performance clothing and footwear for women.', 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=1200', 2),
  ('Shoes', 'shoes', 'Running and training shoes.', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200', 3),
  ('Accessories', 'accessories', 'Bags, caps, socks, and more.', 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=1200', 4),
  ('Sale', 'sale', 'Selected pieces at a discount.', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200', 5);

-- ---------------------------------------------------------
-- VELOX X1 (Running shoe)
-- ---------------------------------------------------------
with c as (select id from public.categories where slug = 'shoes'),
p as (
  insert into public.products
    (name, slug, description, short_description, price, compare_at_price, category_id, status, featured, is_new, is_sale)
  select
    'VELOX X1', 'velox-x1',
    'Performance running shoe engineered for maximum responsiveness and comfort over long distances. Breathable mesh upper with reactive cushioning midsole.',
    'Running performance shoe.',
    599.90, 699.90, c.id, 'active', true, true, true
  from c
  returning id
)
insert into public.product_images (product_id, image_url, alt_text, sort_order)
select p.id, img, alt, ord from p,
  (values
    ('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200', 'VELOX X1 side view', 0),
    ('https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200', 'VELOX X1 top view', 1)
  ) as imgs(img, alt, ord);

insert into public.product_variants (product_id, size, color, sku, stock)
select p.id, size, 'Black', 'VX1-' || size, stock
from public.products p,
  (values ('38', 10), ('39', 14), ('40', 12), ('41', 9), ('42', 7), ('43', 5)) as v(size, stock)
where p.slug = 'velox-x1';

-- ---------------------------------------------------------
-- VELOX RUNNER
-- ---------------------------------------------------------
with c as (select id from public.categories where slug = 'shoes'),
p as (
  insert into public.products
    (name, slug, description, short_description, price, category_id, status, featured, is_new)
  select
    'VELOX RUNNER', 'velox-runner',
    'Lightweight with great energy return for everyday training. Dual-layer construction for extra durability.',
    'Daily trainer.',
    449.90, c.id, 'active', true, true
  from c
  returning id
)
insert into public.product_images (product_id, image_url, alt_text, sort_order)
select p.id, img, alt, ord from p,
  (values
    ('https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200', 'VELOX RUNNER side view', 0)
  ) as imgs(img, alt, ord);

insert into public.product_variants (product_id, size, color, sku, stock)
select p.id, size, 'Grey', 'VRN-' || size, stock
from public.products p,
  (values ('38', 8), ('39', 11), ('40', 15), ('41', 10), ('42', 6)) as v(size, stock)
where p.slug = 'velox-runner';

-- ---------------------------------------------------------
-- VELOX TRAIN
-- ---------------------------------------------------------
with c as (select id from public.categories where slug = 'shoes'),
p as (
  insert into public.products
    (name, slug, description, short_description, price, category_id, status)
  select
    'VELOX TRAIN', 'velox-train',
    'Stability and traction for functional training and lifting. Flat sole with multidirectional grip.',
    'Cross-training shoe.',
    519.90, c.id, 'active'
  from c
  returning id
)
insert into public.product_images (product_id, image_url, alt_text, sort_order)
select p.id, img, alt, ord from p,
  (values
    ('https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200', 'VELOX TRAIN side view', 0)
  ) as imgs(img, alt, ord);

insert into public.product_variants (product_id, size, color, sku, stock)
select p.id, size, 'Black', 'VTR-' || size, stock
from public.products p,
  (values ('39', 6), ('40', 9), ('41', 8), ('42', 5)) as v(size, stock)
where p.slug = 'velox-train';

-- ---------------------------------------------------------
-- VELOX MOTION (women's leggings)
-- ---------------------------------------------------------
with c as (select id from public.categories where slug = 'women'),
p as (
  insert into public.products
    (name, slug, description, short_description, price, compare_at_price, category_id, status, is_new, is_sale)
  select
    'VELOX MOTION LEGGING', 'velox-motion-legging',
    'Compression legging in quick-dry fabric with a high waistband. Full range of motion, no restrictions.',
    'High-waist performance legging.',
    259.90, 329.90, c.id, 'active', true, true
  from c
  returning id
)
insert into public.product_images (product_id, image_url, alt_text, sort_order)
select p.id, img, alt, ord from p,
  (values
    ('https://images.unsplash.com/photo-1594381898411-846e7d193883?w=1200', 'VELOX MOTION legging', 0)
  ) as imgs(img, alt, ord);

insert into public.product_variants (product_id, size, color, sku, stock)
select p.id, size, 'Black', 'VML-' || size, stock
from public.products p,
  (values ('P', 12), ('M', 15), ('G', 10), ('GG', 4)) as v(size, stock)
where p.slug = 'velox-motion-legging';

-- ---------------------------------------------------------
-- VELOX PERFORMANCE JACKET (men's)
-- ---------------------------------------------------------
with c as (select id from public.categories where slug = 'men'),
p as (
  insert into public.products
    (name, slug, description, short_description, price, category_id, status, featured)
  select
    'VELOX PERFORMANCE JACKET', 'velox-performance-jacket',
    'Windproof jacket in AEROFLEX™ fabric with an adjustable hood. Protection without sacrificing mobility.',
    'Windproof performance jacket.',
    698.90, c.id, 'active', true
  from c
  returning id
)
insert into public.product_images (product_id, image_url, alt_text, sort_order)
select p.id, img, alt, ord from p,
  (values
    ('https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200', 'VELOX Performance Jacket', 0)
  ) as imgs(img, alt, ord);

insert into public.product_variants (product_id, size, color, sku, stock)
select p.id, size, 'Black', 'VPJ-' || size, stock
from public.products p,
  (values ('P', 6), ('M', 10), ('G', 8), ('GG', 3)) as v(size, stock)
where p.slug = 'velox-performance-jacket';

-- ---------------------------------------------------------
-- VELOX AIR TECH TEE
-- ---------------------------------------------------------
with c as (select id from public.categories where slug = 'men'),
p as (
  insert into public.products
    (name, slug, description, short_description, price, category_id, status, is_new)
  select
    'VELOX AIR TECH TEE', 'velox-air-tech-tee',
    'Technical tee in DRYCORE™ fabric that wicks moisture away and keeps you dry.',
    'Technical training tee.',
    189.90, c.id, 'active', true
  from c
  returning id
)
insert into public.product_images (product_id, image_url, alt_text, sort_order)
select p.id, img, alt, ord from p,
  (values
    ('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200', 'VELOX Air Tech Tee', 0)
  ) as imgs(img, alt, ord);

insert into public.product_variants (product_id, size, color, sku, stock)
select p.id, size, 'Off-White', 'VAT-' || size, stock
from public.products p,
  (values ('P', 14), ('M', 20), ('G', 16), ('GG', 8)) as v(size, stock)
where p.slug = 'velox-air-tech-tee';

-- ---------------------------------------------------------
-- VELOX BACKPACK (accessory)
-- ---------------------------------------------------------
with c as (select id from public.categories where slug = 'accessories'),
p as (
  insert into public.products
    (name, slug, description, short_description, price, category_id, status)
  select
    'VELOX BACKPACK', 'velox-backpack',
    'Waterproof backpack with a dedicated laptop compartment and insulated pocket.',
    'Waterproof training backpack.',
    349.90, c.id, 'active'
  from c
  returning id
)
insert into public.product_images (product_id, image_url, alt_text, sort_order)
select p.id, img, alt, ord from p,
  (values
    ('https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=1200', 'VELOX Backpack', 0)
  ) as imgs(img, alt, ord);

insert into public.product_variants (product_id, size, color, sku, stock)
select p.id, 'U', 'Black', 'VBP-U', 25
from public.products p where p.slug = 'velox-backpack';
