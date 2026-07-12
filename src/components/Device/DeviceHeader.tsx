import Status from "../ui/Status";

type Props = {

  nombre: string;

  descripcion: string;

  asset: string | null;

  finalizado: boolean;

};

export default function DeviceHeader({

  nombre,

  descripcion,

  asset,

  finalizado,

}: Props) {

  return (
    <div className="card-surface rounded-[24px] p-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {nombre}
          </h1>

          <div className="mt-2 text-slate-400">
            {descripcion}
          </div>

          <div className="mt-4 text-lg font-semibold text-slate-200">
            {asset}
          </div>
        </div>

        <Status completed={finalizado} />
      </div>
    </div>
  );

}