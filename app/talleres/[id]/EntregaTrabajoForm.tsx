"use client";

import { useState } from "react";

export default function EntregaTrabajoForm({ tallerId }: { tallerId: number }) {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [comentario, setComentario] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!archivo) {
      setError("Debes seleccionar un archivo.");
      return;
    }

    setCargando(true);

    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("comentario", comentario);

    const res = await fetch(`/api/talleres/${tallerId}/entregar`, {
      method: "POST",
      body: formData,
    });

    setCargando(false);

    if (!res.ok) {
      const datos = await res.json();
      setError(datos.error || "Ocurrió un error al enviar la entrega.");
      return;
    }

    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="bg-green-50 border border-green-700/20 rounded-2xl p-5">
        <p className="text-sidep-tinta font-medium">
          Tu trabajo fue entregado correctamente.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="learning-card-section mb-0 flex flex-col gap-4"
    >
      <div>
        <label className="block text-sm font-medium text-sidep-tinta/70 mb-1.5">
          Archivo del trabajo
        </label>
         <input
          type="file"
          onChange={(e) => setArchivo(e.target.files?.[0] || null)}
          className="w-full text-sm text-sidep-tinta/70
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-medium
            file:bg-sidep-azul file:text-white
            hover:file:bg-sidep-azul/90
            file:cursor-pointer cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-sidep-tinta/70 mb-1.5">
          Comentario (opcional)
        </label>
        <textarea
          rows={3}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="w-full rounded-md border border-sidep-azul-medio/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sidep-azul/40 focus:border-sidep-azul"
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button
        type="submit"
        disabled={cargando}
        className="form-submit disabled:opacity-60"
      >
        {cargando ? "Enviando..." : "Entregar trabajo"}
      </button>
    </form>
  );
}
