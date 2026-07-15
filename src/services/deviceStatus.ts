import { supabase } from "./supabase";
import { enqueueWhatsapp } from "./whatsappQueue";
export type DeviceStatus = {

  id: string;

  project_id: string;

  project_device_id: string;

  finalizado: boolean;

  finalizado_por: string | null;

  finalizado_at: string | null;

  fotos_antes: number;

  fotos_despues: number;

  asset_verificado: boolean;

  modificado: boolean;

};


export async function setAssetVerified(
  projectDeviceId: string
) {

  return await supabase

    .from("device_status")

    .update({

      asset_verificado: true,

    })

    .eq(
      "project_device_id",
      projectDeviceId
    );

}


export async function getDeviceStatus(
  projectDeviceId: string
) {

  return await supabase

    .from("device_status")

    .select("*")

    .eq(
      "project_device_id",
      projectDeviceId
    )

    .maybeSingle();

}


export async function ensureDeviceStatus(
  projectId: string,
  projectDeviceId: string
  
) {

  //--------------------------------------
  // ¿Ya existe?
  //--------------------------------------

  

const existente =
  await getDeviceStatus(projectDeviceId);

console.log("existente:", existente.data);
console.log("error:", existente.error);

  if (existente.error) {

    console.error(
      existente.error
    );

    return existente;

  }

  if (existente.data) {

    return existente;

  }

  //--------------------------------------
  // Usuario
  //--------------------------------------

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  //--------------------------------------
  // Crear estado
  //--------------------------------------
console.log("VOY A INSERTAR");
  const insert =
    await supabase

      .from("device_status")

      .insert({

        project_id:
          projectId,

        project_device_id:
          projectDeviceId,

        finalizado: false,

        finalizado_por:
          user?.id ?? null,

        finalizado_at: null,

        fotos_antes: 0,

        fotos_despues: 0,

        asset_verificado: false,

        modificado: false,

      })

      .select()

      .single();

  //--------------------------------------
  // Si otro proceso lo creó antes,
  // simplemente devolver el existente.
  //--------------------------------------

  if (
    insert.error &&
    insert.error.code === "23505"
  ) {

    return await getDeviceStatus(
      projectDeviceId
    );

  }

  return insert;

}


export async function refreshDeviceStatus(
  projectDeviceId: string
) {

  const {
    data: photos,
  } =
    await supabase

      .from("photos")

      .select("carpeta")

      .eq(
        "device_id",
        projectDeviceId
      );


  const fotosAntes =
    photos?.filter(
      (p) =>
        p.carpeta === "ANTES"
    ).length ?? 0;


  const fotosDespues =
    photos?.filter(
      (p) =>
        p.carpeta === "DESPUES"
    ).length ?? 0;


  return await supabase

    .from("device_status")

    .update({

      fotos_antes: fotosAntes,

      fotos_despues: fotosDespues,

      modificado:
        fotosDespues > 0,

    })

    .eq(
      "project_device_id",
      projectDeviceId
    );

}


export async function markModified(
  projectDeviceId: string
) {

  return await supabase

    .from("device_status")

    .update({

      modificado: true,

    })

    .eq(
      "project_device_id",
      projectDeviceId
    );

}


export async function finishDevice(
  projectDeviceId: string
) {

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  const result =
    await supabase

      .from("device_status")

      .update({

        finalizado: true,

        finalizado_at:
          new Date().toISOString(),

        finalizado_por:
          user?.id ?? null,

      })

      .eq(
        "project_device_id",
        projectDeviceId
      );

  //-----------------------------------
  // Crear envío pendiente
  //-----------------------------------

  try {

    await enqueueWhatsapp(
      projectDeviceId
    );

  }

  catch (e) {

    console.error(
      "No se pudo crear la cola de WhatsApp",
      e
    );

  }

  return result;

}


export async function reopenDevice(
  projectDeviceId: string
) {

  return await supabase

    .from("device_status")

    .update({

      finalizado: false,

      finalizado_at: null,

      finalizado_por: null,

    })

    .eq(
      "project_device_id",
      projectDeviceId
    );

}