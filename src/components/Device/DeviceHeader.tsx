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

    <div className="bg-white rounded-3xl p-6 shadow-sm">

      <div className="flex justify-between items-start">

        <div>

          <h1 className="text-3xl font-bold">

            {nombre}

          </h1>

          <div className="text-slate-500 mt-2">

            {descripcion}

          </div>

          <div className="mt-4 text-lg font-semibold">

            {asset}

          </div>

        </div>

        <Status completed={finalizado} />

      </div>

    </div>

  );

}