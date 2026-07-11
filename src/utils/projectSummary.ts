export interface CategorySummary {

  nombre: string;

  total: number;

  finalizados: number;

  porcentaje: number;

}

export function buildSummary(
  devices: any[]
): CategorySummary[] {

  const grupos:
    Record<string, CategorySummary> = {};

  devices.forEach((device) => {

    const nombre =
      device.device_group;

    if (!grupos[nombre]) {

      grupos[nombre] = {

        nombre,

        total: 0,

        finalizados: 0,

        porcentaje: 0,

      };

    }

    grupos[nombre].total++;

    const estado =
      Array.isArray(device.device_status)
        ? device.device_status[0]
        : device.device_status;

    if (estado?.finalizado) {

      grupos[nombre].finalizados++;

    }

  });

  return Object.values(grupos)

    .map((g) => ({

      ...g,

      porcentaje:

        g.total === 0

          ? 0

          : Math.round(

              (g.finalizados * 100) /

              g.total

            ),

    }))

    .sort((a, b) =>

      a.nombre.localeCompare(

        b.nombre,

        undefined,

        {

          numeric: true,

          sensitivity: "base",

        }

      )

    );

}