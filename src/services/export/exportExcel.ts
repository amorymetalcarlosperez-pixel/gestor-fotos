import XlsxPopulate from "xlsx-populate";

import { supabase } from "../supabase";
import { getProjectDevices } from "../projectDevices";

export async function exportProjectExcel(
  projectId: string,
  inventoryPath: string
) {

  //------------------------------------
  // Descargar plantilla
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
  // Abrir Excel SIN modificar formato
  //------------------------------------

  const workbook =
    await XlsxPopulate.fromDataAsync(buffer);

  const sheet =
    workbook.sheet(0);

  //------------------------------------
  // Buscar cabeceras
  //------------------------------------

  const headerRow = 1;

  let assetColumn = -1;
  let commentsColumn = -1;

  const usedRange =
    sheet.usedRange();

  const totalColumns =
    usedRange.endCell().columnNumber();

  for (
    let col = 1;
    col <= totalColumns;
    col++
  ) {

    const value =
      String(
        sheet
          .cell(headerRow, col)
          .value() ?? ""
      ).trim();

    if (value === "Asset tag")
      assetColumn = col;

    if (value === "Comments")
      commentsColumn = col;

  }

  if (
    assetColumn === -1 ||
    commentsColumn === -1
  ) {

    throw new Error(
      "No se encontraron las columnas Asset tag y Comments."
    );

  }

  //------------------------------------
  // Obtener inventario
  //------------------------------------

  const result =
    await getProjectDevices(projectId);

  if (result.error)
    throw result.error;

  const mapa =
    new Map<string, any>();

  (result.data ?? []).forEach(device => {

    if (device.asset_tag) {

      mapa.set(
        device.asset_tag.trim(),
        device
      );

    }

    if (device.asset_tag_actual) {

      mapa.set(
        device.asset_tag_actual.trim(),
        device
      );

    }

  });

  //------------------------------------
  // Recorrer filas
  //------------------------------------

  const totalRows =
    usedRange.endCell().rowNumber();

  for (
    let row = 2;
    row <= totalRows;
    row++
  ) {

    const assetOriginal =
      String(
        sheet
          .cell(row, assetColumn)
          .value() ?? ""
      ).trim();

    const device =
      mapa.get(assetOriginal);

    if (!device)
      continue;

    //------------------------------------
    // SOLO cambiar valores
    //------------------------------------

    sheet
      .cell(row, assetColumn)
      .value(
        device.asset_tag_actual ??
        device.asset_tag ??
        ""
      );

    sheet
      .cell(row, commentsColumn)
      .value(
        device.comments ?? ""
      );

  }

  //------------------------------------
  // Devolver EXACTAMENTE el mismo libro
  //------------------------------------

  return await workbook.outputAsync();

}