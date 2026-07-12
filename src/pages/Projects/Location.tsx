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

          <div className="flex justify-between items-start">

            <div className="flex-1">

              <div className="text-xl font-semibold text-white">

                {category === "AUTOSERVICIO"
                  ? decodeURIComponent(location!)
                  : device.nombre_zip}

              </div>

              <div className="mt-1 text-slate-400">

                {category === "AUTOSERVICIO"
                  ? `${lista.length} dispositivos`
                  : device.display_name}

              </div>

              <div className="mt-3 text-sm text-slate-300">

                <strong>Asset:</strong>{" "}
                {device.asset_tag_actual ||
                  device.asset_tag ||
                  "-"}

              </div>

              <div className="text-sm text-slate-300">

                <strong>S/N:</strong>{" "}
                {device.serial_number_actual ||
                  device.serial_number ||
                  "-"}

              </div>

            </div>

            <Status
              completed={
                Array.isArray(device.device_status)
                  ? (device.device_status[0]?.finalizado ?? false)
                  : (device.device_status?.finalizado ?? false)
              }
            />

          </div>

        </Card>

      ))}

    </Page>

  );

}