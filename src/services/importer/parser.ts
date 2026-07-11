import * as XLSX from "xlsx";
import type { ImportedDevice } from "./inventory";
import { buildDeviceRule } from "./rules";

export async function parseInventory(
  file: File
): Promise<ImportedDevice[]> {

  const buffer =
    await file.arrayBuffer();

  const workbook =
    XLSX.read(buffer);

  const sheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  const rows: any[] =
    XLSX.utils.sheet_to_json(sheet);

  const devices =
    rows.map(parseRow);

  //------------------------------------
  // Unificar nombres de carpeta
  //------------------------------------

  const autoservicios =
    new Map<string, string>();

  let tvPublicidad = 1;

  devices.forEach((device) => {

    //----------------------------------
    // TV PUBLICIDAD
    //----------------------------------

    if (
      device.deviceGroup ===
      "TV_PUBLICIDAD"
    ) {

      device.folderName =
        `TELEVISION DE PUBLICIDAD ${tvPublicidad}`;

      tvPublicidad++;

    }

    //----------------------------------
    // AUTOSERVICIO
    //----------------------------------

    if (
      device.deviceGroup ===
      "AUTOSERVICIO"
    ) {

      if (
        !autoservicios.has(
          device.site
        )
      ) {

        autoservicios.set(
          device.site,
          device.folderName
        );

      }

      device.folderName =
        autoservicios.get(
          device.site
        )!;

    }

  });

  return devices;

}

function parseRow(
  row: any
): ImportedDevice {

  const assetTag =
    texto(row["Asset tag"]);

  const displayName =
    texto(row["Display name"]);

  const modelCategory =
    texto(row["Model category"]);

  const model =
    texto(row["Model"]);

  const originalType =
    texto(row["Type"]);

  const serialNumber =
    texto(row["Serial number"]);

  const location =
    texto(row["Location"]);

  const comments =
    texto(row["Comments"]);

  const site =
    texto(row["Site"]);

  const rule =
    buildDeviceRule(
      site,
      originalType,
      model
    );

  return {

  assetTag,

  serialNumber,

  displayName,

  model,

  modelCategory,

  location,

  comments,

  site,

  originalType,

  deviceGroup: rule.group,

  deviceType: rule.type,

  nombreZip:
    rule.useTypeFolder
      ? rule.type
      : rule.folderName,

  ubicacionZip:
    rule.folderName,

  folderName:
    rule.folderName,

};

}

function texto(
  value: any
) {

  return String(
    value ?? ""
  )
    .trim()
    .replace(/\s+/g, " ");

}