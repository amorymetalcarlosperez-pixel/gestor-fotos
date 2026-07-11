import * as XLSX from "xlsx";

import { supabase } from "../supabase";

import { getProjectDevices } from "../projectDevices";

export async function exportProjectExcel(
  projectId: string,
  inventoryPath: string
) {

  //------------------------------------
  // Descargar Excel original
  //------------------------------------

  const { data, error } =
    await supabase.storage

      .from("inventory")

      .download(inventoryPath);

  if (error)
    throw error;

  const buffer =
    await data.arrayBuffer();

  //------------------------------------
  // Abrir workbook
  //------------------------------------

  const workbook =
    XLSX.read(buffer);

  const sheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  //------------------------------------
  // Obtener todas las filas
  //------------------------------------

  const rows: any[][] =
    XLSX.utils.sheet_to_json(
      sheet,
      {
        header: 1,
        defval: "",
      }
    );

  if (!rows.length)
    throw new Error(
      "Inventario vacío."
    );

  //------------------------------------
  // Localizar columnas
  //------------------------------------

  const header =
    rows[0];

  const assetColumn =
    header.indexOf(
      "Asset tag"
    );

  const commentsColumn =
    header.indexOf(
      "Comments"
    );

  if (
    assetColumn === -1 ||
    commentsColumn === -1
  ) {

    throw new Error(
      "No se encuentran las columnas Asset tag o Comments."
    );

  }

  //------------------------------------
  // Obtener dispositivos
  //------------------------------------

  const result =
    await getProjectDevices(
      projectId
    );

  if (result.error)
    throw result.error;

  const mapa =
    new Map();

  (result.data ?? []).forEach(
    (device) => {

      mapa.set(
        String(
          device.asset_tag ?? ""
        ).trim(),
        device
      );

    }
  );

  //------------------------------------
  // Modificar celdas existentes
  //------------------------------------

  for (
    let row = 1;
    row < rows.length;
    row++
  ) {

    const asset =
      String(
        rows[row][assetColumn] ?? ""
      ).trim();

    const device =
      mapa.get(asset);

    if (!device)
      continue;

    rows[row][assetColumn] =
      device.asset_tag_actual ?? "";

    rows[row][commentsColumn] =
      device.comments ?? "";

  }

  //------------------------------------
  // Escribir únicamente las celdas
  //------------------------------------

  for (
    let r = 1;
    r < rows.length;
    r++
  ) {

    const assetCell =
      XLSX.utils.encode_cell({

        r,

        c: assetColumn,

      });

    const commentsCell =
      XLSX.utils.encode_cell({

        r,

        c: commentsColumn,

      });

    sheet[assetCell] = {

      t: "s",

      v: rows[r][assetColumn],

    };

    sheet[commentsCell] = {

      t: "s",

      v: rows[r][commentsColumn],

    };

  }

  //------------------------------------

  return XLSX.write(
    workbook,
    {
      type: "array",
      bookType: "xlsx",
    }
  );

}