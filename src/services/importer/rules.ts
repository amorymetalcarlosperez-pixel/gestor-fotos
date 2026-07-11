export interface DeviceRule {

  group: string;

  type: string;

  folderName: string;

  useTypeFolder: boolean;

}

export function buildDeviceRule(
  site: string,
  originalType: string,
  model: string
): DeviceRule {

  const s =
    normalizar(site);

  const t =
    normalizar(originalType);

  const type =
    calcularTipo(
      originalType,
      model
    );

  //----------------------------------
  // Nombre de carpeta
  //----------------------------------

  let folderName = s;

  if (folderName === "HILO MUSICAL") {

    folderName = "RACK";

  }

  //----------------------------------
  // TV LLAMATURNOS
  //----------------------------------

  if (
    t === "TV" &&
    s.startsWith("TV LLAMATURNOS")
  ) {

    return {

      group: "TV_LLAMATURNOS",

      type: "TV",

      folderName,

      useTypeFolder: false,

    };

  }

  //----------------------------------
  // TV PUBLICIDAD
  //----------------------------------

  if (
    t === "TV" &&
    s.startsWith("TV PUBLICIDAD")
  ) {

    return {

      group: "TV_PUBLICIDAD",

      type: "TV",

      folderName,

      useTypeFolder: false,

    };

  }

  //----------------------------------
  // PUESTOS
  //----------------------------------

  if (
    s.startsWith("PUESTO")
  ) {

    return {

      group: "PUESTOS",

      type,

      folderName,

      useTypeFolder: true,

    };

  }

  //----------------------------------
  // AUTOSERVICIO
  //----------------------------------

  if (
    s.startsWith("AUTOSERVICIO")
  ) {

    return {

      group: "AUTOSERVICIO",

      type,

      folderName,

      useTypeFolder: false,

    };

  }

  //----------------------------------
  // IMPRESORAS
  //----------------------------------

  if (
    s.startsWith("IMPRESORA")
  ) {

    return {

      group: "IMPRESORAS",

      type: "IMPRESORA",

      folderName,

      useTypeFolder: false,

    };

  }

  //----------------------------------
  // SACATURNOS
  //----------------------------------

  if (
    s.startsWith("SACATURNOS")
  ) {

    return {

      group: "SACATURNOS",

      type: "SACATURNOS",

      folderName,

      useTypeFolder: false,

    };

  }

  //----------------------------------
  // RACK
  //----------------------------------

  return {

    group: "RACK",

    type,

    folderName,

    useTypeFolder: false,

  };

}

function calcularTipo(
  originalType: string,
  model: string
) {

  const t =
    originalType.toUpperCase();

  const m =
    model.toUpperCase();

  switch (t) {

    case "LAPTOP":
      return "PORTATIL";

    case "MONITOR":
      return "MONITOR";

    case "PRINTER":
      return "IMPRESORA";

    case "DOCKING STATION":
      return "CABLEADO";

    case "TRUNCADORA":
      return "TRUNCADORA";

    case "TV":
      return "TV";

    case "DESKTOP COMPUTER":

      if (m.includes("IPAD"))
        return "IPAD";

      return "PC";

    case "OTHER":

      if (m.includes("TOTEM"))
        return "SACATURNOS";

      return "OTRO";

    default:
      return t;

  }

}

function normalizar(
  texto: string
) {

  return texto
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();

}