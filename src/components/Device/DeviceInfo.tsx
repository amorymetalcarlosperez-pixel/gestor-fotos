import type { ReactNode } from "react";

export type DeviceInfoProps = {
  nombreZip: string;
  displayName: string;
  assetTag: string | null;
  assetTagActual: string | null;
  serialNumber: string;
  model: string;
  modelCategory: string;
  location: string;
  comments: string;
  children?: ReactNode;
};

export default function DeviceInfo({
  nombreZip,
  displayName,
  assetTag,
  assetTagActual,
  serialNumber,
  model,
  modelCategory,
  location,
  comments,
  children,
}: DeviceInfoProps) {
  return (
    <div className="card-surface rounded-[24px] border border-white/10 p-6">

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-2xl font-bold text-white">
            {nombreZip}
          </h2>

          <p className="mt-1 text-slate-400">
            {displayName}
          </p>

        </div>

        {children}

      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">

        <Campo
          titulo="Asset original"
          valor={assetTag}
        />

        <Campo
          titulo="Asset actual"
          valor={assetTagActual}
        />

        <Campo
          titulo="Número de serie"
          valor={serialNumber}
        />

        <Campo
          titulo="Modelo"
          valor={model}
        />

        <Campo
          titulo="Categoría"
          valor={modelCategory}
        />

        <Campo
          titulo="Ubicación"
          valor={location}
        />

      </div>

      {comments && (
        <div className="mt-6">

          <div className="font-semibold mb-2">
            Comentarios
          </div>

          <div className="bg-slate-100 rounded-lg p-3 whitespace-pre-wrap">
            {comments}
          </div>

        </div>
      )}

    </div>
  );
}

type CampoProps = {
  titulo: string;
  valor?: string | null;
};

function Campo({
  titulo,
  valor,
}: CampoProps) {
  return (
    <div>

<div className="text-sm text-slate-400">
            {titulo}
          </div>

          <div className="break-all font-medium text-slate-200">
        {valor || "-"}
      </div>

    </div>
  );
}