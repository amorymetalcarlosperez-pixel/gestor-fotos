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
      <div className="card-surface rounded-[24px] p-5">
        <div className="text-sm text-slate-400">Antes</div>
        <div className="mt-2 text-4xl font-bold text-white">{fotosAntes}</div>
        <div className="text-sm text-slate-500">fotografías</div>
      </div>

      <div className="card-surface rounded-[24px] p-5">
        <div className="text-sm text-slate-400">Después</div>
        <div className="mt-2 text-4xl font-bold text-white">{fotosDespues}</div>
        <div className="text-sm text-slate-500">fotografías</div>
      </div>

      <div className="card-surface rounded-[24px] p-5">
        <div className="text-sm text-slate-400">Modificado</div>
        <div className="mt-2 text-xl font-semibold text-white">
          {modificado ? "Sí" : "No"}
        </div>
      </div>

      <div className="card-surface rounded-[24px] p-5">
        <div className="text-sm text-slate-400">Estado</div>
        <div className={`mt-2 text-xl font-semibold ${finalizado ? "text-emerald-400" : "text-amber-400"}`}>
          {finalizado ? "Finalizado" : "Pendiente"}
        </div>
      </div>
    </div>
  );

}