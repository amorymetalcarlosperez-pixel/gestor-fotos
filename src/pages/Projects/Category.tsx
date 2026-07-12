import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getProjectDevices,
  type ProjectDevice,
} from "../../services/projectDevices";

import Page from "../../components/ui/Page";
import Card from "../../components/ui/Card";
import Status from "../../components/ui/Status";
const [devices, setDevices] =
  useState<ProjectDevice[]>([]);

export default function Category() {

  const {
    projectId,
    category,
  } = useParams();

  const navigate = useNavigate();

  const [devices, setDevices] =
    useState<ProjectDevice[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (projectId) {

      cargar();

    }

  }, [projectId]);

  async function cargar() {

    setLoading(true);

    const {
      data,
      error,
    } = await getProjectDevices(projectId!);

    if (error) {

      console.error(error);

      setLoading(false);

      return;

    }

    setDevices((data as ProjectDevice[]) ?? []);

    setLoading(false);

  }

  const ubicaciones = useMemo(() => {

  const mapa = new Map<
    string,
    {
      nombre: string;
      total: number;
      completed: boolean;
      primerDispositivo: ProjectDevice;
    }
  >();

  devices
    .filter(d => d.device_group === category)
    .forEach(d => {

      const estado = Array.isArray(d.device_status)
        ? d.device_status[0]
        : d.device_status;

      const actual = mapa.get(d.ubicacion_zip);

      if (!actual) {

        mapa.set(d.ubicacion_zip, {
          nombre: d.ubicacion_zip,
          total: 1,
          completed: estado?.finalizado ?? false,
          primerDispositivo: d,
        });

      } else {

        actual.total++;

        actual.completed =
          actual.completed &&
          (estado?.finalizado ?? false);

      }

    });

  return [...mapa.values()].sort((a, b) =>
    a.nombre.localeCompare(
      b.nombre,
      undefined,
      {
        numeric: true,
        sensitivity: "base",
      }
    )
  );

}, [devices, category]);

  if (loading) {

    return (

      <Page
        title={category ?? ""}
        subtitle="Cargando..."
      >

        <Card>

          <div className="py-8 text-center">
            Cargando...
          </div>

        </Card>

      </Page>

    );

  }

  return (

    <Page
      title={category ?? ""}
      subtitle={`${ubicaciones.length} ubicaciones`}
    >

      {ubicaciones.map((u) => (

  <Card
    key={u.nombre}
    onClick={() =>
      navigate(
        `/projects/${projectId}/${category}/${encodeURIComponent(
          u.nombre
        )}`
      )
    }
  >

    <div className="flex justify-between items-start">

      <div className="flex-1">

        <div className="text-xl font-semibold text-white">

          {u.nombre}

        </div>

        <div className="mt-1 text-slate-400">

          {u.total} dispositivos

        </div>

        <div className="mt-3 text-sm text-slate-300">

          <strong>Asset:</strong>{" "}
          {u.primerDispositivo.asset_tag_actual ||
            u.primerDispositivo.asset_tag ||
            "-"}

        </div>

        <div className="text-sm text-slate-300">

          <strong>S/N:</strong>{" "}
          {u.primerDispositivo.serial_number_actual ||
            u.primerDispositivo.serial_number ||
            "-"}

        </div>

      </div>

      <Status completed={u.completed} />

    </div>

  </Card>

))}

    </Page>

  );

}