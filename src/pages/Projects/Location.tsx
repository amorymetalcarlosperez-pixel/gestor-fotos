import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getProjectDevices,
  type ProjectDevice,
} from "../../services/projectDevices";

import Page from "../../components/ui/Page";
import Card from "../../components/ui/Card";
import Status from "../../components/ui/Status";

export default function Location() {

  const {
    projectId,
    category,
    location,
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

  }, [
    projectId,
    category,
    location,
  ]);

  async function cargar() {

    setLoading(true);

    const {
      data,
      error,
    } = await getProjectDevices(
      projectId!
    );

    if (error) {

      console.error(error);

      setLoading(false);

      return;

    }

    const todos =
      data ?? [];

    setDevices(todos);

    setLoading(false);

    const lista = todos

      .filter(
        d =>
          d.device_group === category &&
          d.ubicacion_zip === decodeURIComponent(location!)
      )

      .sort((a, b) =>

        a.nombre_zip.localeCompare(

          b.nombre_zip,

          undefined,

          {
            numeric: true,
            sensitivity: "base",
          }

        )

      );

    //---------------------------------
    // Si solo hay un dispositivo,
    // entrar directamente
    //---------------------------------

    if (lista.length === 1) {

      navigate(

        `/projects/${projectId}/${category}/${encodeURIComponent(location!)}/${lista[0].id}`,

        {
          replace: true,
        }

      );

    }

  }

  const lista = useMemo(() => {

    return devices

      .filter(
        d =>
          d.device_group === category &&
          d.ubicacion_zip === decodeURIComponent(location!)
      )

      .sort((a, b) =>

        a.nombre_zip.localeCompare(

          b.nombre_zip,

          undefined,

          {
            numeric: true,
            sensitivity: "base",
          }

        )

      );

  }, [devices, category, location]);

  if (loading) {

    return (

      <Page
        title={decodeURIComponent(location ?? "")}
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
      title={decodeURIComponent(location ?? "")}
      subtitle={`${lista.length} dispositivos`}
    >

      {(category === "AUTOSERVICIO"
  ? lista.slice(0, 1)
  : lista
).map(device => (

  <Card
    key={device.id}
    onClick={() =>
      navigate(
        `/projects/${projectId}/${category}/${encodeURIComponent(location!)}/${device.id}`
      )
    }
  >

          <div className="flex justify-between items-center">

            <div>

              <div className="text-xl font-semibold">
  {category === "AUTOSERVICIO"
    ? decodeURIComponent(location!)
    : device.nombre_zip}
</div>

<div className="text-slate-500 mt-1">
  {category === "AUTOSERVICIO"
    ? `${lista.length} dispositivos`
    : device.display_name}
</div>

              {device.serial_number && (

                <div className="text-sm text-slate-400 mt-2">

                  S/N {device.serial_number}

                </div>

              )}

            </div>

            <Status completed={false} />

          </div>

        </Card>

      ))}

    </Page>

  );

}