-- ==========================================
-- MIGRACIÓN 002
-- Tabla de perfiles
-- ==========================================

create table public.profiles (

    id uuid primary key references auth.users(id) on delete cascade,

    email text not null unique,

    nombre text not null,

    rol text not null
        check (rol in ('ADMIN','INVITADO')),

    dispositivo_uuid text,

    activo boolean not null default true,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now()

);

create trigger trg_profiles_updated_at

before update on public.profiles

for each row

execute function public.set_updated_at();