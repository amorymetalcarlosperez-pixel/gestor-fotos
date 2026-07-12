import { createPortal } from "react-dom";
import CameraCapture from "./CameraCapture";
import { useEffect, useRef } from "react";

function MobileCameraInput({

  onCapture,
  onClose,

}: {

  onCapture: (file: File) => Promise<void>;
  onClose: () => void;

}) {

  const inputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {

    const input = inputRef.current;

    if (!input) {
      onClose();
      return;
    }

    const handleChange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        await onCapture(file);
      }

      onClose();
    };

    input.addEventListener("change", handleChange);
    input.click();

    return () => {
      input.removeEventListener("change", handleChange);
    };

  }, [onCapture, onClose]);

  return (

    <input

      ref={inputRef}

      type="file"

      accept="image/*"

      capture="environment"

      style={{ display: "none" }}

    />

  );

}
type Props = {
  open: boolean;
  onClose: () => void;
  onCapture: (file: File) => Promise<void>;
};

export default function CameraDialog({
  open,
  onClose,
  onCapture,
}: Props) {

  if (!open)
    return null;

  const esMovil =
    /Android|iPhone|iPad|iPod/i.test(
      navigator.userAgent
    );

  //----------------------------------------
  // MÓVIL → cámara nativa
  //----------------------------------------

  if (esMovil) {

    return createPortal(
      <div
        className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-2xl">
          <div className="mb-4 text-lg font-semibold">
            Añadir fotografía
          </div>
          <div className="mb-4 text-sm text-slate-600">
            Elige una foto desde la galería o usa la cámara del dispositivo.
          </div>
          <MobileCameraInput
            onCapture={onCapture}
            onClose={onClose}
          />
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white"
          >
            Cancelar
          </button>
        </div>
      </div>,
      document.body
    );

  }

  //----------------------------------------
  // PC → Webcam
  //----------------------------------------

  return createPortal(

    <div
      className="
        fixed
        inset-0
        z-[9999]
        bg-black/80
        flex
        items-center
        justify-center
      "
      onClick={onClose}
    >

      <div
        className="
          bg-white
          rounded-2xl
          p-4
          w-full
          max-w-4xl
          shadow-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >

        <CameraCapture
          onCapture={onCapture}
          onClose={onClose}
        />

      </div>

    </div>,

    document.body

  );

}