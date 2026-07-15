import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Card from "../../components/ui/Card";
import Page from "../../components/ui/Page";

import {
  createUnknownDevice,
  createDeviceFromTemplate,
} from "../../services/unknownDevices";

import { getLocationsByGroup } from "../../services/projectGroups";

import { getDevicesByGroup } from "../../services/deviceTemplates";

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

  const { projectId, assetTag } =
    useParams();

  const navigate =
    useNavigate();

  //------------------------------------
  // Estados
  //------------------------------------

  const [grupo, setGrupo] =
    useState("");

  const [locations, setLocations] =
    useState<string[]>([]);

  const [templates, setTemplates] =
    useState<any[]>([]);

  const [selectedTemplate, setSelectedTemplate] =
    useState<any>(null);

  const [copiarExistente, setCopiarExistente] =
    useState(true);

  const [selectedLocation, setSelectedLocation] =
    useState("");

  const [usarNueva, setUsarNueva] =
    useState(false);

  const [nuevaUbicacion, setNuevaUbicacion] =
    useState("");

  const [nombre, setNombre] =
    useState("");

  const [modelo, setModelo] =
    useState("");

  const [tipo, setTipo] =
    useState("OTRO");

  const [serial, setSerial] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  //------------------------------------
  // Cargar datos
  //------------------------------------
  

console.log("projectId =", projectId);
console.log("assetTag =", assetTag);

  useEffect(() => {

    if (!grupo || !projectId)
      return;

    cargar();

  }, [grupo, projectId]);
    async function cargar() {

    const lista =
      await getLocationsByGroup(
        projectId!,
        grupo
      );

    setLocations(lista);

    const result =
      await getDevicesByGroup(
        projectId!,
        grupo
      );

    if (!result.error) {

      setTemplates(
        result.data ?? []
      );

    }

  }

  //------------------------------------
  // Crear dispositivo
  //------------------------------------

  async function crear() {

    if (!projectId || !assetTag)
      return;

    const ubicacion =
      usarNueva
        ? nuevaUbicacion.trim()
        : selectedLocation;

    if (!grupo) {

      alert(
        "Selecciona un grupo."
      );

      return;

    }

    if (!ubicacion) {

      alert(
        "Selecciona una ubicación."
      );

      return;

    }

    try {

      setLoading(true);

      //--------------------------------
      // Copiar dispositivo existente
      //--------------------------------

      if (
        copiarExistente &&
        selectedTemplate
      ) {
        console.log({
  projectId,
  assetTag,
  grupo,
  ubicacion,
  nombre,
  modelo,
  tipo,
  serial,
  selectedTemplate,
});

const device =      await createDeviceFromTemplate({

  projectId,

  assetTag,

  template:selectedTemplate,

  ubicacion,

  nombre,

  serial,

});
 
        navigate(

          `/projects/${projectId}/${device.device_group}/${encodeURIComponent(
            device.ubicacion_zip
          )}/${device.id}`

        );

        return;

      }

      //--------------------------------
      // Crear completamente nuevo
      //--------------------------------
      console.log({
  projectId,
  assetTag,
  grupo,
  ubicacion,
});
      const device =
        await createUnknownDevice({

          projectId,

          assetTag,

          grupo,

          ubicacion,

          nombre,

          modelo,

          tipo,

          serial,

        });

      navigate(

        `/projects/${projectId}/${device.device_group}/${encodeURIComponent(
          device.ubicacion_zip
        )}/${device.id}`

      );

    }

    catch (error) {

      console.error(error);

      alert(
        "No se pudo crear el dispositivo."
      );

    }

    finally {

      setLoading(false);

    }

  }

  //------------------------------------
  // Selección del grupo
  //------------------------------------

  if (!grupo) {

    return (

      <Page

        title="Dispositivo no encontrado"

        subtitle={assetTag}

      >

        <div className="space-y-4">

          {grupos.map(g => (

            <Card

              key={g}

              onClick={() =>

                setGrupo(g)

              }

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
    //------------------------------------
  // Formulario
  //------------------------------------

  return (

    <Page

      title="Nuevo dispositivo"

      subtitle={assetTag}

    >

      <Card>

        <div className="space-y-6">

          <div>

            <div className="font-semibold mb-2">

              Grupo

            </div>

            <div>

  <div className="font-semibold mb-2">

    Grupo

  </div>

  <div
    className="
      rounded-xl
      border
      border-slate-700
      bg-slate-800
      text-white
      px-4
      py-3
      font-medium
    "
  >

    {grupo}

  </div>

</div>

          </div>

          <div>

            <div className="font-semibold mb-2">

              Ubicación existente

            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">

  {templates.map((device) => {

    const selected =
  selectedTemplate?.id === device.id;

    return (

      <Card

        key={device.id}

        onClick={() =>
  setSelectedTemplate(device)
}

        className={

          selected

            ? "border-2 border-blue-600 bg-blue-50"

            : "border border-slate-300 hover:border-blue-400"

        }

      >

        <div className="flex justify-between">

          <div className="flex-1">

            <div className="font-semibold text-lg">

              {device.display_name || "Sin nombre"}

            </div>

            <div className="text-sm text-slate-500 mt-1">

               {device.ubicacion_zip}

            </div>

            <div className="text-sm text-slate-500">

               {device.model || "Modelo desconocido"}

            </div>

            <div className="text-sm text-slate-500">

              🏷 {device.device_type || "OTRO"}

            </div>

          </div>

          {selected && (

            <div className="text-2xl">

              ✅

            </div>

          )}

        </div>

      </Card>

    );

  })}

</div>
          </div>

          <label className="flex items-center gap-2">

            <input

              type="checkbox"

              checked={usarNueva}

              onChange={(e) =>

                setUsarNueva(
                  e.target.checked
                )

              }

            />

            Crear ubicación nueva

          </label>

          {usarNueva && (

            <input

              className="w-full rounded-xl border p-3"

              value={nuevaUbicacion}

              onChange={(e) =>

                setNuevaUbicacion(
                  e.target.value
                )

              }

              placeholder="Nueva ubicación"

            />

          )}

          <div className="border-t pt-5">

            <div className="font-semibold">

              ¿Cómo quieres crear el dispositivo?

            </div>

            <div className="mt-4 space-y-2">

              <label className="flex items-center gap-2">

                <input

                  type="radio"

                  checked={copiarExistente}

                  onChange={() => {

                    setCopiarExistente(true);

                    setSelectedTemplate(null);

                  }}

                />

                Copiar uno existente

              </label>

              <label className="flex items-center gap-2">

                <input

                  type="radio"

                  checked={!copiarExistente}

                  onChange={() =>

                    setCopiarExistente(false)

                  }

                />

                Crear completamente nuevo

              </label>

            </div>

          </div>
                    {copiarExistente && (

            <div>

              <div className="font-semibold mb-2">

                Copiar de un dispositivo existente

              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">

  {locations.map((loc) => {

    const selected =
      selectedLocation === loc && !usarNueva;

    return (

      <Card

        key={loc}

        onClick={() => {

          setUsarNueva(false);

          setSelectedLocation(loc);

        }}

        className={

          selected

            ? "border-2 border-blue-600 bg-blue-50"

            : "border border-slate-300 hover:border-blue-400"

        }

      >

        <div className="flex justify-between items-center">

          <div>

            <div className="font-semibold">

               {loc}

            </div>

          </div>

          {selected && (

            <div className="text-2xl">

              ✅

            </div>

          )}

        </div>

      </Card>

    );

  })}

</div>

            </div>

          )}

          {/*------------------------------------*/
/* Nombre (SIEMPRE visible)           */
/*------------------------------------*/}

<div>

  <div className="font-semibold mb-2">

    Nombre del dispositivo

  </div>

  <input

    className="w-full rounded-xl border p-3"

    value={nombre}

    onChange={(e) =>
      setNombre(e.target.value)
    }

    placeholder="Ej. IMPRESORA 5"

  />

</div>

{/*------------------------------------*/
/* Modelo y tipo solo para nuevo      */
/*------------------------------------*/}

{!copiarExistente && (

  <>

    <div>

      <div className="font-semibold mb-2">

        Modelo

      </div>

      <input

        className="w-full rounded-xl border p-3"

        value={modelo}

        onChange={(e) =>
          setModelo(e.target.value)
        }

        placeholder="Ej. Dell Optiplex"

      />

    </div>

    <div>

      <div className="font-semibold mb-2">

        Tipo

      </div>

      <input

        className="w-full rounded-xl border p-3"

        value={tipo}

        onChange={(e) =>
          setTipo(e.target.value)
        }

        placeholder="Ej. PC"

      />

    </div>

  </>

)}
          <div>

            <div className="font-semibold mb-2">

              Número de serie

            </div>

            <input

              className="w-full rounded-xl border p-3"

              value={serial}

              onChange={(e) =>

                setSerial(
                  e.target.value
                )

              }

              placeholder="Número de serie"

            />

          </div>

          <button
  disabled={
    loading ||
    (!usarNueva && selectedLocation === "") ||
    (usarNueva && nuevaUbicacion.trim() === "")
  }
  onClick={crear}
  className="w-full rounded-xl bg-slate-900 text-white py-3"
>
  Crear dispositivo
</button>
                  </div>

      </Card>

    </Page>

  );

}