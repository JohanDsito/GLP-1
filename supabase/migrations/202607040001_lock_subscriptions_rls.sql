-- Subscriptions must never be written by the client. Only the Stripe webhook
-- (running with the service role key) is allowed to set who is subscribed;
-- otherwise any authenticated user could grant themselves access for free.

drop policy if exists "Subscriptions are insertable by service role or owner" on public.subscriptions;
create policy "Subscriptions are insertable by service role"
on public.subscriptions
for insert
with check (auth.role() = 'service_role');

drop policy if exists "Subscriptions are updatable by service role or owner" on public.subscriptions;
create policy "Subscriptions are updatable by service role"
on public.subscriptions
for update
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "Subscriptions are deletable by service role or owner" on public.subscriptions;
create policy "Subscriptions are deletable by service role"
on public.subscriptions
for delete
using (auth.role() = 'service_role');
