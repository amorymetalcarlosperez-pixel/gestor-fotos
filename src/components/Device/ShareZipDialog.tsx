type Props = {

  open: boolean;

  step: "ANTES" | "DESPUES";

  onShare: () => void;

  onSkip: () => void;

};

export default function ShareZipDialog({

  open,

  step,

  onShare,

  onSkip,

}: Props) {

  if (!open)
    return null;

  return (

    <div
      className="
        fixed
        inset-0
        z-[9999]
        bg-black/70
        flex
        items-center
        justify-center
        p-4
      "
    >

      <div
        className="
          w-full
          max-w-md
          rounded-3xl
          bg-slate-900
          border
          border-white/10
          p-6
        "
      >

        <div className="text-2xl font-bold text-white">

          Dispositivo finalizado

        </div>

       <div className="mt-3 text-slate-400">

          {step === "ANTES"

            ? "¿Deseas enviar ahora las fotografías del ANTES por WhatsApp?"

            : "¿Deseas enviar ahora las fotografías del DESPUÉS por WhatsApp?"}

        </div>

        <div className="mt-8 space-y-3">

          <button

            onClick={onShare}

            className="
              w-full
              btn-spotify
              rounded-2xl
              py-4
              font-semibold
            "

          >

            {step === "ANTES"

              ? "Enviar fotografías ANTES"

              : "Enviar fotografías DESPUÉS"}

          </button>

          <button

            onClick={onSkip}

            className="
              w-full
              btn-secondary
              rounded-2xl
              py-4
              font-semibold
            "

          >

            Continuar sin enviar

          </button>

        </div>

      </div>

    </div>

  );

}