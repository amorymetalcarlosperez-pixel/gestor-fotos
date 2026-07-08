import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 p-4">

      <header className="mb-6">
        <h1 className="text-3xl font-bold">
          Gestor de Proyectos
        </h1>

        <p className="text-gray-600">
          Bienvenido
        </p>
      </header>

      <div className="space-y-4">

        <button
          onClick={() => navigate("/projects/new")}
          className="w-full rounded-xl bg-blue-600 text-white py-4 text-lg font-semibold"
        >
          ➕ Nuevo proyecto
        </button>

        <div className="rounded-xl bg-white shadow p-6">
          <h2 className="text-xl font-semibold">
            Proyectos
          </h2>

          <p className="text-gray-500 mt-2">
            Todavía no hay proyectos.
          </p>
        </div>

      </div>

    </div>
  );
}