create table if not exists public.engineering_materials_profiles (
  username text primary key check (username ~ '^[a-z0-9_]{2,32}$'),
  state jsonb not null default '{}'::jsonb,
  state_text text not null default '{}',
  revision bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.engineering_materials_profiles enable row level security;

grant select, insert, update on table public.engineering_materials_profiles to anon, authenticated;

drop policy if exists engineering_materials_profiles_select_own_username on public.engineering_materials_profiles;
drop policy if exists engineering_materials_profiles_insert_own_username on public.engineering_materials_profiles;
drop policy if exists engineering_materials_profiles_update_own_username on public.engineering_materials_profiles;

create policy engineering_materials_profiles_select_own_username
on public.engineering_materials_profiles
for select
to anon, authenticated
using (username = (select current_setting('app.engineering_materials_profile_username', true)));

create policy engineering_materials_profiles_insert_own_username
on public.engineering_materials_profiles
for insert
to anon, authenticated
with check (username = (select current_setting('app.engineering_materials_profile_username', true)));

create policy engineering_materials_profiles_update_own_username
on public.engineering_materials_profiles
for update
to anon, authenticated
using (username = (select current_setting('app.engineering_materials_profile_username', true)))
with check (username = (select current_setting('app.engineering_materials_profile_username', true)));

create or replace function public.engineering_materials_profile_load(p_username text)
returns table(username text, state_text text, revision bigint)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_username text;
begin
  v_username := lower(trim(p_username));
  if v_username !~ '^[a-z0-9_]{2,32}$' then
    raise exception 'invalid_username';
  end if;

  perform set_config('app.engineering_materials_profile_username', v_username, true);

  insert into public.engineering_materials_profiles(username, state, state_text, revision)
  values (v_username, '{}'::jsonb, '{}', 0)
  on conflict on constraint engineering_materials_profiles_pkey do nothing;

  return query
  select p.username, p.state_text, p.revision
  from public.engineering_materials_profiles p
  where p.username = v_username;
end;
$$;

create or replace function public.engineering_materials_profile_save(
  p_username text,
  p_state_text text,
  p_expected_revision bigint
)
returns table(ok boolean, state_text text, revision bigint)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_username text;
  v_state jsonb;
  v_row public.engineering_materials_profiles%rowtype;
begin
  v_username := lower(trim(p_username));

  if v_username !~ '^[a-z0-9_]{2,32}$' then
    raise exception 'invalid_username';
  end if;
  if p_expected_revision is null or p_expected_revision < 0 then
    raise exception 'invalid_revision';
  end if;
  if p_state_text is null or octet_length(p_state_text) > 1000000 then
    raise exception 'invalid_state';
  end if;

  v_state := p_state_text::jsonb;
  if jsonb_typeof(v_state) <> 'object' then
    raise exception 'invalid_state';
  end if;

  perform set_config('app.engineering_materials_profile_username', v_username, true);

  select p.* into v_row
  from public.engineering_materials_profiles p
  where p.username = v_username;

  if not found then
    insert into public.engineering_materials_profiles(username, state, state_text, revision)
    values (v_username, '{}'::jsonb, '{}', 0)
    returning * into v_row;
  end if;

  if v_row.revision <> p_expected_revision then
    return query select false, v_row.state_text, v_row.revision;
    return;
  end if;

  if v_row.state = v_state then
    return query select true, v_row.state_text, v_row.revision;
    return;
  end if;

  update public.engineering_materials_profiles p
     set state = v_state,
         state_text = p_state_text,
         revision = p.revision + 1,
         updated_at = now()
   where p.username = v_username
     and p.revision = p_expected_revision
  returning p.* into v_row;

  if found then
    return query select true, v_row.state_text, v_row.revision;
    return;
  end if;

  select p.* into v_row
  from public.engineering_materials_profiles p
  where p.username = v_username;

  return query select false, v_row.state_text, v_row.revision;
end;
$$;

revoke execute on function public.engineering_materials_profile_load(text) from public;
revoke execute on function public.engineering_materials_profile_save(text, text, bigint) from public;
grant execute on function public.engineering_materials_profile_load(text) to anon, authenticated;
grant execute on function public.engineering_materials_profile_save(text, text, bigint) to anon, authenticated;
