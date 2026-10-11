-- Superadmin jest uznawany za superadmina tylko po pełnym MFA (AAL2).
create or replace function public.is_superadmin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select
    coalesce((select auth.jwt() ->> 'aal'), 'aal1') = 'aal2'
    and exists (
      select 1
      from public.profiles
      where id = auth.uid()
        and role = 'superadmin'
        and active = true
    );
$$;

revoke all on function public.is_superadmin() from public;
grant execute on function public.is_superadmin() to authenticated;


-- Helper dla wszystkich przyszłych operacji w panelu.
-- Pozwala zapisywać dane tylko aktywnemu adminowi/superadminowi z MFA.
create or replace function public.is_admin_aal2()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select
    coalesce((select auth.jwt() ->> 'aal'), 'aal1') = 'aal2'
    and exists (
      select 1
      from public.profiles
      where id = auth.uid()
        and role in ('admin', 'superadmin')
        and active = true
    );
$$;

revoke all on function public.is_admin_aal2() from public;
grant execute on function public.is_admin_aal2() to authenticated;
