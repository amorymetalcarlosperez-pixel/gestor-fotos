-- ==========================================
-- MIGRACIÓN 001
-- Extensiones y funciones base
-- ==========================================

-- UUID
create extension if not exists "pgcrypto";

-- Búsquedas sin distinguir acentos
create extension if not exists unaccent;

-- Actualización automática de updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;