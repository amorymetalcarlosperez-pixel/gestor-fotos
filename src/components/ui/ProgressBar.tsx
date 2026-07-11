type Props = {
  value: number;
};

export default function ProgressBar({
  value,
}: Props) {

  const porcentaje =
    Math.max(
      0,
      Math.min(100, value)
    );

  return (

    <div className="w-full">

      <div className="h-3 rounded-full bg-slate-200 overflow-hidden">

        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{
            width: `${porcentaje}%`,
          }}
        />

      </div>

    </div>

  );

}