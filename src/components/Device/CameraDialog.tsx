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

    inputRef.current?.click();

  }, []);

  return (

    <input

      ref={inputRef}

      type="file"

      accept="image/*"

      capture="environment"

      style={{ display: "none" }}

      onChange={async (e) => {

        const file =
          e.target.files?.[0];

        if (file) {

          await onCapture(file);

        }

        onClose();

      }}

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

    <MobileCameraInput
      onCapture={onCapture}
      onClose={onClose}
    />,

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