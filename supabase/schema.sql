create extension if not exists pgcrypto;

create table public.charities (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  image_url text,
  event_description text,
  event_date date,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  email text not null,
  subscription_status text default 'inactive' check (subscription_status in ('active', 'inactive', 'lapsed')),
  subscription_plan text check (subscription_plan in ('monthly', 'yearly')),
  subscription_renewal_date timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  selected_charity_id uuid references public.charities(id),
  charity_percentage integer default 10 check (charity_percentage >= 10),
  is_admin boolean default false,
  role text default 'public' check (role in ('public', 'subscriber', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ensure profiles are created on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table public.golf_scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  score integer not null check (score between 1 and 45),
  played_date date not null,
  created_at timestamptz default now()
);

-- Trigger to maintain only last 5 scores per user
create or replace function maintain_score_limit()
returns trigger as $$
declare
  score_count int;
begin
  select count(*) into score_count from public.golf_scores where user_id = new.user_id;
  if score_count >= 5 then
    delete from public.golf_scores 
    where id in (
      select id from public.golf_scores 
      where user_id = new.user_id 
      order by played_date asc, created_at asc 
      limit (score_count - 4)
    );
  end if;
  return new;
end;
$$ language plpgsql;

create trigger enforce_score_limit
  before insert on public.golf_scores
  for each row execute procedure maintain_score_limit();

create table public.draws (
  id uuid default gen_random_uuid() primary key,
  draw_month date not null,
  status text default 'pending' check (status in ('pending', 'simulated', 'published')),
  draw_type text default 'random' check (draw_type in ('random', 'algorithmic')),
  winning_numbers integer[],
  jackpot_amount numeric(10,2) default 0,
  pool_4match numeric(10,2) default 0,
  pool_3match numeric(10,2) default 0,
  jackpot_rolled_over boolean default false,
  created_at timestamptz default now()
);

create table public.draw_entries (
  id uuid default gen_random_uuid() primary key,
  draw_id uuid references public.draws(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  scores_snapshot integer[],
  match_count integer,
  prize_amount numeric(10,2) default 0,
  created_at timestamptz default now()
);

create table public.winners (
  id uuid default gen_random_uuid() primary key,
  draw_id uuid references public.draws(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  match_type text check (match_type in ('5_match', '4_match', '3_match')),
  prize_amount numeric(10,2) not null,
  proof_url text,
  verification_status text default 'pending' check (verification_status in ('pending', 'approved', 'rejected')),
  payment_status text default 'pending' check (payment_status in ('pending', 'paid')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table for tracking Stripe events for audit
create table public.subscription_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  stripe_event_id text unique,
  event_type text not null,
  amount numeric(10,2),
  currency text default 'gbp',
  status text,
  created_at timestamptz default now()
);

-- RLS Policies
alter table public.charities enable row level security;
alter table public.profiles enable row level security;
alter table public.golf_scores enable row level security;
alter table public.draws enable row level security;
alter table public.draw_entries enable row level security;
alter table public.winners enable row level security;
alter table public.subscription_events enable row level security;

-- Profiles: Users can read own, Admin can read all
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
  
-- Charities: Public read, Admin write
create policy "Public can view active charities" on public.charities
  for select using (is_active = true);
create policy "Admins can manage charities" on public.charities
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Golf Scores: Users can manage own scores, Admin view all
create policy "Users can manage own scores" on public.golf_scores
  for all using (auth.uid() = user_id);
create policy "Admins can view all scores" on public.golf_scores
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Draws: Public read published draws, Admin manage all
create policy "Public can view published draws" on public.draws
  for select using (status = 'published');
create policy "Admins can manage draws" on public.draws
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Winners: Users read own, Public read approved winners (restricted columns ideally), Admin manage
create policy "Users can view own winnings" on public.winners
  for select using (auth.uid() = user_id);
create policy "Public can view approved winners" on public.winners
  for select using (verification_status = 'approved');
create policy "Admins can manage winners" on public.winners
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

