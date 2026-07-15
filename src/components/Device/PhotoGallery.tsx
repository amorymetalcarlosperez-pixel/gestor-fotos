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
  forceOpen?: boolean;
  onOpenHandled?: () => void;
};

export default function PhotoGallery({
  projectId,
  deviceId,
  carpeta,
  onChanged,
  forceOpen = false,
  onOpenHandled,
}: Props) {

  const [photos, setPhotos] = useState<
    (DevicePhoto & { url: string })[]
  >([]);

  const [cameraOpen, setCameraOpen] =
    useState(false);

 

 useEffect(() => {

  const handleOpenCamera = () => {

    setCameraOpen(true);

  };

  window.addEventListener(
    "open-photo-camera",
    handleOpenCamera
  );

  return () => {

    window.removeEventListener(
      "open-photo-camera",
      handleOpenCamera
    );

  };

}, []);

  useEffect(() => {

    cargar();

  }, [
    deviceId,
    carpeta,
  ]);

 useEffect(() => {

  if (forceOpen) {

    setCameraOpen(true);

    onOpenHandled?.();

  }

}, [
  forceOpen,
  onOpenHandled,
]);

  async function cargar() {

    const { data } =
      await getPhotos(
        deviceId,
        carpeta
      );

    const lista =
      await Promise.all(

        (data ?? []).map(async photo => ({

          ...photo,

          url:
            (await getPhotoSignedUrl(
              photo.storage_path
            )) ?? "",

        }))

      );

    setPhotos(lista);

  }

async function capturar(file: File) {

  //----------------------------------------
  // Cerrar la cámara inmediatamente
  //----------------------------------------

  setCameraOpen(false);

  //----------------------------------------
  // La subida continúa en segundo plano
  //----------------------------------------

  addPhoto(
    projectId,
    deviceId,
    carpeta,
    file
  )

    .then(async () => {

      await cargar();

      onChanged?.();

    })

    .catch(error => {

      console.error(error);

      alert(
        "Error al guardar la fotografía."
      );

    });

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

    <section className="mt-8">

      <div className="flex items-center justify-between mb-5">

        <div>

          <h2 className="text-xl font-bold text-white">

            {carpeta}

          </h2>

          <p className="mt-1 text-slate-400">

            {photos.length} fotografías

          </p>

        </div>

        <button
          type="button"
          onClick={(e) => {

            e.preventDefault();

            e.stopPropagation();

            setCameraOpen(true);

          }}
          className="
            btn-spotify
            rounded-2xl
            px-5
            py-3
            text-white
            transition
            disabled:opacity-50
          "
        >

          Añadir foto

        </button>

      </div>

      {photos.length === 0 ? (

        <div
          className="
            rounded-3xl
            border
            border-white/10
            bg-white/5
            p-10
            text-center
          "
        >

          <div className="text-lg font-semibold text-white">

            Todavía no hay fotografías

          </div>

          <div className="mt-2 text-slate-400">

            Pulsa "Añadir foto" para comenzar.

          </div>

        </div>

      ) : (

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">

          {photos.map(photo => (

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
        onClose={() => setCameraOpen(false)}
        onCapture={capturar}
      />

    </section>

  );

}