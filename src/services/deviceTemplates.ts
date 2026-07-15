import { supabase } from "./supabase";

export async function getDevicesByGroup(
  projectId: string,
  group: string
) {

  return await supabase

    .from("project_devices")

    .select(`
      id,
      device_group,
      display_name,
      model,
      model_category,
      device_type,
      original_type,
      serial_number,
      comments,
      folder_name,
      nombre_zip,
      ubicacion_zip
    `)

    .eq("project_id", projectId)

    .eq("device_group", group)

    .order("ubicacion_zip")

    .order("display_name");

}