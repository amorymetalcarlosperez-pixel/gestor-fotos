import type { ProjectDevice } from "../services/projectDevices";

export function buildPhotoPath(
  projectId: string,
  device: ProjectDevice,
  carpeta: "ANTES" | "DESPUES"
) {

  //----------------------------------
  // PUESTOS
  //----------------------------------

  if (device.device_group === "PUESTOS") {

    return [

      projectId,

      device.folder_name,

      device.device_type,

      carpeta,

    ].join("/");

  }

  //----------------------------------
  // RESTO
  //----------------------------------

  return [

    projectId,

    device.folder_name,

    carpeta,

  ].join("/");

}