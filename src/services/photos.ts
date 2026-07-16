import { supabase } from "./supabase";
import { buildPhotoPath } from "../utils/storagePath";
import { getProjectDevice } from "./projectDevices";

export type DevicePhoto = {
  id: string;
  project_id: string;

  device_id: string;

  carpeta: "ANTES" | "DESPUES";

  storage_path: string;

  created_by: string;

  created_at: string;

  mime_type: string;

  file_size: number;

  orden: number;
};

export async function getPhotos(
  deviceId: string,
  carpeta: "ANTES" | "DESPUES"
) {

  return await supabase

    .from("photos")

    .select("*")

    .eq("device_id", deviceId)

    .eq("carpeta", carpeta)

    .order("orden")

    .order("created_at");

}

export async function getPhotoSignedUrl(
  path: string
) {

  const { data, error } =
    await supabase.storage

      .from("photos")

      .download(path);

  if (error) {

    console.error(error);

    return null;

  }

  return URL.createObjectURL(data);

}

export async function addPhoto(
  projectId: string,
  deviceId: string,
  carpeta: "ANTES" | "DESPUES",
  file: File
) {

  //--------------------------------------
  // Usuario autenticado
  //--------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {

    throw new Error(
      "Usuario no autenticado."
    );

  }

  //--------------------------------------
  // Obtener dispositivo
  //--------------------------------------

  const result =
    await getProjectDevice(
      deviceId
    );

  if (
    result.error ||
    !result.data
  ) {

    throw new Error(
      "Dispositivo no encontrado."
    );

  }

  const device =
    result.data;

  //--------------------------------------
  // Construir ruta
  //--------------------------------------

  const folder =
    buildPhotoPath(
      projectId,
      device,
      carpeta
    );

  const extension =
    file.name.includes(".")
      ? file.name.substring(
          file.name.lastIndexOf(".")
        )
      : ".jpg";

  const filename =
    `${crypto.randomUUID()}${extension}`;

  const storagePath =
    `${folder}/${filename}`;

  //--------------------------------------
  // Calcular orden
  //--------------------------------------

  const {
    data: ultimaFoto,
  } =
    await supabase

      .from("photos")

      .select("orden")

      .eq("device_id", deviceId)

      .eq("carpeta", carpeta)

      .order("orden", {
        ascending: false,
      })

      .limit(1)

      .maybeSingle();

  const orden =
    (ultimaFoto?.orden ?? 0) + 1;

  //--------------------------------------
  // Subir al Storage
  //--------------------------------------

  const upload =
    await supabase.storage

      .from("photos")

      .upload(
        storagePath,
        file
      );

  if (upload.error)
    throw upload.error;

  //--------------------------------------
  // Registrar en la base de datos
  //--------------------------------------

  const insert =
    await supabase

      .from("photos")

      .insert({

        project_id: projectId,

        device_id: deviceId,

        carpeta,

        storage_path: storagePath,

        mime_type: file.type,

        file_size: file.size,

        created_by: user.id,

        orden,

      });

  if (insert.error) {

    //--------------------------------------
    // Si falla el INSERT eliminamos el archivo
    //--------------------------------------

    await supabase.storage

      .from("photos")

      .remove([
        storagePath,
      ]);

    throw insert.error;

  }

}

export async function removePhoto(
  photo: DevicePhoto
) {

  await supabase.storage

    .from("photos")

    .remove([
      photo.storage_path,
    ]);

  await supabase

    .from("photos")

    .delete()

    .eq("id", photo.id);

}