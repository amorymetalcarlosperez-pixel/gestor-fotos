import JSZip from "jszip";

import {
  getPhotos,
  getPhotoSignedUrl,
} from "./photos";

export async function shareZip(
  deviceId: string,
  displayName: string
) {

  const zip = new JSZip();

  //----------------------------------
  // Carpeta ANTES
  //----------------------------------

  const antesFolder =
    zip.folder("ANTES");

  const { data: antes } =
    await getPhotos(
      deviceId,
      "ANTES"
    );

  let numero = 1;

  for (const photo of antes ?? []) {

    const url =
      await getPhotoSignedUrl(
        photo.storage_path
      );

    if (!url)
      continue;

    const response =
      await fetch(url);

    const blob =
      await response.blob();

    antesFolder?.file(
      `${numero}.jpg`,
      blob
    );

    numero++;

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

    navigator.canShare &&

    navigator.canShare({

      files: [zipFile],

    })

  ) {

    await navigator.share({

      files: [zipFile],

      title: displayName,

    });

  }

}