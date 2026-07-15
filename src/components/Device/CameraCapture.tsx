import { useEffect, useRef, useState } from "react";

type Props = {
  onCapture: (file: File) => Promise<void>;
  onClose: () => void;
};

export default function CameraCapture({
  onCapture,
  onClose,
}: Props) {

  const videoRef =
    useRef<HTMLVideoElement>(null);

  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const [ready, setReady] =
    useState(false);

  const [saving, setSaving] =
    useState(false);
    const [quality, setQuality] =
  useState<"FAST" | "NORMAL" | "HIGH">(
    "NORMAL"
  );

  useEffect(() => {

    iniciar();

    return () => {

      detener();

    };

  }, []);

  async function iniciar() {

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({

          video: {

            facingMode: "environment",

            width: {
              ideal: 1920,
            },

            height: {
              ideal: 1080,
            },

          },

          audio: false,

        });

      streamRef.current =
        stream;

      const video =
        videoRef.current;

      if (!video)
        return;

      video.srcObject =
        stream;

      video.onloadedmetadata =
        async () => {

          try {

            await video.play();

            setReady(true);

          }

          catch (error) {

            console.error(error);

          }

        };

    }

    catch (error) {

      console.error(error);

      alert(
        "No se ha podido acceder a la cámara."
      );

      onClose();

    }

  }

  function detener() {

    streamRef.current
      ?.getTracks()
      .forEach(track => track.stop());

    streamRef.current =
      null;

  }

async function capturar() {

  if (
    !ready ||
    saving
  )
    return;

  const video =
    videoRef.current;

  const canvas =
    canvasRef.current;

  if (
    !video ||
    !canvas
  )
    return;

  setSaving(true);

  try {

    //----------------------------------------
    // Calidad seleccionada
    //----------------------------------------

    let maxWidth =
      video.videoWidth;

    let jpegQuality = 1;

    switch (quality) {

      case "FAST":

        maxWidth = 1280;
        jpegQuality = 0.80;

        break;

      case "NORMAL":

        maxWidth = 1920;
        jpegQuality = 0.90;

        break;

      case "HIGH":

        maxWidth =
          video.videoWidth;

        jpegQuality = 1;

        break;

    }

    //----------------------------------------
    // Calcular tamaño manteniendo proporción
    //----------------------------------------

    const scale =
      Math.min(
        1,
        maxWidth /
          video.videoWidth
      );

    canvas.width =
      Math.round(
        video.videoWidth *
          scale
      );

    canvas.height =
      Math.round(
        video.videoHeight *
          scale
      );

    const ctx =
      canvas.getContext("2d");

    if (!ctx)
      return;

    ctx.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    //----------------------------------------
    // Crear JPEG
    //----------------------------------------

    const blob =
      await new Promise<Blob | null>((resolve) =>

        canvas.toBlob(
          resolve,
          "image/jpeg",
          jpegQuality
        )

      );

    if (!blob)
      return;

    console.log(
      "Modo:",
      quality,
      "Resolución:",
      canvas.width + "x" + canvas.height,
      "Tamaño:",
      Math.round(blob.size / 1024) + " KB"
    );

    const file =
      new File(
        [blob],
        `${Date.now()}.jpg`,
        {
          type: "image/jpeg",
        }
      );

    //----------------------------------------
    // Subida en segundo plano
    //----------------------------------------

    onCapture(file);

    //----------------------------------------
    // Cámara disponible inmediatamente
    //----------------------------------------

    setSaving(false);

  }

  catch (error) {

    console.error(error);

    alert(
      "Error al capturar la fotografía."
    );

    setSaving(false);

  }

}

 return (

  <div className="space-y-6">

    <div className="rounded-2xl overflow-hidden border border-white/10">

      <video

        ref={videoRef}

        autoPlay

        playsInline

        muted

        className="
          w-full
          aspect-video
          rounded-2xl
          bg-black
          object-cover
        "

      />

    </div>

    <canvas
      ref={canvasRef}
      className="hidden"
    />

    <div>

      <div className="text-sm font-semibold text-slate-300 mb-3">
        Calidad
      </div>

      <div className="grid grid-cols-3 gap-3">

        <button
          type="button"
          onClick={() => setQuality("FAST")}
          className={`
            rounded-xl
            py-3
            font-semibold
            transition
            ${
              quality === "FAST"
                ? "btn-primary"
                : "btn-secondary"
            }
          `}
        >
          Rápida
        </button>

        <button
          type="button"
          onClick={() => setQuality("NORMAL")}
          className={`
            rounded-xl
            py-3
            font-semibold
            transition
            ${
              quality === "NORMAL"
                ? "btn-primary"
                : "btn-secondary"
            }
          `}
        >
          Normal
        </button>

        <button
          type="button"
          onClick={() => setQuality("HIGH")}
          className={`
            rounded-xl
            py-3
            font-semibold
            transition
            ${
              quality === "HIGH"
                ? "btn-primary"
                : "btn-secondary"
            }
          `}
        >
          Alta
        </button>

      </div>

    </div>

    <div className="space-y-3">

    <button
      type="button"
      disabled={!ready || saving}
      onClick={capturar}
      className="
        w-full
        btn-primary
        py-4
        rounded-2xl
        text-lg
        font-semibold
        disabled:opacity-50
      "
    >

      {saving
        ? "Guardando fotografía..."
        : "Capturar fotografía"}

  </button>

    </div>

  </div>

);
}