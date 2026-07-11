create extension if not exists "pgcrypto";

--------------------------------------------------------
-- PROFILES
--------------------------------------------------------

create table if not exists public.profiles (

    id uuid primary key references auth.users(id) on delete cascade,

    nombre text,

    administrador boolean default false,

    dispositivo_id text,

    activo boolean default true,

    created_at timestamptz default now()

);

--------------------------------------------------------
-- PROJECTS
--------------------------------------------------------

create table if not exists public.projects (

    id uuid primary key default gen_random_uuid(),

    nombre text not null,

    descripcion text,

    configuracion jsonb not null,

    inventario_excel text,

    estado text default 'En preparación',

    created_by uuid references auth.users(id),

    created_at timestamptz default now()

);

--------------------------------------------------------
-- PROJECT_USERS
--------------------------------------------------------

create table if not exists public.project_users (

    id uuid primary key default gen_random_uuid(),

    project_id uuid references public.projects(id) on delete cascade,

    user_id uuid references auth.users(id) on delete cascade,

    created_at timestamptz default now(),

    unique(project_id,user_id)

);

--------------------------------------------------------
-- RLS
--------------------------------------------------------

alter table public.profiles enable row level security;

alter table public.projects enable row level security;

alter table public.project_users enable row level security;

--------------------------------------------------------
-- POLICIES PROJECTS
--------------------------------------------------------

create policy "read own projects"

on public.projects

for select

using (

exists(

select 1

from public.project_users pu

where pu.project_id=id

and pu.user_id=auth.uid()

)

);

create policy "create projects"

on public.projects

for insert

with check (

created_by=auth.uid()

);

--------------------------------------------------------
-- PROJECT_USERS
--------------------------------------------------------

create policy "read project users"

on public.project_users

for select

using (

user_id=auth.uid()

);

create policy "insert own project"

on public.project_users

for insert

with check (

user_id=auth.uid()

);

--------------------------------------------------------
-- PROFILES
--------------------------------------------------------

create policy "read own profile"

on public.profiles

for select

using (

id=auth.uid()

);

create policy "update own profile"

on public.profiles

for update

using (

id=auth.uid()

);