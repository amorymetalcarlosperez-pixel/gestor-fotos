-- ==========================================
-- MIGRACIÓN 004
-- Árbol de carpetas
-- ==========================================

create table public.folders (

    id uuid primary key default gen_random_uuid(),

    project_id uuid
        not null
        references public.projects(id)
        on delete cascade,

    parent_id uuid
        references public.folders(id)
        on delete cascade,

    nombre text not null,

    ruta text not null,

    orden integer not null default 0,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now()

);

create index idx_folders_project
on public.folders(project_id);

create index idx_folders_parent
on public.folders(parent_id);

create trigger trg_folders_updated_at

before update
on public.folders

for each row

execute function public.set_updated_at();