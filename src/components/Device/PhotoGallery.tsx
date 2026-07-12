import { useEffect, useState } from "react";
import {
  addPhoto,
  getPhotoSignedUrl,
  getPhotos,
  removePhoto,
  type DevicePhoto,
} from "../../services/photos";

import PhotoCard from "./PhotoCard";
import CameraDialog from "./CameraDialog";

type Props = {
  projectId: string;
  deviceId: string;
  carpeta: "ANTES" | "DESPUES";
  onChanged?: () => void;
};

export default function PhotoGallery({
  projectId,
  deviceId,
  carpeta,
  onChanged,
}: Props) {

  const [photos, setPhotos] = useState<
    (DevicePhoto & {
      url: string;
    })[]
  >([]);

  const [cameraOpen, setCameraOpen] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    const handleOpenCamera = () => {
      console.log("[PhotoGallery] open-photo-camera received");
      if (!saving) {
        setCameraOpen(true);
      }
    };

    window.addEventListener("open-photo-camera", handleOpenCamera);

    return () => {
      window.removeEventListener("open-photo-camera", handleOpenCamera);
    };
  }, [saving]);

  useEffect(() => {

    cargar();

  }, [
    deviceId,
    carpeta,
  ]);

  async function cargar() {

    const { data } =
      await getPhotos(
        deviceId,
        carpeta
      );

    const lista =
      await Promise.all(

        (data ?? []).map(async (photo) => ({

          ...photo,

          url:
            (await getPhotoSignedUrl(
              photo.storage_path
            )) ?? "",

        }))

      );

    setPhotos(lista);

  }

  async function capturar(
    file: File
  ) {

    if (saving)
      return;

    setSaving(true);

    try {

      await addPhoto(
        projectId,
        deviceId,
        carpeta,
        file
      );

      await cargar();

      onChanged?.();

    }

    catch (error) {

      console.error(error);

      alert(
        "Error al guardar la fotografía."
      );

    }

    finally {

      setSaving(false);

      setCameraOpen(false);

    }

  }

  async function borrar(
    photo: DevicePhoto
  ) {

    if (
      !confirm(
        "¿Eliminar fotografía?"
      )
    )
      return;

    try {

      await removePhoto(photo);

      await cargar();

      onChanged?.();

    }

    catch (error) {

      console.error(error);

      alert(
        "Error eliminando la fotografía."
      );

    }

  }

  return (

    <div className="mt-6 bg-white rounded-3xl p-5 shadow border border-slate-100 relative">

      <div className="flex justify-between items-center mb-5">

        <div>

          <div className="text-2xl font-bold">

            {carpeta}

          </div>

          <div className="text-slate-500">

            {photos.length} fotografías

          </div>

        </div>

      </div>

      <div className="mb-5">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setCameraOpen(true);
          }}
          disabled={saving}
          className="
            w-full
            rounded-2xl
            bg-slate-900
            text-white
            px-5
            py-3
            touch-manipulation
            select-none
            min-h-12
            relative z-20
          "
        >
          Añadir foto
        </button>
      </div>

      <div className="mb-5">
        <div className="text-sm text-slate-500">
          Añade una foto desde aquí
        </div>
      </div>

      {photos.length === 0 ? (

        <div className="rounded-2xl border-2 border-dashed border-slate-300 p-10 text-center">

          <div className="text-lg font-medium text-slate-700">

            Todavía no hay fotografías

          </div>

          <div className="text-slate-500 mt-2">

            Pulsa "Añadir foto" para comenzar.

          </div>

        </div>

      ) : (

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">

          {photos.map((photo) => (

            <PhotoCard

              key={photo.id}

              photo={photo}

              onDelete={borrar}

            />

          ))}

        </div>
        

      )}

      <CameraDialog

        open={cameraOpen}

        onClose={() =>
          setCameraOpen(false)
        }

        onCapture={capturar}

      />

    </div>

  );

}