-- Run this in your Supabase SQL editor

create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  option text not null,
  created_at timestamptz default now() not null
);

-- Allow anyone to insert and read votes (public poll)
alter table votes enable row level security;

create policy "Anyone can vote"
  on votes for insert
  to anon
  with check (true);

create policy "Anyone can read results"
  on votes for select
  to anon
  using (true);
