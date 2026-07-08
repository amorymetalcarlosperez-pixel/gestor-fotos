import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  async function iniciarSesion(e: React.FormEvent) {
    e.preventDefault();

    setMensaje("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMensaje(error.message);
      return;
    }

    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={iniciarSesion}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-sm"
      >
        <h1 className="text-3xl font-bold text-center">
          Gestor de Proyectos
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Iniciar sesión
        </p>

        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Email
          </label>

          <input
            type="email"
            className="w-full border rounded-lg p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">
            Contraseña
          </label>

          <input
            type="password"
            className="w-full border rounded-lg p-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {mensaje && (
          <div className="mb-4 text-red-600 text-center">
            {mensaje}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}