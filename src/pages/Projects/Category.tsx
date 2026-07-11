import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getProjectDevices } from "../../services/projectDevices";

import Page from "../../components/ui/Page";
import Card from "../../components/ui/Card";
import ProgressBar from "../../components/ui/ProgressBar";

type Device = {
  id: string;
  device_group: string;
  ubicacion_zip: string;
};

export default function Category() {

  const {
    projectId,
    category,
  } = useParams();

  const navigate = useNavigate();

  const [devices, setDevices] =
    useState<Device[]>([]);

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

    setDevices((data as Device[]) ?? []);

    setLoading(false);

  }

  const ubicaciones =
    useMemo(() => {

      const mapa: Record<string, number> = {};

      devices
        .filter(
          d => d.device_group === category
        )
        .forEach(d => {

          mapa[d.ubicacion_zip] =
            (mapa[d.ubicacion_zip] ?? 0) + 1;

        });

      return Object.entries(mapa)
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

          <div className="flex justify-between items-center">

            <div>

              <div className="text-xl font-semibold">

                {u.nombre}

              </div>

              <div className="text-slate-500 mt-1">

                {u.total} dispositivos

              </div>

            </div>

            <div className="w-24">

              <ProgressBar value={0} />

              <div className="text-center mt-2 text-sm font-semibold">

                0%

              </div>

            </div>

          </div>

        </Card>

      ))}

    </Page>

  );

}