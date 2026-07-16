import JSZip from "jszip";

import { supabase } from "./supabase";
import { getProjectDevice } from "./projectDevices";

export async function shareZip(
  deviceId: string,
  displayName: string
) {
  console.log("1 - Entra en shareZip");

  const {
    data: device,
    error: deviceError,
  } =
    await getProjectDevice(
      deviceId
    );
console.log("2 - Dispositivo:", device);
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

  if (
    device.device_group ===
    "PUESTOS"
  ) {

    zip.folder("ANTES");

    zip.folder("DESPUES");

  }

  else {

    zip.folder("ANTES");

    zip.folder("DESPUES");

  }
  //----------------------------------
  // Obtener fotos del dispositivo
  //----------------------------------

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

  //----------------------------------
  // Descargar fotos
  //----------------------------------

  for (const photo of photos ?? []) {
console.log("4 - Foto:", photo.storage_path);
    const {
      data: file,
      error,
    } =
      await supabase.storage

        .from("photos")

        .download(
          photo.storage_path
        );

    if (error) {

  console.error(
    "ERROR STORAGE:",
    error
  );

  console.log(
    "Ruta:",
    photo.storage_path
  );

  continue;

}
//----------------------------------
// Generar ZIP
//----------------------------------

const zipBlob =
  await zip.generateAsync({

    type: "blob",

  });

console.log(
  "ZIP:",
  zipBlob.size
);

//----------------------------------
// Crear fichero
//----------------------------------

const zipFile = new File(
  [await zipBlob.arrayBuffer()],
  `${displayName}.zip`,
  {
    type: "application/zip",
    lastModified: Date.now(),
  }
);

//----------------------------------
// Compartir
//----------------------------------

if (

  navigator.canShare &&

  navigator.canShare({

    files: [zipFile],

  })

) {

  console.log(
    "Compartiendo..."
  );

  await navigator.share({

    files: [zipFile],

    title: displayName,

  });

}
else {

  console.log(
    "No puede compartir archivos"
  );

}
console.log("3 - Fotos:", photos?.length);

if (!file) {

  console.error(
    "No hay fichero"
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
}