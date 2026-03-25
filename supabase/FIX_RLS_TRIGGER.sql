-- FIX: Drop the trigger that causes RLS conflicts during Insert
drop trigger if exists enforce_score_limit on public.golf_scores;
drop function if exists maintain_score_limit();

-- FIX: Re-define RLS policies for golf_scores to be explicit and less error-prone
drop policy if exists "Users can manage own scores" on public.golf_scores;
drop policy if exists "Admins can view all scores" on public.golf_scores;
drop policy if exists "Users can select own scores" on public.golf_scores;
drop policy if exists "Users can insert own scores" on public.golf_scores;
drop policy if exists "Users can update own scores" on public.golf_scores;
drop policy if exists "Users can delete own scores" on public.golf_scores;

-- 1. View (Select)
create policy "Users can view own scores" 
on public.golf_scores for select 
using (auth.uid() = user_id);

-- 2. Insert (With Check)
create policy "Users can insert own scores" 
on public.golf_scores for insert 
with check (auth.uid() = user_id);

-- 3. Update
create policy "Users can update own scores" 
on public.golf_scores for update 
using (auth.uid() = user_id);

-- 4. Delete
create policy "Users can delete own scores" 
on public.golf_scores for delete 
using (auth.uid() = user_id);

-- 5. Admin View
create policy "Admins can view all scores" 
on public.golf_scores for select 
using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
