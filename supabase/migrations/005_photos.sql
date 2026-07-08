-- ==========================================
-- MIGRACIÓN 005
-- Fotografías
-- ==========================================

create table public.photos (

    id uuid primary key default gen_random_uuid(),

    folder_id uuid
        not null
        references public.folders(id)
        on delete cascade,

    nombre_archivo text not null,

    ruta_storage text not null unique,

    numero integer not null,

    usuario_id uuid
        references public.profiles(id),

    created_at timestamptz not null default now()

);

create index idx_photos_folder
on public.photos(folder_id);

create unique index idx_photos_folder_numero
on public.photos(folder_id, numero);