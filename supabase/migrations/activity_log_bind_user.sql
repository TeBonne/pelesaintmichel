-- Bind activity_log inserts to the current user's email
-- Prevents editors from logging actions as other users
alter policy "members can insert" on activity_log
  using (true)
  with check ((auth.jwt() ->> 'email')::text = user_email);
