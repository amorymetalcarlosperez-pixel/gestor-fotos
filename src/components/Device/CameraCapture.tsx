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

      canvas.width =
        video.videoWidth;

      canvas.height =
        video.videoHeight;

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

      const blob =
        await new Promise<Blob | null>((resolve) =>

          canvas.toBlob(
            resolve,
            "image/jpeg",
            0.9
          )

        );

      if (!blob)
        return;

      const file =
        new File(
          [blob],
          `${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          }
        );

      await onCapture(file);

      detener();

      onClose();

    }

    catch (error) {

      console.error(error);

      alert(
        "Error al guardar la fotografía."
      );

    }

    finally {

      setSaving(false);

    }

  }

  return (

    <div className="space-y-4">

      <video

        ref={videoRef}

        autoPlay

        playsInline

        muted

        className="w-full rounded-xl bg-black"

      />

      <canvas

        ref={canvasRef}

        className="hidden"

      />

      <div className="flex justify-between">

        <button

          type="button"

          onClick={() => {

            detener();

            onClose();

          }}

          className="
            px-6
            py-3
            rounded-xl
            bg-gray-500
            text-white
          "

        >

          Cancelar

        </button>

        <button

          type="button"

          disabled={
            !ready ||
            saving
          }

          onClick={           
            capturar}

          className="
            px-8
            py-3
            rounded-xl
            bg-blue-600
            text-white
            disabled:opacity-50
          "

        >

          {saving
            ? "Guardando..."
            : "📷 Capturar"}

        </button>

      </div>

    </div>

  );

}