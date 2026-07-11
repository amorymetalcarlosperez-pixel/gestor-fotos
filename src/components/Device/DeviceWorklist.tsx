import { useNavigate, useParams } from "react-router-dom";
import type { ProjectDevice } from "../../services/projectDevices";
import Card from "../ui/Card";

type Props = {
  devices: ProjectDevice[];
  currentDeviceId: string;
};

export default function DeviceWorklist({
  devices,
  currentDeviceId,
}: Props) {

  const navigate = useNavigate();

  const {
    projectId,
    category,
  } = useParams();

  const completados =
    devices.filter(device => {

      const estado = Array.isArray(device.device_status)
        ? device.device_status[0]
        : device.device_status;

      return estado?.finalizado ?? false;

    }).length;

  const porcentaje =
    devices.length === 0
      ? 0
      : Math.round(
          (completados / devices.length) * 100
        );

  return (

    <Card>

      <div className="font-bold text-lg">

        Dispositivos del puesto

      </div>

      <div className="mt-4 mb-5">

        <div className="flex justify-between text-sm font-medium">

          <span>

            {completados} / {devices.length} completados

          </span>

          <span>

            {porcentaje}%

          </span>

        </div>

        <div className="mt-2 h-3 rounded-full bg-slate-200 overflow-hidden">

          <div

            className="h-full bg-green-500 transition-all duration-300"

            style={{
              width: `${porcentaje}%`,
            }}

          />

        </div>

      </div>

      <div className="space-y-2">

        {devices.map(device => {

          const estado = Array.isArray(device.device_status)
            ? device.device_status[0]
            : device.device_status;

          const finalizado =
            estado?.finalizado ?? false;

          return (

            <button

              key={device.id}

              onClick={() =>

                navigate(

                  `/projects/${projectId}/${category}/${encodeURIComponent(
                    device.ubicacion_zip
                  )}/${device.id}`

                )

              }

              className={`
                w-full
                rounded-2xl
                p-3
                text-left
                transition
                border

                ${
                  device.id === currentDeviceId

                    ? "border-blue-500 bg-blue-50"

                    : "border-slate-200 bg-white hover:bg-slate-50"
                }

              `}

            >

              <div className="flex items-center justify-between">

                <div>

                  <div className="font-semibold">

                    {device.nombre_zip}

                  </div>

                  <div className="text-sm text-slate-500">

                    {device.display_name}

                  </div>

                </div>

                <div className="text-2xl">

                  {finalizado ? "🟢" : "⚪"}

                </div>

              </div>

            </button>

          );

        })}

      </div>

    </Card>

  );

}