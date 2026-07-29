-- ============================================================================
-- Coupons that unlock the Muscle Plan (exercise section) for early buyers.
-- Codes stay server-side (no select policy); redemption runs through a
-- SECURITY DEFINER function so the client never reads the coupon table.
-- ============================================================================

create table if not exists public.muscle_plan_coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  active boolean not null default true,
  max_redemptions integer,          -- null = unlimited
  redeemed_count integer not null default 0,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.muscle_plan_coupon_redemptions (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.muscle_plan_coupons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  unique (user_id)                  -- one unlock per user
);

alter table public.muscle_plan_coupons enable row level security;
alter table public.muscle_plan_coupon_redemptions enable row level security;
-- Intentionally no SELECT/INSERT policies for end users: everything goes
-- through redeem_muscle_plan_coupon(), which runs as the definer.

create or replace function public.redeem_muscle_plan_coupon(p_code text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_coupon public.muscle_plan_coupons;
begin
  if v_user is null then
    return 'unauthorized';
  end if;

  select * into v_coupon
  from public.muscle_plan_coupons
  where lower(code) = lower(trim(p_code)) and active = true
  limit 1;

  if not found then
    return 'invalid';
  end if;

  if v_coupon.max_redemptions is not null and v_coupon.redeemed_count >= v_coupon.max_redemptions then
    return 'exhausted';
  end if;

  if exists (select 1 from public.subscriptions where user_id = v_user and has_muscle_plan = true) then
    return 'already';
  end if;

  begin
    insert into public.muscle_plan_coupon_redemptions (coupon_id, user_id)
    values (v_coupon.id, v_user);
  exception when unique_violation then
    return 'already';
  end;

  update public.muscle_plan_coupons
    set redeemed_count = redeemed_count + 1
    where id = v_coupon.id;

  insert into public.subscriptions (user_id, has_muscle_plan)
  values (v_user, true)
  on conflict (user_id) do update set has_muscle_plan = true;

  return 'ok';
end;
$$;

revoke all on function public.redeem_muscle_plan_coupon(text) from anon;
grant execute on function public.redeem_muscle_plan_coupon(text) to authenticated;

-- Example starter coupon for the first buyers (edit/add your own in the dashboard):
insert into public.muscle_plan_coupons (code, max_redemptions, note)
values ('LUMEA-EJERCICIO', 100, 'Cupon de lanzamiento para primeros compradores')
on conflict (code) do nothing;
