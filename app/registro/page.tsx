"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";

export default function RegistroPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    const respuesta = await fetch("/api/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, cedula, correo, contraseña }),
    });

    const datos = await respuesta.json();
    setCargando(false);

    if (!respuesta.ok) {
      setError(datos.error || "Ocurrió un error.");
      return;
    }

    router.push("/login");
  };

  return (
    <AuthLayout
      title="Crea tu cuenta"
      intro="Completa tus datos y empieza a construir tu próxima habilidad."
      footer={
        <p>
          ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-bold mb-1.5">
            Nombre completo
          </label>
          <input
            type="text"
            required
            autoComplete="name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre completo"
          />
        </div>

        <div className="form-grid">
          <div>
            <label className="block text-sm font-bold mb-1.5">
              Cédula
            </label>
            <input
              type="text"
              required
              inputMode="numeric"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="Número de cédula"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
        </div>

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
          {cargando ? "Creando cuenta..." : "Crear mi cuenta"}
        </button>
      </form>
    </AuthLayout>
  );
}
