create table public.project_devices (

    id uuid primary key default gen_random_uuid(),

    project_id uuid not null
        references projects(id) on delete cascade,

    asset_tag text,

    asset_tag_actual text,

    serial_number text,

    display_name text,

    model text,

    model_category text,

    location text,

    device_group text,

    device_type text,

    comments text,

    created_at timestamptz default now()

);

alter table project_devices enable row level security;

create policy project_devices_select
on project_devices
for select
using (

    exists (

        select 1
        from project_users pu
        where pu.project_id = project_devices.project_id
        and pu.user_id = auth.uid()

    )

);

create policy project_devices_insert
on project_devices
for insert
with check (

    exists (

        select 1
        from project_users pu
        where pu.project_id = project_devices.project_id
        and pu.user_id = auth.uid()

    )

);

create index idx_project_devices_project
on project_devices(project_id);

create index idx_project_devices_asset
on project_devices(asset_tag);

create index idx_project_devices_asset_actual
on project_devices(asset_tag_actual);