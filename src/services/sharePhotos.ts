import { supabase } from "./supabase";
import { getProjectDevice } from "./projectDevices";

export async function sharePhotos(
  deviceId: string,
  carpeta: "ANTES" | "DESPUES"
): Promise<File[]> {

  const {
    data: device,
    error: deviceError,
  } =
    await getProjectDevice(deviceId);

  if (deviceError || !device) {

    throw new Error(
      "Dispositivo no encontrado."
    );

  }

  const {
    data: photos,
    error: photosError,
  } =
    await supabase

      .from("photos")

      .select("*")

      .eq("device_id", deviceId)

      .eq("carpeta", carpeta)

      .order("orden");

  if (photosError)
    throw photosError;

  const files: File[] = [];

  for (const photo of photos ?? []) {

    const {
      data,
      error,
    } =
      await supabase.storage

        .from("photos")

        .download(
          photo.storage_path
        );

    if (error || !data)
      continue;

    const extension =
      photo.storage_path.includes(".")
        ? photo.storage_path.substring(
            photo.storage_path.lastIndexOf(".")
          )
        : ".jpg";

    const fileName =
      `${photo.carpeta}_${photo.orden}${extension}`;

    files.push(

      new File(

        [await data.arrayBuffer()],

        fileName,

        {

          type: data.type || "image/jpeg",

          lastModified: Date.now(),

        }

      )

    );

  }

  return files;

}
