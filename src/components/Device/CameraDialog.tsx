import { createPortal } from "react-dom";
import CameraCapture from "./CameraCapture";

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

      <input
        autoFocus
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