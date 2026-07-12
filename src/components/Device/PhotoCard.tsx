import type { DevicePhoto } from "../../services/photos";

type Props = {
  photo: DevicePhoto & {
    url: string;
  };

  onDelete?: (photo: DevicePhoto) => void;
};

export default function PhotoCard({
  photo,
  onDelete,
}: Props) {

  return (

    <div className="card-surface overflow-hidden rounded-[24px] border border-white/10">

      <div className="relative">

        <img
          src={photo.url}
          alt={`Foto ${photo.orden}`}
          className="aspect-square w-full object-cover"
          draggable={false}
        />

        {onDelete && (

          <button
            type="button"
            onClick={(e) => {

              e.preventDefault();

              e.stopPropagation();

              onDelete(photo);

            }}
            className="
              absolute
              top-3
              right-3
              h-10
              w-10
              rounded-full
              bg-black/60
              backdrop-blur-md
              border
              border-white/10
              text-white
              text-lg
              transition
              hover:bg-red-600
              active:scale-95
            "
            title="Eliminar fotografía"
          >

            🗑️

          </button>

        )}

      </div>

      <div className="p-4">

        <div className="font-semibold text-white">

          Fotografía {photo.orden}

        </div>

        <div className="mt-1 text-sm text-slate-400">

          #{photo.orden}

        </div>

      </div>

    </div>

  );

}