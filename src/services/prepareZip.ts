import JSZip from "jszip";

import { supabase } from "./supabase";
import { getProjectDevice } from "./projectDevices";

export async function prepareZip(
  deviceId: string,
  displayName: string
): Promise<File> {

  const {
    data: device,
    error: deviceError,
  } =
    await getProjectDevice(
      deviceId
    );

  if (
    deviceError ||
    !device
  ) {

    throw new Error(
      "Dispositivo no encontrado."
    );

  }

  const zip =
    new JSZip();

  zip.folder("ANTES");

  zip.folder("DESPUES");

  const {
    data: photos,
    error: photosError,
  } =
    await supabase

      .from("photos")

      .select("*")

      .eq(
        "device_id",
        deviceId
      )

      .order("carpeta")

      .order("orden");

  if (photosError)
    throw photosError;

  for (const photo of photos ?? []) {

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

    const extension =
      photo.storage_path.includes(".")
        ? photo.storage_path.substring(
            photo.storage_path.lastIndexOf(".")
          )
        : ".jpg";

    const fileName =
      `${photo.orden}${extension}`;

    zip.file(

      `${photo.carpeta}/${fileName}`,

      await file.arrayBuffer()

    );

  }

  const blob =
    await zip.generateAsync({

      type: "blob",

    });

  return new File(

    [blob],

    `${displayName}.zip`,

    {

      type: "application/zip",

    }

  );

}