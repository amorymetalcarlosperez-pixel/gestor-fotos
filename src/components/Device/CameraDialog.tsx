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
            w-full
            max-w-5xl
            rounded-3xl
            border
            border-white/10
            bg-slate-900
            p-8
            shadow-2xl
          "
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">

  <div>

    <h2 className="text-2xl font-bold text-white">
      Cámara
    </h2>

    <p className="text-slate-400 mt-1">
      Captura fotografías del dispositivo
    </p>

        </div>

        <button

          type="button"

          onClick={onClose}

          className="
            w-10
            h-10
            rounded-xl
            btn-secondary
            text-lg
            font-bold
            flex
            items-center
            justify-center
          "

        >

          ×

        </button>

      </div>
        <CameraCapture
          onCapture={onCapture}
          onClose={onClose}
        />

      </div>

    </div>,

    document.body

  );

}