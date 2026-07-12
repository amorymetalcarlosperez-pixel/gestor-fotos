import { useEffect, useState } from "react";

import {
  getMoveDestinations,
} from "../../services/projectDevices";

type Destination = {
  folder_name: string;
  nombre_zip: string;
  ubicacion_zip: string;
};

type Props = {
  open: boolean;
  projectId: string;
  deviceGroup: string;
  currentFolder: string;
  onClose: () => void;
  onMove: (destination: Destination) => void;
};

export default function MoveDeviceDialog({

  open,
  projectId,
  deviceGroup,
  currentFolder,
  onClose,
  onMove,

}: Props) {

  const [destinations, setDestinations] =
    useState<Destination[]>([]);

  const [selected, setSelected] =
    useState("");

  useEffect(() => {

    if (!open)
      return;

    cargar();

  }, [open]);

  async function cargar() {

    const { data, error } =
      await getMoveDestinations(
        projectId,
        deviceGroup
      );

    if (error) {

      console.error(error);

      return;

    }

    // Quitar el equipo actual y eliminar duplicados
    const unicos = new Map<string, Destination>();

    (data ?? [])
      .filter(d => d.folder_name !== currentFolder)
      .forEach(d => {

        if (!unicos.has(d.folder_name)) {

          unicos.set(d.folder_name, d);

        }

      });

    setDestinations(
      [...unicos.values()].sort((a, b) =>
        a.folder_name.localeCompare(
          b.folder_name,
          undefined,
          {
            numeric: true,
            sensitivity: "base",
          }
        )
      )
    );

  }

  if (!open)
    return null;

  return (

    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">

      <div className="card-surface rounded-[28px] w-full max-w-md p-6">

        <div className="text-2xl font-bold text-white">

          Mover dispositivo

        </div>

        <div className="mt-2 text-slate-400">

          Selecciona el nuevo equipo.

        </div>

        <select

          value={selected}

          onChange={(e) =>
            setSelected(e.target.value)
          }

          className="
            mt-6
            w-full
            rounded-2xl
            bg-slate-900
            border
            border-white/10
            p-4
            text-white
          "

        >

          <option value="">

            Seleccionar destino

          </option>

          {destinations.map((d, index) => (

            <option

              key={`${d.folder_name}-${index}`}

              value={d.folder_name}

            >

              {d.folder_name}

            </option>

          ))}

        </select>

        <div className="mt-8 flex gap-3">

          <button

            onClick={onClose}

            className="
              flex-1
              rounded-2xl
              btn-secondary
              py-3
            "

          >

            Cancelar

          </button>

          <button

            onClick={() => {

              const destino =
                destinations.find(
                  d =>
                    d.folder_name === selected
                );

              if (!destino)
                return;

              onMove(destino);

            }}

            className="
              flex-1
              rounded-2xl
              btn-spotify
              py-3
            "

          >

            Mover

          </button>

        </div>

      </div>

    </div>

  );

}