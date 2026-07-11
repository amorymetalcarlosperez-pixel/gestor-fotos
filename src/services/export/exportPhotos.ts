import JSZip from "jszip";

import { supabase } from "../supabase";

export async function exportProjectPhotos(
  projectId: string,
  zip: JSZip
) {

  //----------------------------------
  // Obtener dispositivos
  //----------------------------------

  const {
    data: devices,
    error: devicesError,
  } =
    await supabase

      .from("project_devices")

      .select("*")

      .eq(
        "project_id",
        projectId
      );


  if (devicesError)
    throw devicesError;


  //----------------------------------
  // Crear estructura de carpetas
  //----------------------------------

  const fotosFolder =
    zip.folder("Fotos");


  if (!fotosFolder)
    return;


  for (const device of devices ?? []) {


    //----------------------------------
    // PUESTOS
    //----------------------------------

    if (
  device.device_group === "PUESTOS"
) {

  fotosFolder.folder(
    `${device.folder_name}/${device.device_type}/ANTES`
  );

  fotosFolder.folder(
    `${device.folder_name}/${device.device_type}/DESPUES`
  );

}

else {

  fotosFolder.folder(
    `${device.folder_name}/ANTES`
  );

  fotosFolder.folder(
    `${device.folder_name}/DESPUES`
  );

}

  }



  //----------------------------------
  // Obtener fotos
  //----------------------------------

  const {
    data: photos,
    error,
  } =
    await supabase

      .from("photos")

      .select("*")

      .eq(
        "project_id",
        projectId
      );


  if (error)
    throw error;



  //----------------------------------
  // Descargar fotos
  //----------------------------------

  for (const photo of photos ?? []) {


    const device =
      devices?.find(

        d =>
          d.id === photo.device_id

      );


    if (!device)
      continue;



    const {
      data,
      error: downloadError,
    } =
      await supabase.storage

        .from("photos")

        .download(
          photo.storage_path
        );


    if (
      downloadError ||
      !data
    )
      continue;



    //----------------------------------
    // Nombre original
    //----------------------------------

    const filename =
      photo.storage_path

        .split("/")

        .pop();



    if (!filename)
      continue;



    //----------------------------------
    // Construir ruta nueva
    //----------------------------------

    let path = "";



   if (
  device.device_group === "PUESTOS"
) {

  path =
    `Fotos/${device.folder_name}/${device.device_type}/${photo.carpeta}/${filename}`;

}

else {

  path =
    `Fotos/${device.folder_name}/${photo.carpeta}/${filename}`;

}



    //----------------------------------
    // Añadir al ZIP
    //----------------------------------

    zip.file(

      path,

      await data.arrayBuffer()

    );


  }

}