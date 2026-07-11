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
          ? "rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-sm font-semibold"
          : "rounded-full bg-slate-200 text-slate-600 px-3 py-1 text-sm font-semibold"
      }
    >
      {completed ? "Completado" : "Pendiente"}
    </div>
  );
}