type Props = {
  finalizado: boolean;

  assetVerificado: boolean;

  onVerify: () => void;

  onFinish: () => void;

  onReopen: () => void;

  onAddBefore?: () => void;

  onAddAfter?: () => void;
};

export default function DeviceActions({
  finalizado,
  assetVerificado,
  onVerify,
  onFinish,
  onReopen,
  onAddBefore,
  onAddAfter,
}: Props) {

  return (

    <div className="space-y-3">

      <button
        onClick={onVerify}
        disabled={assetVerificado}
        className={`w-full rounded-2xl py-4 font-semibold transition btn-spotify text-white ${assetVerificado ? "cursor-default opacity-90" : ""}`}
      >
        {assetVerificado ? "Asset verificado" : "Verificar Asset"}
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onAddBefore}
          className="w-full rounded-2xl btn-secondary px-4 py-3 font-semibold text-white"
        >
          Antes
        </button>

        <button
          type="button"
          onClick={onAddAfter}
          className="w-full rounded-2xl btn-secondary px-4 py-3 font-semibold text-white"
        >
          Después
        </button>
      </div>

      {finalizado ? (

        <button
          onClick={onReopen}
          className="w-full rounded-2xl bg-amber-500/90 text-white py-4 font-semibold active:scale-[0.99] transition"
        >
          Reabrir dispositivo
        </button>

      ) : (

        <button
          onClick={onFinish}
          className="w-full rounded-2xl bg-emerald-500/90 text-white py-4 font-semibold active:scale-[0.99] transition"
        >
          Finalizar dispositivo
        </button>

      )}

    </div>

  );

}