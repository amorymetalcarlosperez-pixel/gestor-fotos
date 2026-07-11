import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../../services/projects";
import { supabase } from "../../services/supabase";

type Project = {
  id: string;
  nombre: string;
  descripcion: string;
  estado: string;
  created_at: string;
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function cargarProyectos() {
    setLoading(true);

    const { data, error } = await getProjects();

    if (error) {
      console.error(error);
    } else {
      setProjects((data as Project[]) || []);
    }

    setLoading(false);
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
    navigate("/");
  }

  useEffect(() => {
    cargarProyectos();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">

      <header className="bg-white shadow">

        <div className="max-w-6xl mx-auto flex justify-between items-center p-6">

          <h1 className="text-3xl font-bold">
            Gestor de Proyectos
          </h1>

          <div className="flex gap-3">

            <button
              onClick={() => navigate("/projects/new")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              Nuevo proyecto
            </button>

            <button
              onClick={cerrarSesion}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
            >
              Cerrar sesión
            </button>

          </div>

        </div>

      </header>

      <main className="max-w-6xl mx-auto p-6">

        {loading ? (
          <p>Cargando proyectos...</p>
        ) : projects.length === 0 ? (

          <div className="bg-white rounded-xl shadow p-8 text-center">

            <h2 className="text-2xl font-semibold">
              Todavía no hay proyectos
            </h2>

            <p className="text-gray-500 mt-2 mb-6">
              Pulsa en "Nuevo proyecto" para crear el primero.
            </p>

            <button
              onClick={() => navigate("/projects/new")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Crear proyecto
            </button>

          </div>

        ) : (

          <div className="grid gap-4">

            {projects.map((project) => (

              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="bg-white rounded-xl shadow p-5 hover:shadow-lg cursor-pointer transition"
              >

                <h2 className="text-xl font-bold">
                  {project.nombre}
                </h2>

                <p className="text-gray-600 mt-2">
                  {project.descripcion}
                </p>

                <div className="flex justify-between mt-5 text-sm text-gray-500">

                  <span>{project.estado}</span>

                  <span>
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}