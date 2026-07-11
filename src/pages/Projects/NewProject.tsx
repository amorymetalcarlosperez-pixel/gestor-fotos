import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        Nuevo Proyecto
      </h1>

      <div className="space-y-4">

        <input
          className="border rounded w-full p-3"
          placeholder="Nombre del proyecto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <textarea
          className="border rounded w-full p-3"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => {
            if (e.target.files?.length) {
              setExcel(e.target.files[0]);
            }
          }}
        />

        <button
          disabled={guardando}
          onClick={guardarProyecto}
          className="bg-blue-600 text-white rounded px-6 py-3"
        >
          {guardando ? "Guardando..." : "Crear Proyecto"}
        </button>

      </div>
    </div>
  );
}