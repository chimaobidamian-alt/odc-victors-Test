-- ODC VICTORS test store schema for Supabase Postgres.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text,
 email text,
 role text not null default 'customer' check (role in ('customer','admin')),
 created_at timestamptz not null default now()
);
create table if not exists public.categories (
 id uuid primary key default gen_random_uuid(),
 name text unique not null,
 slug text unique not null,
 created_at timestamptz not null default now()
);
create table if not exists public.products (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 slug text unique not null,
 category_id uuid references public.categories(id) on delete set null,
 category text not null default 'Shoes',
 audience text not null default 'Unisex',
 description text not null default '',
 price integer not null check (price >= 0),
 color text not null default 'Brown',
 sizes integer[] not null default '{}',
 stock integer not null default 0 check (stock >= 0),
 image_url text,
 images text[] not null default '{}',
 is_active boolean not null default true,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.orders (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete restrict,
 customer_name text not null,
 email text not null,
 phone text not null,
 delivery_address text not null,
 destination text not null,
 payment_method text not null check (payment_method in ('cod','paystack','whatsapp')),
 payment_status text not null default 'unpaid',
 payment_reference text,
 status text not null default 'pending',
 total_amount integer not null check (total_amount >= 0),
 created_at timestamptz not null default now()
);
create table if not exists public.order_items (
 id uuid primary key default gen_random_uuid(),
 order_id uuid not null references public.orders(id) on delete cascade,
 product_id text,
 product_name text not null,
 quantity integer not null check (quantity > 0),
 unit_price integer not null check (unit_price >= 0),
 size integer,
 color text
);
create table if not exists public.cart (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 product_id uuid not null references public.products(id) on delete cascade,
 quantity integer not null default 1 check (quantity > 0),
 size integer,
 color text,
 updated_at timestamptz not null default now(),
 unique(user_id, product_id, size, color)
);
create table if not exists public.reviews (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 product_id uuid not null references public.products(id) on delete cascade,
 rating integer not null check (rating between 1 and 5),
 title text,
 body text,
 is_approved boolean not null default false,
 created_at timestamptz not null default now(),
 unique(user_id, product_id)
);
create table if not exists public.wishlist (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 product_id uuid not null references public.products(id) on delete cascade,
 created_at timestamptz not null default now(),
 unique(user_id, product_id)
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into public.profiles(id, full_name, email)
 values(new.id, coalesce(new.raw_user_meta_data->>'full_name',new.raw_user_meta_data->>'name'),new.email)
 on conflict(id) do update set email=excluded.email;
 return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
 for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.cart enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlist enable row level security;

-- Clean old policies first
drop policy if exists "Profiles readable by owner" on public.profiles;
drop policy if exists "Profiles update own" on public.profiles;
drop policy if exists "Active products public read" on public.products;
drop policy if exists "Categories public read" on public.categories;
drop policy if exists "Customers read own orders" on public.orders;
drop policy if exists "Customers create own orders" on public.orders;
drop policy if exists "Customers read items from own orders" on public.order_items;
drop policy if exists "Customers add items to own orders" on public.order_items;
drop policy if exists "Own cart read" on public.cart;
drop policy if exists "Own cart manage" on public.cart;
drop policy if exists "Approved reviews public read" on public.reviews;
drop policy if exists "Own review create" on public.reviews;
drop policy if exists "Own review edit" on public.reviews;
drop policy if exists "Own wishlist manage" on public.wishlist;
drop policy if exists "Admins manage products" on public.products;
drop policy if exists "Admins manage orders" on public.orders;
drop policy if exists "Admins manage order items" on public.order_items;
drop policy if exists "Admins manage profiles" on public.profiles;
drop policy if exists "Admins moderate reviews" on public.reviews;

create policy "Profiles readable by owner" on public.profiles for select to authenticated using (auth.uid()=id);
create policy "Profiles update own" on public.profiles for update to authenticated using (auth.uid()=id) with check (auth.uid()=id);
create policy "Active products public read" on public.products for select to anon,authenticated using (is_active=true);
create policy "Categories public read" on public.categories for select to anon,authenticated using (true);
create policy "Customers read own orders" on public.orders for select to authenticated using (auth.uid()=user_id);
create policy "Customers create own orders" on public.orders for insert to authenticated with check (auth.uid()=user_id);
create policy "Customers read items from own orders" on public.order_items for select to authenticated using (exists(select 1 from public.orders o where o.id=order_id and o.user_id=auth.uid()));
create policy "Customers add items to own orders" on public.order_items for insert to authenticated with check (exists(select 1 from public.orders o where o.id=order_id and o.user_id=auth.uid()));
create policy "Own cart read" on public.cart for select to authenticated using (auth.uid()=user_id);
create policy "Own cart manage" on public.cart for all to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "Approved reviews public read" on public.reviews for select to anon,authenticated using (is_approved=true or auth.uid()=user_id);
create policy "Own review create" on public.reviews for insert to authenticated with check (auth.uid()=user_id);
create policy "Own review edit" on public.reviews for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "Own wishlist manage" on public.wishlist for all to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);

insert into public.categories(name,slug) values
 ('Shoes','shoes'),('Sandals','sandals'),('Pams','pams'),('Belts','belts'),('Wallets','wallets')
on conflict(slug) do nothing;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.profiles where id=auth.uid() and role='admin');
$$;
create policy "Admins manage products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage orders" on public.orders for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage order items" on public.order_items for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage profiles" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins moderate reviews" on public.reviews for all to authenticated using (public.is_admin()) with check (public.is_admin());