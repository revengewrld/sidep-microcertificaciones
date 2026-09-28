"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    const resultado = await signIn("credentials", {
      correo,
      contraseña,
      redirect: false,
    });

    setCargando(false);

    if (resultado?.error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      intro="Ingresa tus datos para continuar tu ruta de aprendizaje."
      footer={
        <p>
          ¿No tienes cuenta? <Link href="/registro">Regístrate aquí</Link>
        </p>
      }
    >
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

        <div>
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <label className="block text-sm font-bold">Contraseña</label>
            <Link
              href="/olvide-contrasena"
              className="text-xs font-bold text-sidep-azul hover:underline"
            >
              ¿La olvidaste?
            </Link>
          </div>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="auth-submit"
        >
          {cargando ? "Ingresando..." : "Ingresar a mi aula"}
        </button>
      </form>
    </AuthLayout>
  );
}
