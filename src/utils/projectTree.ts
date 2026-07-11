export interface DeviceFolder {
  nombre: string;
  carpetas: string[];
}

export interface DeviceGroup {
  id: string;
  nombre: string;
  icono: string;
  elemento: string;
  elementos: DeviceFolder[];
}

export interface ProjectConfiguration {
  impresorasGestion: number;
  kioscosAutoservicio: number;
  kioscosTurnos: number;
  puestosGestor: number;
  televisionesTurnos: number;
  televisionesPublicidad: number;
}

export function buildProjectTree(
  config: ProjectConfiguration
): DeviceGroup[] {

  const grupos: DeviceGroup[] = [];

  crearGrupo(
    grupos,
    "impresoras",
    "🖨️",
    "Impresoras gestión",
    "Impresora",
    config.impresorasGestion,
    ["Antes", "Después"]
  );

  crearGrupo(
    grupos,
    "autoservicio",
    "🏧",
    "Kioscos autoservicio",
    "Kiosco",
    config.kioscosAutoservicio,
    ["Antes", "Después"]
  );

  crearGrupo(
    grupos,
    "turnos",
    "🎫",
    "Kioscos turnos",
    "Kiosco",
    config.kioscosTurnos,
    ["Antes", "Después"]
  );

  crearGrupo(
    grupos,
    "puestos",
    "💻",
    "Puestos gestor",
    "Puesto",
    config.puestosGestor,
    [
      "Cableado",
      "iPad",
      "Monitor",
      "Portátil",
      "Truncadora",
    ]
  );

  crearGrupo(
    grupos,
    "tv-turnos",
    "📺",
    "TV Turnos",
    "TV",
    config.televisionesTurnos,
    ["General"]
  );

  crearGrupo(
    grupos,
    "tv-publicidad",
    "📺",
    "TV Publicidad",
    "TV",
    config.televisionesPublicidad,
    ["General"]
  );

  return grupos;
}

function crearGrupo(
  grupos: DeviceGroup[],
  id: string,
  icono: string,
  nombre: string,
  elemento: string,
  cantidad: number,
  carpetas: string[]
) {

  if (cantidad <= 0) return;

  grupos.push({
    id,
    icono,
    nombre,
    elemento,
    elementos: Array.from({ length: cantidad }, (_, i) => ({
      nombre: `${elemento} ${i + 1}`,
      carpetas,
    })),
  });

}