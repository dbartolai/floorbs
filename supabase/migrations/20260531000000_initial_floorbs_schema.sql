create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create schema if not exists private;

do $$
begin
  create type public.game_status as enum ('scheduled', 'live', 'final');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.feed_post_type as enum (
    'score_update',
    'final_score',
    'standings_update',
    'announcement',
    'smack'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  start_date date not null,
  end_date date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  name text not null,
  short_name text not null,
  city text,
  logo_url text,
  pool text,
  created_at timestamptz not null default now()
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  name text not null,
  jersey_number integer,
  created_at timestamptz not null default now()
);

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  home_team_id uuid not null references public.teams(id) on delete restrict,
  away_team_id uuid not null references public.teams(id) on delete restrict,
  court text not null,
  scheduled_start timestamptz not null,
  status public.game_status not null default 'scheduled',
  home_score integer not null default 0 check (home_score >= 0),
  away_score integer not null default 0 check (away_score >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (home_team_id <> away_team_id)
);

create table if not exists public.feed_posts (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  game_id uuid references public.games(id) on delete set null,
  type public.feed_post_type not null,
  title text not null,
  body text,
  created_by text,
  created_at timestamptz not null default now()
);

create table if not exists public.scorer_codes (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  code_hash text not null,
  display_name text not null,
  role text not null default 'scorer',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists scorer_codes_code_hash_idx
  on public.scorer_codes (code_hash)
  where active is true;

create index if not exists teams_tournament_idx on public.teams (tournament_id);
create index if not exists players_tournament_team_idx on public.players (tournament_id, team_id);
create index if not exists games_tournament_start_idx on public.games (tournament_id, scheduled_start);
create index if not exists games_status_idx on public.games (status);
create index if not exists feed_posts_tournament_created_idx
  on public.feed_posts (tournament_id, created_at desc);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists games_set_updated_at on public.games;
create trigger games_set_updated_at
before update on public.games
for each row
execute function private.set_updated_at();

alter table public.tournaments enable row level security;
alter table public.teams enable row level security;
alter table public.players enable row level security;
alter table public.games enable row level security;
alter table public.feed_posts enable row level security;
alter table public.scorer_codes enable row level security;

drop policy if exists "Public can read tournaments" on public.tournaments;
create policy "Public can read tournaments"
on public.tournaments
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read teams" on public.teams;
create policy "Public can read teams"
on public.teams
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read players" on public.players;
create policy "Public can read players"
on public.players
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read games" on public.games;
create policy "Public can read games"
on public.games
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read feed posts" on public.feed_posts;
create policy "Public can read feed posts"
on public.feed_posts
for select
to anon, authenticated
using (true);

grant usage on schema public to anon, authenticated, service_role;

revoke insert, update, delete on table
  public.tournaments,
  public.teams,
  public.players,
  public.games,
  public.feed_posts
from anon, authenticated;

grant select on table
  public.tournaments,
  public.teams,
  public.players,
  public.games,
  public.feed_posts
to anon, authenticated;

grant select, insert, update, delete on table
  public.tournaments,
  public.teams,
  public.players,
  public.games,
  public.feed_posts,
  public.scorer_codes
to service_role;

revoke all on table public.scorer_codes from anon, authenticated;
grant usage, select on all sequences in schema public to service_role;
