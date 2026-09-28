"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevaMicrocertificacionPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("0");
  const [duracionHoras, setDuracionHoras] = useState("20");
  const [imagenUrl, setImagenUrl] = useState("");
  const [documento, setDocumento] = useState<File | null>(null);
  const [publicado, setPublicado] = useState(true);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

        let documentoUrl: string | undefined = undefined;

    if (documento) {
      const formDataArchivo = new FormData();
      formDataArchivo.append("archivo", documento);

      const respuestaUpload = await fetch("/api/upload/documento", {
        method: "POST",
        body: formDataArchivo,
      });

      const datosUpload = await respuestaUpload.json();

      if (!respuestaUpload.ok) {
        setError(datosUpload.error || "Error al subir el documento.");
        setCargando(false);
        return;
      }

      documentoUrl = datosUpload.url;
    }

    const respuesta = await fetch("/api/microcertificaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo,
        descripcion,
        categoria,
        precio: Number(precio),
        duracionHoras: Number(duracionHoras),
        imagenUrl: imagenUrl || undefined,
        documentoUrl,
        publicado,
      }),
    });

        const datos = await respuesta.json();
    setCargando(false);

    if (!respuesta.ok) {
      setError(datos.error || "Ocurrió un error.");
      return;
    }

    router.push(`/dashboard/microcertificaciones/${datos.id}`);
  };

  return (
    <main className="admin-page">
      <div className="admin-wrap admin-wrap--narrow admin-card">
        <h1>
          Nueva microcertificación
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
              Duración en horas
            </label>
            <input
              type="number"
              min={1}
              value={duracionHoras}
              onChange={(e) => setDuracionHoras(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sidep-azul"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de la imagen (opcional)
            </label>
            <input
              type="text"
              placeholder="https://..."
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sidep-azul"
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Documento de la microcertificación (PDF, opcional)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setDocumento(e.target.files?.[0] || null)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sidep-azul"
            />
            <p className="text-xs text-gray-500 mt-1">
              El estudiante deberá leerlo y confirmarlo antes de empezar los talleres.
            </p>
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
              Categoría
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Tecnología, Administración..."
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sidep-azul"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio (0 = gratuito)
            </label>
            <input
              type="number"
              min={0}
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sidep-azul"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="publicado"
              checked={publicado}
              onChange={(e) => setPublicado(e.target.checked)}
            />
            <label htmlFor="publicado" className="text-sm text-gray-700">
              Publicar en el catálogo inmediatamente
            </label>
          </div>

          {error && (
            <p className="form-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="form-submit disabled:opacity-60"
          >
            {cargando ? "Guardando..." : "Crear microcertificación"}
          </button>
        </form>
      </div>
    </main>
  );
}
