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
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <form
        onSubmit={iniciarSesion}
        className="glass-panel rounded-[28px] p-8 w-full max-w-sm shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-center text-white">
          Gestor de Proyectos
        </h1>

        <p className="text-center text-slate-400 mb-6">
          Iniciar sesión
        </p>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-slate-200">
            Email
          </label>

          <input
            type="email"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none placeholder:text-slate-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-slate-200">
            Contraseña
          </label>

          <input
            type="password"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none placeholder:text-slate-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {mensaje && (
          <div className="mb-4 text-rose-400 text-center">
            {mensaje}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl btn-spotify py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}