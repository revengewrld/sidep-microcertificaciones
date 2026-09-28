"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";

export default function RestablecerPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (nuevaContrasena !== confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (nuevaContrasena.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setCargando(true);

    try {
      const res = await fetch("/api/auth/restablecer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nuevaContrasena }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ocurrió un error");
      }

      setExito(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    } finally {
      setCargando(false);
    }
  }

  return (
    <AuthLayout
      title={exito ? "Contraseña actualizada" : "Crea una nueva contraseña"}
      intro={
        exito
          ? "Tu acceso fue actualizado correctamente. Te estamos redirigiendo."
          : "Usa al menos 8 caracteres y confirma la nueva contraseña."
      }
      footer={
        <p>
          <Link href="/login">Volver a iniciar sesión</Link>
        </p>
      }
    >
      {exito ? (
        <div className="rounded-2xl border border-green-700/20 bg-green-50 p-5 text-sm text-green-800">
          Ya puedes ingresar al aula con tu nueva contraseña.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold mb-1.5">
              Nueva contraseña
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1.5">
              Confirma tu nueva contraseña
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="auth-submit"
          >
            {cargando ? "Guardando..." : "Guardar nueva contraseña"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
