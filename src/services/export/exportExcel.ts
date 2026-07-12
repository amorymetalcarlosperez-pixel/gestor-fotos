import ExcelJS from "exceljs";

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
  // Abrir Excel conservando formato
  //------------------------------------

  const workbook =
    new ExcelJS.Workbook();


  await workbook.xlsx.load(
    buffer
  );


  const sheet =
    workbook.worksheets[0];


  if (!sheet)
    throw new Error(
      "No existe hoja de inventario."
    );


  //------------------------------------
  // Buscar cabeceras
  //------------------------------------

  let assetColumn = -1;
  let commentsColumn = -1;


  sheet.getRow(1).eachCell(
    (cell, colNumber) => {

      const value =
        String(cell.value ?? "")
          .trim();


      if (value === "Asset tag") {

        assetColumn =
          colNumber;

      }


      if (value === "Comments") {

        commentsColumn =
          colNumber;

      }

    }
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
  // Obtener dispositivos modificados
  //------------------------------------

  const result =
    await getProjectDevices(
      projectId
    );


  if (result.error)
    throw result.error;


  const mapa =
    new Map();


  (result.data ?? [])
    .forEach(device => {

      mapa.set(

        String(
          device.asset_tag ?? ""
        ).trim(),

        device

      );

    });



  //------------------------------------
  // Actualizar solo valores
  // manteniendo formato
  //------------------------------------

  sheet.eachRow(
    (row, rowNumber) => {

      if (rowNumber === 1)
        return;


      const asset =
        String(
          row.getCell(assetColumn).value ?? ""
        ).trim();


      const device =
        mapa.get(asset);


      if (!device)
        return;


      row
        .getCell(assetColumn)
        .value =
          device.asset_tag_actual ?? "";


      row
        .getCell(commentsColumn)
        .value =
          device.comments ?? "";

    }
  );



  //------------------------------------
  // Generar archivo
  //------------------------------------

  const salida =
    await workbook.xlsx.writeBuffer();


  return salida;

}