import JSZip from "jszip";

import { supabase } from "./supabase";
import { getProject } from "./projects";
import { generateInventoryWorkbook } from "./exportInventory";

export async function exportProject(
  projectId: string
) {

  //----------------------------------
  // Proyecto
  //----------------------------------

  const { data: project, error } =
    await getProject(projectId);

  if (error || !project) {

    throw new Error(
      "Proyecto no encontrado."
    );

  }

  //----------------------------------
  // Crear ZIP
  //----------------------------------

  const zip =
    new JSZip();

  //----------------------------------
  // Excel
  //----------------------------------

  const excel =
    await generateInventoryWorkbook(
      projectId
    );

  zip.file(
    `${project.nombre}.xlsx`,
    excel
  );

  //----------------------------------
  // Leer dispositivos
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
      )

      .order("folder_name")

      .order("device_type");

  if (devicesError)
    throw devicesError;

  //----------------------------------
  // Crear TODAS las carpetas
  //----------------------------------

  for (const device of devices ?? []) {

    //----------------------------------
    // PUESTOS
    //----------------------------------

    if (
      device.device_group ===
      "PUESTOS"
    ) {

      zip.folder(

        `Fotos/${device.folder_name}`

      );

      zip.folder(

        `Fotos/${device.folder_name}/${device.device_type}`

      );

      zip.folder(

        `Fotos/${device.folder_name}/${device.device_type}/ANTES`

      );

      zip.folder(

        `Fotos/${device.folder_name}/${device.device_type}/DESPUES`

      );

      continue;

    }

    //----------------------------------
    // RESTO
    //----------------------------------

    zip.folder(

      `Fotos/${device.folder_name}`

    );

    zip.folder(

      `Fotos/${device.folder_name}/ANTES`

    );

    zip.folder(

      `Fotos/${device.folder_name}/DESPUES`

    );

  }

  //----------------------------------
  // Obtener fotos
  //----------------------------------

  const {
    data: photos,
    error: photosError,
  } =
    await supabase

      .from("photos")

      .select("*")

      .eq(
        "project_id",
        projectId
      );

  if (photosError)
    throw photosError;
  //----------------------------------
  // Descargar fotos (8 en paralelo)
  //----------------------------------

 //----------------------------------
// Descargar fotos
//----------------------------------

const lista =
  photos ?? [];

for (const photo of lista) {

  //----------------------------------
  // Buscar dispositivo
  //----------------------------------

  const device =
    devices?.find(
      d => d.id === photo.device_id
    );

  if (!device)
    continue;

  //----------------------------------
  // Descargar archivo
  //----------------------------------

  const {
    data: file,
    error,
  } =
    await supabase.storage

      .from("photos")

      .download(
        photo.storage_path
      );

  if (
    error ||
    !file
  ) {

    console.warn(
      "No se pudo descargar:",
      photo.storage_path
    );

    continue;

  }

  //----------------------------------
  // Extensión
  //----------------------------------

  const extension =
    photo.storage_path.includes(".")

      ? photo.storage_path.substring(
          photo.storage_path.lastIndexOf(".")
        )

      : ".jpg";

  //----------------------------------
  // Nombre final
  //----------------------------------

  const fileName =
    `${photo.orden}${extension}`;

  //----------------------------------
  // Ruta destino
  //----------------------------------

  let relativePath: string;

  if (
    device.device_group ===
    "PUESTOS"
  ) {

    relativePath =

      `Fotos/${device.folder_name}/${device.device_type}/${photo.carpeta}/${fileName}`;

  }

  else {

    relativePath =

      `Fotos/${device.folder_name}/${photo.carpeta}/${fileName}`;

  }

  //----------------------------------
  // Añadir al ZIP
  //----------------------------------

  zip.file(

    relativePath,

    await file.arrayBuffer()

  );

}

  //----------------------------------
  // Generar ZIP
  //----------------------------------

  const blob =
    await zip.generateAsync({

      type: "blob",

    });

  //----------------------------------
  // Descargar
  //----------------------------------

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    `${project.nombre}.zip`;

  document.body.appendChild(
    link
  );

  link.click();

  document.body.removeChild(
    link
  );

  URL.revokeObjectURL(
    url
  );

}