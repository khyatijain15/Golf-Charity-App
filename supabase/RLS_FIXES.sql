-- 1. Fix Draw Entries RLS (Missing policies caused restricted access)
alter table public.draw_entries enable row level security;

create policy "Users can view own draw entries" on public.draw_entries
  for select using (auth.uid() = user_id);

create policy "Admins can manage all draw entries" on public.draw_entries
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- 2. Enhance Profile Access for Admins (Allow update/delete, not just view)
create policy "Admins can manage all profiles" on public.profiles
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- 3. Ensure Golf Scores are manageable by Users without trigger conflicts (Optional if API logic handles it, but good for safety)
-- Note regarding INSERT: The application layer now handles the 5-score limit check to avoid trigger RLS issues.
