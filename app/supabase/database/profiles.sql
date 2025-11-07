-- Genel "profiles" için bir tablo oluşturun
create table profiles (
  id uuid references auth.users not null,

  username text unique,
  avatar_url text,
  birth_date date,
  age integer,
  gender text,
  location text,
  website text,
  faceboook text,
  instagram text,
  twitter text,
  linkedin text,
  youtube text,
  twitch text,
  bio text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- updated_at timestamp with time zone,
  primary key (id),
  unique(username)
);

alter table profiles enable row level security;

-- Herkese açık profiller herkes tarafından görülebilir.
create policy "Herkese açık profiller herkes tarafından görülebilir."
  on profiles for select using ( true );

-- Kullanıcılar kendi profillerini ekleyebilirler.
create policy "Kullanıcılar kendi profillerini ekleyebilirler."
  on profiles for insert
  with check ( (select auth.uid()) = id );

-- Kullanıcılar kendi profillerini güncelleyebilirler.
create policy "Kullanıcılar kendi profillerini güncelleyebilirler."
  on profiles for update using ( (select auth.uid()) = id );

-- Set up Realtime!
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table profiles;

-- Set up Storage!
insert into storage.buckets (id, name)
values ('avatars', 'avatars');

-- Avatar resimleri herkesin erişimine açıktır.
create policy "Avatar resimleri herkesin erişimine açıktır."
  on storage.objects for select using ( bucket_id = 'avatars' );

-- Herkes avatar yükleyebilir.
create policy "Herkes avatar yükleyebilir." on storage.objects for insert
  with check ( bucket_id = 'avatars' );