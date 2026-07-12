import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Page from "../../components/ui/Page";
import { createProject } from "../../services/projects";

export default function NewProject() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [excel, setExcel] = useState<File | null>(null);

  const [guardando, setGuardando] = useState(false);

  async function guardarProyecto() {
    if (!excel) {
      alert("Debes seleccionar un inventario Excel.");
      return;
    }

    try {
      setGuardando(true);

      await createProject({
        nombre,
        descripcion,
        inventarioExcel: excel,
      });

      alert("Proyecto creado correctamente");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error creando el proyecto");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Page title="Nuevo proyecto" subtitle="Importa un inventario y empieza a trabajar">
      <Card className="mt-2">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">
              Nombre del proyecto
            </span>
            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del proyecto"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">
              Descripción
            </span>
            <textarea
              className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe el proyecto"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">
              Inventario Excel
            </span>
            <input
              type="file"
              accept=".xlsx,.xls"
              className="block w-full cursor-pointer rounded-2xl border border-dashed border-white/15 bg-slate-950/50 px-4 py-4 text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-600/80 file:px-4 file:py-2 file:text-white"
              onChange={(e) => {
                if (e.target.files?.length) {
                  setExcel(e.target.files[0]);
                }
              }}
            />
          </label>

          <button
            disabled={guardando}
            onClick={guardarProyecto}
            className="w-full rounded-2xl btn-spotify px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {guardando ? "Guardando..." : "Crear Proyecto"}
          </button>
        </div>
      </Card>
    </Page>
  );
}