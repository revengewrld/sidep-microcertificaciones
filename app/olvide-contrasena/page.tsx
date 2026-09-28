"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";

export default function OlvideContrasenaPage() {
  const [correo, setCorreo] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const res = await fetch("/api/auth/solicitar-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ocurrió un error");
      }

      setEnviado(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    } finally {
      setCargando(false);
    }
  }

  return (
    <AuthLayout
      title={enviado ? "Revisa tu correo" : "Recupera tu acceso"}
      intro={
        enviado
          ? "Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña."
          : "Escribe el correo asociado a tu cuenta y te enviaremos las instrucciones."
      }
      footer={
        <p>
          <Link href="/login">← Volver a iniciar sesión</Link>
        </p>
      }
    >
      {enviado ? (
        <div className="rounded-2xl border border-green-700/20 bg-green-50 p-5 text-sm text-green-800">
          Revisa tu bandeja de entrada y la carpeta de correo no deseado. El
          enlace te permitirá crear una nueva contraseña.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold mb-1.5">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="auth-submit"
          >
            {cargando ? "Enviando..." : "Enviar enlace de recuperación"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
