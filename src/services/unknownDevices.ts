import { supabase } from "./supabase";

type CreateUnknownDeviceParams = {

  projectId: string;

  assetTag: string;

  grupo: string;

  ubicacion: string;

  nombre: string;

  modelo: string;

  tipo: string;

  serial: string;

};

export async function createUnknownDevice({

  projectId,

  assetTag,

  grupo,

  ubicacion,

  nombre,

  modelo,

  tipo,

  serial,

}: CreateUnknownDeviceParams) {

  const { data, error } =
    await supabase

      .from("project_devices")

      .insert({

        project_id: projectId,

        asset_tag: null,

        asset_tag_actual: assetTag,

        serial_number: serial,

        serial_number_actual: serial,

        display_name:
          nombre || "DISPOSITIVO NUEVO",

        model: modelo,

        model_category: "",

        location: ubicacion,

        site: "",

        original_type: tipo,

        device_group: grupo,

        device_type: tipo,

        comments: "Creado desde escáner",

        nombre_zip: ubicacion,

        ubicacion_zip: ubicacion,

        folder_name: ubicacion,

      })

      .select()

      .single();

  if (error)
    throw error;

  return data;

}
export async function createDeviceFromTemplate({

  projectId,

  assetTag,

  template,

  ubicacion,

  nombre,

  serial,

}: {

  projectId: string;

  assetTag: string;

  template: any;

  ubicacion: string;

  nombre: string;

  serial: string;

}) {
console.log("TEMPLATE:", template);
console.log("NOMBRE:", nombre);
console.log("UBICACION:", ubicacion);
  const { data, error } =
    await supabase

      .from("project_devices")

      .insert({

        project_id: projectId,

        asset_tag: null,

        asset_tag_actual: assetTag,

        serial_number: serial,

        serial_number_actual: serial,

        //--------------------------------
        // Datos introducidos por el usuario
        //--------------------------------

        display_name: nombre,

        folder_name: nombre,

        nombre_zip: nombre,

        ubicacion_zip: ubicacion,

        location: ubicacion,

        //--------------------------------
        // Datos copiados de la plantilla
        //--------------------------------

        model: template.model,

        model_category:
          template.model_category,

        device_group:
          template.device_group,

        device_type:
          template.device_type,

        original_type:
          template.original_type,

        comments:
          template.comments,

        site: "",

      })

      .select()

      .single();

  if (error)
    throw error;

  return data;
console.log("INSERTADO:", data);
console.log("ERROR:", error);
}