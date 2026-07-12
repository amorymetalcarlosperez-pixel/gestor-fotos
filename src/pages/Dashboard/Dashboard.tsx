import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../../services/projects";

type Project = {
  id: string;
  nombre: string;
  descripcion: string;
  estado: string;
  created_at: string;
};

export default function Dashboard() {

  const navigate = useNavigate();

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function cargarProyectos() {

    setLoading(true);

    const { data, error } =
      await getProjects();

    if (error) {

      console.error(error);

    } else {

      setProjects(
        (data as Project[]) ?? []
      );

    }

    setLoading(false);

  }

  useEffect(() => {

    cargarProyectos();

  }, []);

  return (

    <div className="min-h-screen">

      <div className="mx-auto max-w-md min-h-screen">

        <div className="sticky top-0 z-20 bg-slate-950/60 backdrop-blur-xl">

          <div className="px-5 pt-safe pt-6 pb-5">

            <h1 className="text-3xl font-bold text-white">

              Proyectos

            </h1>

            <p className="mt-1 text-slate-400">

              {projects.length} proyectos

            </p>

          </div>

        </div>

        <div className="px-4 pb-24 space-y-4">

          <button

            onClick={() => navigate("/projects/new")}

            className="
              btn-spotify
              w-full
              rounded-[24px]
              py-4
              text-lg
              font-semibold
              text-white
            "

          >

            + Nuevo proyecto

          </button>

          {loading ? (

            <div className="card-surface rounded-[24px] p-8 text-center">

              <div className="text-slate-300">

                Cargando proyectos...

              </div>

            </div>

          ) : projects.length === 0 ? (

            <div className="card-surface rounded-[24px] p-8 text-center">

              <h2 className="text-xl font-semibold text-white">

                Todavía no hay proyectos

              </h2>

              <p className="mt-3 text-slate-400">

                Pulsa en "Nuevo proyecto" para crear el primero.

              </p>

            </div>

          ) : (

            projects.map(project => (

              <div

                key={project.id}

                onClick={() =>
                  navigate(`/projects/${project.id}`)
                }

                className="
                  card-surface
                  rounded-[24px]
                  p-5
                  cursor-pointer
                  transition
                  hover:scale-[1.01]
                  active:scale-[0.99]
                "

              >

                <div className="flex items-start justify-between">

                  <div>

                    <h2 className="text-xl font-bold text-white">

                      {project.nombre}

                    </h2>

                    <p className="mt-2 text-slate-400">

                      {project.descripcion}

                    </p>

                  </div>

                  <span
                    className="
                      rounded-full
                      bg-blue-500/15
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-blue-300
                    "
                  >

                    {project.estado}

                  </span>

                </div>

                <div className="mt-5 border-t border-white/10 pt-4">

                  <div className="text-sm text-slate-500">

                    Creado el{" "}

                    {new Date(
                      project.created_at
                    ).toLocaleDateString()}

                  </div>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </div>

  );

}