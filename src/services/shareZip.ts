import JSZip from "jszip";

export async function shareZip(
  nombre: string
) {

  const zip = new JSZip();

  zip.file(
    "prueba.txt",
    "Inventario generado correctamente"
  );

  const blob =
    await zip.generateAsync({
      type: "blob",
    });

  const file =
    new File(
      [blob],
      `${nombre}.zip`,
      {
        type: "application/zip",
      }
    );

  //----------------------------------------
  // Android moderno
  //----------------------------------------

  if (

    navigator.canShare &&

    navigator.canShare({
      files: [file],
    })

  ) {

    await navigator.share({

      files: [file],

      title: nombre,

      text: "Inventario",

    });

    return;

  }

  //----------------------------------------
  // Plan B
  //----------------------------------------

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download =
    `${nombre}.zip`;

  a.click();

  URL.revokeObjectURL(url);

}