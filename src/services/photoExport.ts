import JSZip from "jszip";

import { supabase } from "./supabase";

export async function addProjectPhotosToZip(
  zip: JSZip,
  projectId: string
) {

  //----------------------------------
  // Obtener fotos
  //----------------------------------

  const { data: photos, error } =
    await supabase

      .from("photos")

      .select("*")

      .eq("project_id", projectId);

  if (error)
    throw error;

  if (!photos?.length)
    return;

  //----------------------------------
  // Carpeta raíz
  //----------------------------------

  const fotosFolder =
    zip.folder("Fotos");

  if (!fotosFolder)
    return;

  //----------------------------------
  // Descargar una a una
  //----------------------------------

  for (const photo of photos) {

    const {
      data: file,
      error: downloadError,
    } =
      await supabase.storage

        .from("photos")

        .download(photo.storage_path);

    if (downloadError || !file)
      continue;

    const puesto =
      fotosFolder.folder(
        photo.ubicacion_zip
      );

    const dispositivo =
      puesto?.folder(
        photo.nombre_zip
      );

    const carpeta =
      dispositivo?.folder(
        photo.carpeta
      );

    carpeta?.file(
      photo.file_name,
      await file.arrayBuffer()
    );

  }

}