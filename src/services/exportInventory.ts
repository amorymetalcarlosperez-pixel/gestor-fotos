import * as XLSX from "xlsx";

import { supabase } from "./supabase";
import { getProject } from "./projects";
import { getProjectDevices } from "./projectDevices";

export async function generateInventoryWorkbook(
  projectId: string,
): Promise<ArrayBuffer> {

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
  // Descargar Excel original
  //----------------------------------

  const {
    data: file,
    error: downloadError,
  } =
    await supabase.storage

      .from("inventory")

      .download(
        project.inventory_excel_path
      );

  if (downloadError || !file) {
    throw downloadError;
  }

  //----------------------------------
  // Abrir workbook
  //----------------------------------

  const workbook =
    XLSX.read(
      await file.arrayBuffer(),
      {
        type: "array",
      }
    );

  //----------------------------------
  // Primera hoja
  //----------------------------------

  const sheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  //----------------------------------
  // Leer hoja completa
  //----------------------------------

  const rows =
    XLSX.utils.sheet_to_json(sheet, {
      header: 1,
    }) as any[][];

  if (!rows.length) {
    throw new Error(
      "El Excel está vacío."
    );
  }

  //----------------------------------
  // Buscar columnas
  //----------------------------------

  const headers = rows[0];

  const assetColumn =
    headers.indexOf("Asset tag");

  const serialColumn =
    headers.indexOf("Serial number");

  if (
    assetColumn === -1 ||
    serialColumn === -1
  ) {
    throw new Error(
      "No se encuentran las columnas Asset tag o Serial number."
    );
  }

  //----------------------------------
  // Obtener dispositivos
  //----------------------------------

  const { data: devices } =
    await getProjectDevices(
      projectId
    );

  const deviceMap =
    new Map(
      (devices ?? []).map(
        (device) => [
          device.asset_tag,
          device,
        ]
      )
    );

  //----------------------------------
  // Actualizar únicamente celdas
  //----------------------------------

  for (
    let r = 1;
    r < rows.length;
    r++
  ) {

    const asset =
      rows[r][assetColumn];

    const device =
      deviceMap.get(asset);

    if (!device)
      continue;

    rows[r][assetColumn] =
      device.asset_tag_actual;

    rows[r][serialColumn] =
      device.serial_number_actual;

    const assetCell =
      XLSX.utils.encode_cell({
        r,
        c: assetColumn,
      });

    const serialCell =
      XLSX.utils.encode_cell({
        r,
        c: serialColumn,
      });

    if (sheet[assetCell]) {
      sheet[assetCell].v =
        device.asset_tag_actual;
    }

    if (sheet[serialCell]) {
      sheet[serialCell].v =
        device.serial_number_actual;
    }

  }

  //----------------------------------
  // Descargar
  //----------------------------------

 return XLSX.write(
  workbook,
  {
    bookType: "xlsx",
    type: "array",
  }
) as ArrayBuffer;

}


export async function exportInventory(
  projectId: string
) {

  const array =
    await generateInventoryWorkbook(
      projectId
    );

  const blob =
    new Blob(
      [array],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "Inventario actualizado.xlsx";

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
