import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Card from "../../components/ui/Card";
import Page from "../../components/ui/Page";
import ScannerDialog from "../../components/Device/ScannerDialog";

import { scanProject } from "../../services/scanner";

export default function ScanPage() {

  const { projectId } = useParams();

  const navigate = useNavigate();

  const [open, setOpen] =
    useState(false);

  const [assetTag, setAssetTag] =
    useState("");

  async function detectar(
    codigo: string
  ) {

    if (!projectId)
      return;

    try {

      const resultado =
        await scanProject(
          projectId,
          codigo.trim()
        );

      setOpen(false);

      setAssetTag("");

      if (resultado.found) {

        const d =
          resultado.device;
      navigate(

  `/projects/${projectId}/${d.device_group}/${encodeURIComponent(
    d.ubicacion_zip
  )}`

      );
        return;

      }

      navigate(

        `/projects/${projectId}/unknown/${codigo}`

      );

    }

    catch (error) {

      console.error(error);

      alert(
        "Error buscando el dispositivo."
      );

    }

  }

  return (

    <Page

      title="Escanear dispositivo"

      subtitle="Escanea o introduce el Asset Tag"

    >

      <Card
        onClick={() => setOpen(true)}
      >

        <div className="py-10 text-center">

          <div className="text-5xl">

            📷

          </div>

          <div className="mt-5 text-2xl font-bold">

            Abrir cámara

          </div>

          <div className="mt-2 text-slate-500">

            Escanea la etiqueta del dispositivo

          </div>

        </div>

      </Card>

      <Card className="mt-6">

        <div className="font-semibold text-lg">

          Búsqueda manual

        </div>

        <div className="text-slate-500 mt-1">

          Introduce el Asset Tag si la etiqueta no puede escanearse.

        </div>

        <input

          type="text"

          value={assetTag}

          onChange={(e) =>
            setAssetTag(
              e.target.value
            )
          }

          onKeyDown={(e) => {

            if (
              e.key === "Enter" &&
              assetTag.trim()
            ) {

              detectar(
                assetTag
              );

            }

          }}

          placeholder="Ej. 0044073"

          className="
            w-full
            mt-5
            rounded-xl
            border
            border-slate-300
            px-4
            py-3
            text-lg
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "

        />

        <button

          onClick={() => {

            if (
              assetTag.trim()
            ) {

              detectar(
                assetTag
              );

            }

          }}

          className="
            mt-4
            w-full
            rounded-xl
            bg-slate-900
            text-white
            py-3
            hover:bg-black
            transition
          "

        >

          Buscar dispositivo

        </button>

      </Card>

      <ScannerDialog

        open={open}

        onClose={() =>
          setOpen(false)
        }

        onDetected={detectar}

      />

    </Page>

  );

}