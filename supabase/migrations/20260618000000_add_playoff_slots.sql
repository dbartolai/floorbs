alter table public.games
  alter column home_team_id drop not null,
  alter column away_team_id drop not null;

alter table public.games
  add column if not exists phase text not null default 'pool',
  add column if not exists title text not null default 'Pool Play',
  add column if not exists home_source_type text not null default 'team',
  add column if not exists home_source_value text,
  add column if not exists away_source_type text not null default 'team',
  add column if not exists away_source_value text;

update public.games
set
  phase = coalesce(phase, 'pool'),
  title = coalesce(title, 'Pool Play'),
  home_source_type = coalesce(home_source_type, 'team'),
  home_source_value = coalesce(home_source_value, home_team_id::text),
  away_source_type = coalesce(away_source_type, 'team'),
  away_source_value = coalesce(away_source_value, away_team_id::text);

alter table public.games
  drop constraint if exists games_phase_check,
  add constraint games_phase_check check (phase in ('pool', 'playoff'));

alter table public.games
  drop constraint if exists games_home_source_type_check,
  add constraint games_home_source_type_check
    check (home_source_type in ('tbd', 'team', 'seed', 'winner', 'loser'));

alter table public.games
  drop constraint if exists games_away_source_type_check,
  add constraint games_away_source_type_check
    check (away_source_type in ('tbd', 'team', 'seed', 'winner', 'loser'));

create index if not exists games_phase_idx on public.games (phase);
