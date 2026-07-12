import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { exportProject } from "../../services/exportProject";
import { deleteProject } from "../../services/deleteProject";
import Page from "../../components/ui/Page";
import Card from "../../components/ui/Card";
import ProgressBar from "../../components/ui/ProgressBar";

import {
  getProjectDevices,
  getNextPendingDevice,
} from "../../services/projectDevices";

import {
  calculateProjectProgress,
  type ProjectProgress,
} from "../../services/projectProgress";

type Device = {
  id: string;
  device_group: string;
  ubicacion_zip: string;
};

type Categoria = {
  nombre: string;
  total: number;
};

export default function Project() {

  const { projectId } = useParams();

  const navigate = useNavigate();

  const [devices, setDevices] =
    useState<Device[]>([]);

  const [progress, setProgress] =
    useState<ProjectProgress | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (projectId) {

      cargar();

    }

  }, [projectId]);

  async function cargar() {

    if (!projectId)
      return;

    setLoading(true);

    try {

      const {
        data,
        error,
      } = await getProjectDevices(projectId);

      if (error) {

        console.error(error);

        return;

      }

      setDevices((data as Device[]) ?? []);

      const resumen =
        await calculateProjectProgress(
          projectId
        );

      setProgress(resumen);

    }

    catch (e) {

      console.error(e);

    }

    finally {

      setLoading(false);

    }

  }

  async function continuarInventario() {

    if (!projectId)
      return;

    try {

      const device =
        await getNextPendingDevice(
          projectId
        );

      if (!device) {

        alert(
          "Todo el proyecto está finalizado."
        );

        return;

      }

      navigate(

        `/projects/${projectId}/${device.device_group}/${encodeURIComponent(
          device.ubicacion_zip
        )}/${device.id}`

      );

    }

    catch (e) {

      console.error(e);

      alert(
        "No se ha podido continuar el inventario."
      );

    }

  }

  async function finalizarProyecto() {

    if (!projectId)
      return;

    const porcentaje =
      progress?.porcentaje ?? 0;

    const pendientes =
      (progress?.total ?? 0) -
      (progress?.finalizados ?? 0);

    let mensaje =
      `Progreso: ${porcentaje}%\n`;

    if (pendientes > 0) {

      mensaje +=
        `Quedan ${pendientes} dispositivos pendientes.\n\n`;

    }

    mensaje +=
      "¿Deseas generar igualmente la entrega?";

    if (!confirm(mensaje))
      return;

    try {

      await exportProject(projectId);

      alert(
        "Entrega generada correctamente."
      );

    }

    catch (error) {

      console.error(error);

      alert(
        "Error generando la entrega."
      );

    }

  }
  async function eliminarProyecto() {

  if (!projectId)
    return;

  const ok = confirm(

`⚠️ Se eliminará completamente el proyecto.

También se eliminarán:

• Inventario Excel
• Todas las fotografías
• Estados de dispositivos

Esta acción NO se puede deshacer.

¿Continuar?`

  );

  if (!ok)
    return;

  try {

    await deleteProject(
      projectId
    );

    alert(
      "Proyecto eliminado."
    );

    navigate("/");

  }

  catch (error) {

    console.error(error);

    alert(
      "No se ha podido eliminar el proyecto."
    );

  }

}

  const categorias =
    useMemo<Categoria[]>(() => {

      const grupos:
        Record<string, number> = {};

      devices.forEach((d) => {

        grupos[d.device_group] =
          (grupos[d.device_group] ?? 0) + 1;

      });

      return Object.entries(grupos)

        .map(([nombre, total]) => ({
          nombre,
          total,
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

    }, [devices]);

  if (loading) {

    return (

      <Page
        title="Proyecto"
        subtitle="Cargando..."
      >

        <div className="text-slate-500">

          Cargando inventario...

        </div>

      </Page>

    );

  }

  return (

    <Page
      title="Proyecto"
      subtitle={`${devices.length} dispositivos`}
    >

      <Card>

        <div className="text-5xl font-bold text-white">

          {progress?.porcentaje ?? 0}%

        </div>

        <div className="mt-4">

          <ProgressBar
            value={
              progress?.porcentaje ?? 0
            }
          />

        </div>

        <div className="mt-3 text-slate-400">

          {progress?.finalizados ?? 0}
          {" / "}
          {progress?.total ?? 0}
          {" dispositivos"}

        </div>

      </Card>

      <Card
        onClick={continuarInventario}
      >

        <div className="text-xl font-semibold text-white">

          Continuar inventario

        </div>

        <div className="text-slate-400 mt-1">

          Abrir el siguiente dispositivo pendiente

        </div>

      </Card>

      <Card
        onClick={() =>
          navigate(
            `/projects/${projectId}/scan`
          )
        }
      >

        <div className="text-xl font-semibold text-white">

          Escanear etiqueta

        </div>

        <div className="text-slate-400 mt-1">

          Buscar un dispositivo por Asset Tag

        </div>

      </Card>

      <Card
        onClick={finalizarProyecto}
      >

        <div className="text-xl font-semibold text-white">

          Finalizar proyecto

        </div>

        <div className="text-slate-400 mt-1">

          Generar la entrega del proyecto

        </div>

      </Card>
      <Card
  onClick={eliminarProyecto}
>

  <div className="text-xl font-semibold text-rose-400">

    Eliminar proyecto

  </div>

  <div className="text-slate-400 mt-1">

    Elimina completamente el proyecto

  </div>

</Card>

      <div className="space-y-4">

        {categorias.map((cat) => {

          const info =
            progress?.grupos[
              cat.nombre
            ];

          return (

            <Card

              key={cat.nombre}

              onClick={() =>

                navigate(

                  `/projects/${projectId}/${cat.nombre}`

                )

              }

            >

              <div className="flex justify-between items-center">

                <div>

                  <div className="text-xl font-semibold text-white">

                    {cat.nombre}

                  </div>

                  <div className="text-slate-400 mt-1">

                    {cat.total} dispositivos

                  </div>

                </div>

                <div className="text-right">

                  <div className="font-bold">

                    {info?.porcentaje ?? 0}%

                  </div>

                  <div className="text-sm text-slate-400">

                    {info?.finalizados ?? 0}
                    {" / "}
                    {info?.total ?? cat.total}

                  </div>

                </div>

              </div>

              <div className="mt-4">

                <ProgressBar
                  value={
                    info?.porcentaje ?? 0
                  }
                />

              </div>

            </Card>

          );

        })}

      </div>

    </Page>

  );

}