import { useEffect, useRef } from "react";
import {
  BrowserMultiFormatReader,
} from "@zxing/browser";
import {
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";
import type { IScannerControls } from "@zxing/browser";

type Props = {
  onDetected: (code: string) => void;
  onClose: () => void;
};

export default function BarcodeScanner({
  onDetected,
  onClose,
}: Props) {
  const videoRef =
    useRef<HTMLVideoElement>(null);

  useEffect(() => {

    const hints = new Map();

    hints.set(
      DecodeHintType.POSSIBLE_FORMATS,
      [
        BarcodeFormat.CODE_128,
        BarcodeFormat.CODE_39,
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.QR_CODE,
      ]
    );

    const reader =
      new BrowserMultiFormatReader(hints);

    let controls:
      IScannerControls | null = null;

    let detected = false;

    async function start() {

      if (!videoRef.current)
        return;

      try {

        controls =
          await reader.decodeFromConstraints(

            {
              video: {
                facingMode: {
                  ideal: "environment",
                },
                width: {
                  ideal: 1920,
                },
                height: {
                  ideal: 1080,
                },
              },
            },

            videoRef.current,

            (result) => {

              if (!result)
                return;

              if (detected)
                return;

              detected = true;

              controls?.stop();

              if ("vibrate" in navigator) {
                navigator.vibrate(150);
              }

              onDetected(
                result.getText()
              );

            }

          );

      }
     catch (e: any) {
  // Ignorar los "NotFoundException", son normales
      if (e?.name !== "NotFoundException") {
        console.error(e);
      }
      } 

    }

    start();

    return () => {

      detected = true;

      controls?.stop();

     

    };

  }, []);

  return (

    <div className="fixed inset-0 bg-black z-50">

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      <button
        onClick={onClose}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-8 py-3 rounded-xl"
      >
        Cancelar
      </button>

    </div>

  );

}