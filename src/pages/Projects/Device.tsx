import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PhotoGallery from "../../components/Device/PhotoGallery";
import ScannerDialog from "../../components/Device/ScannerDialog";
import Page from "../../components/ui/Page";
import DeviceHeader from "../../components/Device/DeviceHeader";
import DeviceResume from "../../components/Device/DeviceResume";
import DeviceActions from "../../components/Device/DeviceActions";
import DeviceNavigation from "../../components/Device/DeviceNavigation";
import MoveDeviceDialog from "../../components/Device/MoveDeviceDialog";
import Card from "../../components/ui/Card";
import {
  getProjectDevice,
  getNextDevice,
  getPreviousDevice,
  getDevicesByLocation,
  updateAssetTagActual,
  moveDevice,
  type ProjectDevice,
} from "../../services/projectDevices";
import { updateComments } from "../../services/projectDevices";
import {
  ensureDeviceStatus,
  finishDevice,
  getDeviceStatus,
  refreshDeviceStatus,
  reopenDevice,
  setAssetVerified,
  type DeviceStatus,
} from "../../services/deviceStatus";

export default function Device() {

  const {
    projectId,
    category,
    deviceId,
  } = useParams();

  const navigate = useNavigate();

  const [device, setDevice] =
    useState<ProjectDevice | null>(null);
  const [puestoDevices, setPuestoDevices] =
  useState<ProjectDevice[]>([]);
const photoDevice =
  device?.device_group === "AUTOSERVICIO"
    ? puestoDevices[0] ?? device
    : device;
  const [status, setStatus] =
    useState<DeviceStatus | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [scannerOpen, setScannerOpen] =
    useState(false);
    const [moveOpen, setMoveOpen] =
  useState(false);
  const [comments, setComments] =
    useState("");
  const [activePhotoSection, setActivePhotoSection] =
    useState<"ANTES" | "DESPUES" | null>(null);

  useEffect(() => {

    if (deviceId && projectId) {

      cargar();

    }

  }, [deviceId, projectId]);
  useEffect(() => {

  if (!device)
    return;

  const timer = setTimeout(() => {

    updateComments(
      device.id,
      comments
    );

  }, 1000);

  return () => clearTimeout(timer);

}, [comments, device]);

  async function cargar() {

    setLoading(true);

    const { data, error } =
      await getProjectDevice(deviceId!);

    if (error || !data) {

      console.error(error);

      setLoading(false);

      return;

    }

    setDevice(data);
    const lista =
  await getDevicesByLocation(
    projectId!,
    data.ubicacion_zip
  );

if (!lista.error) {

  setPuestoDevices(
    (lista.data ?? []) as ProjectDevice[]
  );

}
    setComments(data.comments ?? "");

    await ensureDeviceStatus(
      projectId!,
      data.id
    );

    await refreshDeviceStatus(
      data.id
    );

    const estado =
      await getDeviceStatus(
        data.id
      );

    setStatus(
      estado.data ?? null
    );

    setLoading(false);

  }

  async function escaneado(
  codigo: string
) {

  if (!device)
    return;

  // Coincide con el inventario
  if (codigo === device.asset_tag) {

    await setAssetVerified(device.id);

    await cargar();

    alert("✔ Asset verificado correctamente.");

    return;

  }

  // No coincide
  const actualizar = confirm(

    `La etiqueta no coincide.

Esperada:
${device.asset_tag}

Escaneada:
${codigo}

¿Deseas actualizar el inventario?`

  );

  if (!actualizar)
    return;

  await updateAssetTagActual(
    device.id,
    codigo
  );

  await setAssetVerified(
    device.id
  );

  await cargar();

  alert("Inventario actualizado.");

}

 async function finalizar() {

  if (!device)
    return;

  //----------------------------------
  // Si es un puesto o un autoservicio,
  // finalizar todos los dispositivos
  //----------------------------------

  if (
    device.device_group === "PUESTOS" ||
    device.device_group === "AUTOSERVICIO"
  ) {

    for (const d of puestoDevices) {

      await finishDevice(d.id);

    }

  } else {

    await finishDevice(device.id);

  }

  //----------------------------------
  // SOLO LOS PUESTOS continúan
  // con el siguiente dispositivo
  //----------------------------------

  if (device.device_group === "PUESTOS") {

    const siguiente =
      await getNextDevice(
        projectId!,
        device.ubicacion_zip,
        device.id
      );

    if (siguiente) {

      navigate(
        `/projects/${projectId}/${category}/${encodeURIComponent(
          device.ubicacion_zip
        )}/${siguiente.id}`
      );

      return;

    }

  }

  //----------------------------------
  // Resto de dispositivos
  //----------------------------------

  navigate(`/projects/${projectId}`);

}

  async function reabrir() {

    if (!device)
      return;

    await reopenDevice(
      device.id
    );

    await cargar();

  }

  async function anterior() {

    if (!device)
      return;

    const previo =
      await getPreviousDevice(
        projectId!,
        device.ubicacion_zip,
        device.id
      );

    if (!previo)
      return;

    navigate(

      `/projects/${projectId}/${category}/${encodeURIComponent(
        device.ubicacion_zip
      )}/${previo.id}`

    );

  }

  async function siguiente() {

    if (!device)
      return;

    const next =
      await getNextDevice(
        projectId!,
        device.ubicacion_zip,
        device.id
      );

    if (!next)
      return;

    navigate(

      `/projects/${projectId}/${category}/${encodeURIComponent(
        device.ubicacion_zip
      )}/${next.id}`

    );

  }
  async function moverDispositivo(destino: {
  folder_name: string;
  nombre_zip: string;
  ubicacion_zip: string;
}) {

  if (!device)
    return;

  await moveDevice(

    device.id,

    destino.folder_name,

    destino.nombre_zip,

    destino.ubicacion_zip

  );

  setMoveOpen(false);

  navigate(

    `/projects/${projectId}/${category}/${encodeURIComponent(
      destino.ubicacion_zip
    )}`

  );

}

  function abrirFotos(carpeta: "ANTES" | "DESPUES") {
    setActivePhotoSection(carpeta);
  }

  if (loading) {

    return (

      <div className="max-w-6xl mx-auto p-8">

        Cargando...

      </div>

    );

  }

  if (!device) {

    return (

      <div className="max-w-6xl mx-auto p-8">

        Dispositivo no encontrado.

      </div>

    );

  }
async function actualizarEstado() {

  if (!device)
    return;

  await refreshDeviceStatus(device.id);

  const estado =
    await getDeviceStatus(device.id);

  setStatus(
    estado.data ?? null
  );

}
  return (

 <Page

  title={
    device.device_group === "AUTOSERVICIO"
      ? device.ubicacion_zip
      : device.nombre_zip
  }

  subtitle={
    device.device_group === "AUTOSERVICIO"
      ? `${puestoDevices.length} dispositivos`
      : device.display_name
  }

>
    
    <DeviceHeader

  nombre={
    device.device_group === "AUTOSERVICIO"
      ? device.ubicacion_zip
      : device.nombre_zip
  }

  descripcion={
    device.device_group === "AUTOSERVICIO"
      ? `${puestoDevices.length} dispositivos`
      : device.display_name
  }

  asset={device.asset_tag_actual}

  finalizado={status?.finalizado ?? false}

/>

    <div className="mt-6">

      <DeviceResume

        fotosAntes={status?.fotos_antes ?? 0}

        fotosDespues={status?.fotos_despues ?? 0}

        modificado={status?.modificado ?? false}

        finalizado={status?.finalizado ?? false}

      />

    </div>
{device.device_group === "AUTOSERVICIO" && (

  <Card className="mt-6">

    <div className="text-lg font-semibold mb-4 text-white">

      Dispositivos del autoservicio

    </div>

    <div className="space-y-3">

      {puestoDevices.map(d => (

        <div
          key={d.id}
          className="flex justify-between border-b pb-3"
        >

          <div>

            <div className="font-semibold text-white">

              {d.device_type}

            </div>

            <div className="text-sm text-slate-400">

              {d.display_name}

            </div>

          </div>

          <div className="text-right text-sm">

            <div>

              Asset: {d.asset_tag_actual}

            </div>

            <div>

              S/N: {d.serial_number}

            </div>

          </div>

        </div>

      ))}

    </div>

  </Card>

)}
    <div className="mt-6">

      

        <DeviceActions
          finalizado={status?.finalizado ?? false}
          assetVerificado={status?.asset_verificado ?? false}
          onVerify={() => setScannerOpen(true)}
          onFinish={finalizar}
          onReopen={reabrir}
          
          onAddBefore={() => abrirFotos("ANTES")}
          onAddAfter={() => abrirFotos("DESPUES")}
        />
        <div className="mt-4">

  <button

    onClick={() => setMoveOpen(true)}

    className="
      w-full
      rounded-2xl
      btn-secondary
      py-4
      font-semibold
    "

  >

    Mover dispositivo

  </button>

</div>
    </div>


    <div className="mt-8">
      <PhotoGallery
        projectId={projectId!}
        deviceId={photoDevice!.id}
        carpeta="ANTES"
        onChanged={actualizarEstado}
        forceOpen={activePhotoSection === "ANTES"}
        onOpenHandled={() => setActivePhotoSection(null)}
      />
    </div>

    <PhotoGallery
      projectId={projectId!}
      deviceId={photoDevice!.id}
      carpeta="DESPUES"
      onChanged={actualizarEstado}
      forceOpen={activePhotoSection === "DESPUES"}
      onOpenHandled={() => setActivePhotoSection(null)}
    />

    <ScannerDialog

      open={scannerOpen}

      onClose={() => setScannerOpen(false)}

      onDetected={async (codigo) => {

        try {

          await escaneado(codigo);

          setScannerOpen(false);

        }

        catch (error) {

          console.error(error);

          alert(

            "No se ha podido actualizar la etiqueta."

          );

        }

      }}

    />
    <MoveDeviceDialog

  open={moveOpen}

  projectId={projectId!}

  deviceGroup={device.device_group}

  currentFolder={device.folder_name}

  onClose={() => setMoveOpen(false)}

  onMove={moverDispositivo}

/>
<Card className="mt-8">

  <div className="font-semibold mb-3 text-white">

    Observaciones

  </div>

  <textarea

    rows={5}

    value={comments}

    onChange={(e) =>
      setComments(e.target.value)
    }

    className="
      w-full
      rounded-2xl
      border
      border-white/10
      bg-slate-950/60
      text-white
      p-4
      resize-none
      placeholder:text-slate-500
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
    "

    placeholder="Escribe cualquier incidencia..."

  />

</Card>
    {device.device_group !== "AUTOSERVICIO" && (

  <div className="mt-8">

    <DeviceNavigation

      onPrevious={anterior}

      onNext={siguiente}

    />

  </div>

)}

  </Page>

);

}