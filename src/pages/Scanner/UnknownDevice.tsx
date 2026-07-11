import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Card from "../../components/ui/Card";
import Page from "../../components/ui/Page";

import { createUnknownDevice } from "../../services/unknownDevices";
import { getLocationsByGroup } from "../../services/projectGroups";

const grupos = [
  "PUESTOS",
  "AUTOSERVICIO",
  "ATENCION_RAPIDA",
  "IMPRESORAS",
  "RACK",
  "SACATURNOS",
  "TV_LLAMATURNOS",
  "TV_PUBLICIDAD",
];

export default function UnknownDevice() {

  const { projectId, assetTag } = useParams();

  const navigate = useNavigate();

  const [grupo, setGrupo] = useState("");

  const [locations, setLocations] = useState<string[]>([]);

  const [nuevaUbicacion, setNuevaUbicacion] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (!grupo || !projectId)
      return;

    cargarUbicaciones();

  }, [grupo]);

  async function cargarUbicaciones() {

    const lista =
      await getLocationsByGroup(
        projectId!,
        grupo
      );

    setLocations(lista);

  }

  async function crear(
    ubicacion: string
  ) {

    if (
      !projectId ||
      !assetTag
    )
      return;

    try {

      setLoading(true);

      const device =
        await createUnknownDevice(
          projectId,
          assetTag,
          grupo,
          ubicacion
        );

      navigate(

        `/projects/${projectId}/${device.device_group}/${encodeURIComponent(
          device.ubicacion_zip
        )}/${device.id}`

      );

    }

    catch (e) {

      console.error(e);

      alert("No se pudo crear.");

    }

    finally {

      setLoading(false);

    }

  }

  if (!grupo) {

    return (

      <Page
        title="Dispositivo desconocido"
        subtitle={assetTag}
      >

        <div className="space-y-4">

          {grupos.map(g => (

            <Card
              key={g}
              onClick={() => setGrupo(g)}
            >

              <div className="text-xl font-semibold">

                {g}

              </div>

            </Card>

          ))}

        </div>

      </Page>

    );

  }

  return (

    <Page
      title={grupo}
      subtitle="Selecciona una ubicación"
    >

      <div className="space-y-4">

        {locations.map(loc => (

          <Card
            key={loc}
            onClick={() => crear(loc)}
          >

            <div className="text-xl font-semibold">

              {loc}

            </div>

          </Card>

        ))}

        <Card>

          <div className="space-y-3">

            <div className="font-semibold">

              Nueva ubicación

            </div>

            <input

              className="border rounded-xl p-3 w-full"

              value={nuevaUbicacion}

              onChange={(e)=>

                setNuevaUbicacion(
                  e.target.value
                )

              }

              placeholder="Ej. AUTOSERVICIO 7"

            />

            <button

              disabled={
                loading ||
                !nuevaUbicacion.trim()
              }

              onClick={()=>

                crear(
                  nuevaUbicacion.trim()
                )

              }

              className="w-full rounded-xl bg-slate-900 text-white py-3"

            >

              Crear dispositivo

            </button>

          </div>

        </Card>

      </div>

    </Page>

  );

}