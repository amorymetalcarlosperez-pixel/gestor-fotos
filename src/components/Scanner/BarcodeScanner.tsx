import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

type Props = {
  onDetected: (code: string) => void;
  onClose: () => void;
};

export default function BarcodeScanner({
  onDetected,
  onClose,
}: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let detected = false;
    const scanner = new Html5Qrcode("barcode-reader-region");
    scannerRef.current = scanner;

    async function startScanner() {
      const config = {
        fps: 10,
        qrbox: { width: 260, height: 260 },
      };

      try {
        await scanner.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            if (detected || cancelled) return;
            detected = true;
            if ("vibrate" in navigator) navigator.vibrate(150);
            onDetected(decodedText);
          },
          () => {
            // Ignorar errores de decodificación individuales.
          }
        );
      } catch (firstError) {
        try {
          await scanner.start(
            { facingMode: "user" },
            config,
            (decodedText) => {
              if (detected || cancelled) return;
              detected = true;
              if ("vibrate" in navigator) navigator.vibrate(150);
              onDetected(decodedText);
            },
            () => {
              // Ignorar errores de decodificación individuales.
            }
          );
        } catch (secondError) {
          console.error(secondError);
          if (!cancelled) {
            setError("No se ha podido acceder a la cámara. Permite el acceso y vuelve a intentarlo.");
          }
        }
      }
    }

    void startScanner();

    return () => {
      cancelled = true;
      scannerRef.current?.stop().catch(() => undefined);
    };
  }, [onDetected]);

  return (
    <div className="relative h-[70vh] min-h-[420px] overflow-hidden rounded-2xl bg-black">
      <div id="barcode-reader-region" className="h-full w-full" />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 px-6 text-center text-sm text-white">
          {error}
        </div>
      )}

      <div className="absolute inset-x-0 top-4 flex justify-center px-4">
        <div className="rounded-full bg-black/60 px-4 py-2 text-sm text-white">
          Apunta al código de barras
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-red-600 px-8 py-3 text-white"
      >
        Cancelar
      </button>
    </div>
  );
}
