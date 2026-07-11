import { supabase } from "./supabase";

export async function createUnknownDevice(
  projectId: string,
  assetTag: string,
  grupo: string,
  ubicacion: string
) {

  const { data, error } =
    await supabase

      .from("project_devices")

      .insert({

        project_id: projectId,

        asset_tag: null,

        asset_tag_actual: assetTag,

        serial_number: "",

        display_name: "DISPOSITIVO NUEVO",

        model: "",

        model_category: "",

        location: "",

        device_group: grupo,

        device_type: "OTRO",

        comments: "Creado desde escáner",

        nombre_zip: "NUEVO",

        ubicacion_zip: ubicacion,

      })

      .select()

      .single();

  if (error)
    throw error;

  return data;

}