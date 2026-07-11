type Props = {
  finalizado: boolean;

  assetVerificado: boolean;

  onVerify: () => void;

  onFinish: () => void;

  onReopen: () => void;
};

export default function DeviceActions({
  finalizado,
  assetVerificado,
  onVerify,
  onFinish,
  onReopen,
}: Props) {

  return (

    <div className="space-y-3">

      <button

        onClick={onVerify}

        disabled={assetVerificado}

        className={`
          w-full
          rounded-2xl
          py-4
          font-semibold
          transition

          ${
            assetVerificado

              ? "bg-green-600 text-white cursor-default"

              : "bg-slate-900 text-white hover:bg-black active:scale-[0.99]"
          }
        `}

      >

        {assetVerificado

          ? "✔ Asset verificado"

          : "🏷 Verificar Asset"}

      </button>

      {finalizado ? (

        <button

          onClick={onReopen}

          className="
            w-full
            rounded-2xl
            bg-amber-500
            text-white
            py-4
            font-semibold
            active:scale-[0.99]
            transition
          "

        >

          Reabrir dispositivo

        </button>

      ) : (

        <button

          onClick={onFinish}

          className="
            w-full
            rounded-2xl
            bg-green-600
            text-white
            py-4
            font-semibold
            active:scale-[0.99]
            transition
          "

        >

          ✅ Finalizar dispositivo

        </button>

      )}

    </div>

  );

}