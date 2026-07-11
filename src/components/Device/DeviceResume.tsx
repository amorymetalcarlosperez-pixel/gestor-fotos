type Props = {
  fotosAntes: number;
  fotosDespues: number;
  modificado: boolean;
  finalizado: boolean;
};

export default function DeviceResume({
  fotosAntes,
  fotosDespues,
  modificado,
  finalizado,
}: Props) {

  return (

    <div className="grid grid-cols-2 gap-4">

      <div className="rounded-3xl bg-white p-5 shadow-sm">

        <div className="text-sm text-slate-500">
          Antes
        </div>

        <div className="mt-2 text-4xl font-bold">
          {fotosAntes}
        </div>

        <div className="text-sm text-slate-400">
          fotografías
        </div>

      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm">

        <div className="text-sm text-slate-500">
          Después
        </div>

        <div className="mt-2 text-4xl font-bold">
          {fotosDespues}
        </div>

        <div className="text-sm text-slate-400">
          fotografías
        </div>

      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm">

        <div className="text-sm text-slate-500">
          Modificado
        </div>

        <div className="mt-2 text-xl font-semibold">

          {modificado
            ? "Sí"
            : "No"}

        </div>

      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm">

        <div className="text-sm text-slate-500">
          Estado
        </div>

        <div
          className={`mt-2 text-xl font-semibold ${
            finalizado
              ? "text-green-600"
              : "text-orange-500"
          }`}
        >

          {finalizado
            ? "Finalizado"
            : "Pendiente"}

        </div>

      </div>

    </div>

  );

}