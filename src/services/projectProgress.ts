import { getProjectDevices } from "./projectDevices";

export type ProjectProgress = {

  total: number;

  finalizados: number;

  porcentaje: number;

  grupos: Record<
    string,
    {
      total: number;
      finalizados: number;
      porcentaje: number;
      terminado: boolean;
    }
  >;

};

export async function calculateProjectProgress(
  projectId: string
): Promise<ProjectProgress> {

  const { data, error } =
    await getProjectDevices(projectId);

  if (error)
    throw error;

  const devices = data ?? [];

  let finalizados = 0;

  const grupos: Record<string, any> = {};

  devices.forEach((device: any) => {

    const estado = Array.isArray(device.device_status)
      ? device.device_status[0]
      : device.device_status;

    if (!grupos[device.device_group]) {

      grupos[device.device_group] = {

        total: 0,

        finalizados: 0,

        porcentaje: 0,

        terminado: false,

      };

    }

    grupos[device.device_group].total++;

    if (estado?.finalizado) {

      finalizados++;

      grupos[device.device_group].finalizados++;

    }

  });

  Object.values(grupos).forEach((g: any) => {

    g.porcentaje =
      g.total === 0
        ? 0
        : Math.round(
            (g.finalizados * 100) / g.total
          );

    g.terminado =
      g.finalizados === g.total;

  });

  return {

    total: devices.length,

    finalizados,

    porcentaje:

      devices.length === 0
        ? 0
        : Math.round(
            (finalizados * 100) /
              devices.length
          ),

    grupos,

  };

}