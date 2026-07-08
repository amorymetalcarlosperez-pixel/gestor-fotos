-- ==========================================
-- MIGRACIÓN 003
-- Tabla de proyectos
-- ==========================================

create table public.projects (

    id uuid primary key default gen_random_uuid(),

    nombre text not null,

    inventario_excel text,

    creado_por uuid
        not null
        references public.profiles(id),

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now()

);

create trigger trg_projects_updated_at

before update on public.projects

for each row

execute function public.set_updated_at();