import JSZip from "jszip";

import {
  getPhotos,
  getPhotoSignedUrl,
} from "./photos";

export async function shareZip(
  deviceId: string,
  displayName: string
) {

  try {

    const zip = new JSZip();

    //----------------------------------
    // Carpeta ANTES
    //----------------------------------

    const antesFolder =
      zip.folder("ANTES");

    const { data: antes, error } =
      await getPhotos(
        deviceId,
        "ANTES"
      );

    if (error)
      throw error;

    let numero = 1;

    for (const photo of antes ?? []) {

      try {

        const url =
          await getPhotoSignedUrl(
            photo.storage_path
          );

        if (!url)
          continue;

        const response =
          await fetch(url);

        if (!response.ok)
          continue;

        const blob =
          await response.blob();

        antesFolder?.file(
          `${numero}.jpg`,
          blob
        );

        numero++;

      }

      catch (e) {

        console.error(
          "Error descargando foto:",
          photo.storage_path,
          e
        );

      }

    }

    //----------------------------------
    // Crear ZIP
    //----------------------------------

    const zipBlob =
      await zip.generateAsync({

        type: "blob",

      });

    const zipFile =
      new File(

        [zipBlob],

        `${displayName}.zip`,

        {

          type: "application/zip",

        }

      );

    if (
      !navigator.canShare ||
      !navigator.canShare({
        files: [zipFile],
      })
    ) {

      alert("Este dispositivo no puede compartir archivos.");

      return;

    }

    await navigator.share({

      files: [zipFile],

      title: displayName,

    });

  }

  catch (e) {

    console.error(e);

    alert(
      e instanceof Error
        ? e.message
        : String(e)
    );

  }

}