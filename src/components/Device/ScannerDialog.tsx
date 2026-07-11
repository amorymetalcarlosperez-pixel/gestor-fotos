import BarcodeScanner from "../Scanner/BarcodeScanner";

type Props = {
  open: boolean;
  onClose: () => void;
  onDetected: (code: string) => void;
};

export default function ScannerDialog({
  open,
  onClose,
  onDetected,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">

      <div className="bg-white rounded-xl w-full max-w-2xl p-4">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-bold">
            Escanear código
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>

        </div>

        <BarcodeScanner
          onDetected={(code) => {
            onDetected(code);
            onClose();
          }}
          onClose={onClose}
        />

      </div>

    </div>
  );
}