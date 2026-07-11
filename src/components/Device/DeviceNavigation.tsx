type Props = {
  onPrevious: () => void;
  onNext: () => void;
};

export default function DeviceNavigation({
  onPrevious,
  onNext,
}: Props) {

  return (

    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">

      <div className="grid grid-cols-2 gap-3">

        <button
          onClick={onPrevious}
          className="rounded-2xl border border-slate-300 bg-white py-4 font-semibold active:scale-[0.99] transition"
        >
          Anterior
        </button>

        <button
          onClick={onNext}
          className="rounded-2xl bg-slate-900 text-white py-4 font-semibold active:scale-[0.99] transition"
        >
          Siguiente
        </button>

      </div>

    </div>

  );

}