import JSZip from "jszip";
import { saveAs } from "file-saver";
import { exportProjectPhotos } from "./exportPhotos";
import { supabase } from "../supabase";

import { exportProjectExcel } from "./exportExcel";

export async function exportProject(
  projectId: string
) {

  //----------------------------------
  // Leer proyecto
  //----------------------------------

  const {
    data: project,
    error,
  } = await supabase

    .from("projects")

    .select("*")

    .eq("id", projectId)

    .single();

  if (error)
    throw error;

  //----------------------------------
  // Crear ZIP
  //----------------------------------

  const zip =
    new JSZip();

  //----------------------------------
  // Carpeta Fotos
  //----------------------------------

  zip.folder("Fotos");

  //----------------------------------
  // Excel actualizado
  //----------------------------------

  const excel =
    await exportProjectExcel(

      project.id,

      project.inventory_excel_path

    );

  //----------------------------------
  // Nombre del Excel
  //----------------------------------

  const originalName =
    project.inventory_excel_path

      .split("/")

      .pop() ?? "Inventario.xlsx";

  const extension =
    originalName.split(".").pop();

  const baseName =
    originalName.substring(

      0,

      originalName.length -

      extension!.length -

      1

    );

  zip.file(

    `${baseName}_actualizado.${extension}`,

    excel

  );

  await exportProjectPhotos(
  project.id,
  zip
  );

  //----------------------------------
  // Descargar ZIP
  //----------------------------------

  const blob =
    await zip.generateAsync({

      type: "blob",

    });

  saveAs(

    blob,

    `${project.nombre}.zip`

  );

}