type Props = {
  completed: boolean;
};

export default function Status({
  completed,
}: Props) {
  return (
    <div
      className={
        completed
          ? "rounded-full bg-emerald-500/20 text-emerald-300 px-3 py-1 text-sm font-semibold border border-emerald-400/20"
          : "rounded-full bg-slate-700/70 text-slate-300 px-3 py-1 text-sm font-semibold border border-white/10"
      }
    >
      {completed ? "Completado" : "Pendiente"}
    </div>
  );
}