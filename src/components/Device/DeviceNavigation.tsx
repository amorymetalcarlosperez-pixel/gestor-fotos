type Props = {
  onPrevious: () => void;
  onNext: () => void;
};

export default function DeviceNavigation({
  onPrevious,
  onNext,
}: Props) {

  return (

    <div className="sticky bottom-0 left-0 right-0 rounded-[24px] border border-white/10 bg-slate-950/75 p-4 backdrop-blur-xl">

      <div className="grid grid-cols-2 gap-3">

        <button
          onClick={onPrevious}
          className="rounded-2xl border border-white/10 bg-white/5 py-4 font-semibold text-slate-200 transition active:scale-[0.99]"
        >
          Anterior
        </button>

        <button
          onClick={onNext}
          className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 py-4 font-semibold text-white transition active:scale-[0.99]"
        >
          Siguiente
        </button>

      </div>

    </div>

  );

}