import { supabase } from "./supabase";
import type { ImportedDevice } from "./importer/inventory";

export type ProjectDevice = {
  id: string;
  project_id: string;
folder_name: string;
  asset_tag: string | null;
  asset_tag_actual: string | null;

  serial_number: string;
  serial_number_actual: string;

  display_name: string;

  model: string;
  model_category: string;

  location: string;
  site: string;

  original_type: string;

  device_group: string;
  device_type: string;

  comments: string;

  nombre_zip: string;
  ubicacion_zip: string;

  device_status?: {
    finalizado: boolean;
    fotos_antes: number;
    fotos_despues: number;
    modificado: boolean;
  };
};

export async function saveProjectDevices(
  projectId: string,
  devices: ImportedDevice[]
) {
  if (!devices.length)
    return [];

  const rows = devices.map((d) => ({
  project_id: projectId,

  asset_tag: d.assetTag,
  asset_tag_actual: d.assetTag,

  serial_number: d.serialNumber,
  serial_number_actual: d.serialNumber,

  display_name: d.displayName,

  model: d.model,

  model_category: d.modelCategory,

  location: d.location,

  site: d.site,

  original_type: d.originalType,

  device_group: d.deviceGroup,

  device_type: d.deviceType,

  comments: d.comments,

  nombre_zip: d.nombreZip,

  ubicacion_zip: d.ubicacionZip,

  folder_name: d.folderName,
}));

  const { data, error } = await supabase
    .from("project_devices")
    .insert(rows)
    .select();

  if (error)
    throw error;

  return data ?? [];
}

export async function getProjectDevices(
  projectId: string
) {
  return await supabase
    .from("project_devices")
    .select(`
      *,
      device_status(
        finalizado,
        fotos_antes,
        fotos_despues,
        modificado
      )
    `)
    .eq("project_id", projectId)
    .order("folder_name");
}

export async function getProjectDevice(
  deviceId: string
) {
  return await supabase
    .from("project_devices")
    .select(`
      *,
      device_status(
        finalizado,
        fotos_antes,
        fotos_despues,
        modificado
      )
    `)
    .eq("id", deviceId)
    .single();
}

export async function updateAssetTagActual(
  deviceId: string,
  assetTag: string
) {
  return await supabase
    .from("project_devices")
    .update({
      asset_tag_actual: assetTag,
    })
    .eq("id", deviceId);
}


export async function getDevicesByLocation(
  projectId: string,
  folderName: string
) {
  return await supabase
    .from("project_devices")
    .select(`
      *,
      device_status(
        finalizado,
        fotos_antes,
        fotos_despues,
        modificado
      )
    `)
    .eq("project_id", projectId)
    .eq("folder_name", folderName)
.order("display_name");
}

export async function getNextDevice(
  projectId: string,
  folderName: string,
  currentDeviceId: string
) {
  const { data, error } =
    await getDevicesByLocation(
      projectId,
      folderName
    );

  if (error || !data)
    return null;

  const index = data.findIndex(
    (d) => d.id === currentDeviceId
  );

  if (index === -1)
    return null;

  if (index === data.length - 1)
    return null;

  return data[index + 1];
}

export async function getPreviousDevice(
  projectId: string,
  folderName: string,
  currentDeviceId: string
) {
  const { data, error } =
    await getDevicesByLocation(
      projectId,
      folderName
    );

  if (error || !data)
    return null;

  const index = data.findIndex(
    (d) => d.id === currentDeviceId
  );

  if (index <= 0)
    return null;

  return data[index - 1];
}
export async function findDeviceByAssetTag(
  projectId: string,
  assetTag: string
) {

  return await supabase

    .from("project_devices")

    .select("*")

    .eq("project_id", projectId)

    .or(

      `asset_tag.eq.${assetTag},asset_tag_actual.eq.${assetTag}`

    )

    .maybeSingle();

}
export async function getProjectCategories(
  projectId: string
) {

  return await supabase

    .from("project_devices")

    .select(`
      device_group,
      device_status (
        finalizado
      )
    `)

    .eq("project_id", projectId);

}

export async function getProjectLocations(
  projectId: string,
  group: string
) {

  return await supabase

    .from("project_devices")

    .select(`
  folder_name,
  device_status (
    finalizado
  )
`)

    .eq("project_id", projectId)

    .eq("device_group", group);

}

export async function getLocationDevices(
  projectId: string,
  group: string,
  location: string
) {

  return await supabase

    .from("project_devices")

    .select(`
      *,
      device_status (
        finalizado,
        fotos_antes,
        fotos_despues
      )
    `)

    .eq("project_id", projectId)

    .eq("device_group", group)

    .eq("folder_name", location)
.order("display_name");

}
export async function getNextPendingDevice(
  projectId: string
) {

  const { data, error } =
    await supabase

      .from("project_devices")

      .select(`
        *,
        device_status (
          finalizado
        )
      `)

      .eq("project_id", projectId)

      .order("device_group")

      .order("folder_name")
      .order("display_name");

  if (error)
    throw error;

  const pendiente =
    (data ?? []).find((d: any) => {

      const estado = Array.isArray(d.device_status)
        ? d.device_status[0]
        : d.device_status;

      return !estado?.finalizado;

    });

  return pendiente ?? null;

}
export async function getCategoryLocations(
  projectId: string,
  category: string
) {

  return await supabase

    .from("project_devices")

    .select(`
  folder_name,
  device_status (
    finalizado
  )
`)

    .eq("project_id", projectId)

    .eq("device_group", category);

}
export async function updateComments(
  deviceId: string,
  comments: string
) {

  return await supabase

    .from("project_devices")

    .update({

      comments,

    })

    .eq("id", deviceId);

}
export async function moveDevice(
  deviceId: string,
  folderName: string,
  nombreZip: string,
  ubicacionZip: string
) {

  return await supabase

    .from("project_devices")

    .update({

      folder_name: folderName,

      nombre_zip: nombreZip,

      ubicacion_zip: ubicacionZip,

    })

    .eq("id", deviceId);

}
export async function getMoveDestinations(
  projectId: string,
  deviceGroup: string
) {

  return await supabase

    .from("project_devices")

    .select(`
      folder_name,
      nombre_zip,
      ubicacion_zip
    `)

    .eq("project_id", projectId)

    .eq("device_group", deviceGroup)

    .order("folder_name");

}