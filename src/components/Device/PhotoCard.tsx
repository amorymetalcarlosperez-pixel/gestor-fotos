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
    <div className="bg-white rounded-xl shadow overflow-hidden select-none">

      <img
        src={photo.url}
        alt={`Foto ${photo.orden}`}
        className="w-full aspect-square object-cover"
      />

      <div className="p-3">

        <div className="text-sm text-gray-600 truncate">
          {`Fotografía ${photo.orden}`}
        </div>

        <div className="flex justify-between items-center mt-3">

          <span className="text-xs text-gray-400">
            #{photo.orden}
          </span>

          {onDelete && (
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete?.(photo);
              }}
              className="text-red-600 hover:text-red-800 text-sm touch-manipulation relative z-20"
            >
              Eliminar
            </button>
          )}

        </div>

      </div>

    </div>
  );
}