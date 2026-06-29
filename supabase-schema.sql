-- ============================================================
--  麺帳 フレンド機能 スキーマ (Supabase SQL Editor に貼って実行)
-- ============================================================

-- 1) プロフィール ------------------------------------------------
create table if not exists profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  handle       text unique not null,
  display_name text,
  created_at   timestamptz default now()
);
alter table profiles enable row level security;
create policy "profiles readable" on profiles
  for select to authenticated using (true);
create policy "insert own profile" on profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "update own profile" on profiles
  for update to authenticated using (auth.uid() = id);

-- 2) フレンド関係 ------------------------------------------------
create table if not exists friendships (
  id         uuid primary key default gen_random_uuid(),
  requester  uuid not null references auth.users(id) on delete cascade,
  addressee  uuid not null references auth.users(id) on delete cascade,
  status     text not null default 'pending',   -- pending | accepted
  created_at timestamptz default now(),
  unique (requester, addressee)
);
alter table friendships enable row level security;
create policy "see own friendships" on friendships
  for select to authenticated using (auth.uid() = requester or auth.uid() = addressee);
create policy "create request" on friendships
  for insert to authenticated with check (auth.uid() = requester);
create policy "respond/own" on friendships
  for update to authenticated using (auth.uid() = addressee or auth.uid() = requester);
create policy "delete own friendship" on friendships
  for delete to authenticated using (auth.uid() = requester or auth.uid() = addressee);

-- 2人が承認済みフレンドかどうか
create or replace function are_friends(a uuid, b uuid)
returns boolean language sql stable security definer as $$
  select exists(
    select 1 from friendships f
    where f.status = 'accepted'
      and ((f.requester = a and f.addressee = b)
        or (f.requester = b and f.addressee = a))
  );
$$;

-- 3) 麺の記録（クラウド同期分） ----------------------------------
create table if not exists noodles (
  id         text primary key,                  -- ローカル記録ID をそのまま使用
  user_id    uuid not null references auth.users(id) on delete cascade,
  menu  text, shop text, type text,
  stars int,  price text, date text,
  memo  text, tags text[], photo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table noodles enable row level security;
create policy "owner full access" on noodles
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "friends can read" on noodles
  for select to authenticated using (are_friends(auth.uid(), user_id));

-- 4) 写真ストレージのポリシー -----------------------------------
--  事前に Storage で「noodle-photos」バケットを Public で作成しておくこと。
create policy "public read noodle photos" on storage.objects
  for select using (bucket_id = 'noodle-photos');
create policy "upload own noodle photos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'noodle-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "update own noodle photos" on storage.objects
  for update to authenticated
  using (bucket_id = 'noodle-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "delete own noodle photos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'noodle-photos' and (storage.foldername(name))[1] = auth.uid()::text);
