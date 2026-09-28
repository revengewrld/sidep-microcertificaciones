"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function NuevoTallerPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const microcertificacionId = params.id;

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [orden, setOrden] = useState("0");
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    const respuesta = await fetch("/api/talleres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo,
        descripcion,
        orden: Number(orden),
        microcertificacionId,
        videoUrl: videoUrl || undefined,
      }),
    });

    const datos = await respuesta.json();
    setCargando(false);

    if (!respuesta.ok) {
      setError(datos.error || "Ocurrió un error.");
      return;
    }

    router.push(`/dashboard/microcertificaciones/${microcertificacionId}`);
  };

  return (
    <main className="admin-page">
      <div className="admin-wrap admin-wrap--narrow admin-card">
        <h1>
          Nuevo taller
        </h1>

        <form onSubmit={handleSubmit} className="form-stack">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sidep-azul"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              required
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sidep-azul"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Orden (posición dentro de la microcertificación)
            </label>
            <input
              type="number"
              min={0}
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sidep-azul"
            />
          </div>
          
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link de YouTube (opcional)
            </label>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sidep-azul"
            />
            <p className="text-xs text-gray-500 mt-1">
              El estudiante deberá ver el video antes de responder el taller.
            </p>
          </div>
          
          {error && (
            <p className="form-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="form-submit disabled:opacity-60"
          >
            {cargando ? "Guardando..." : "Crear taller"}
          </button>
        </form>
      </div>
    </main>
  );
}
