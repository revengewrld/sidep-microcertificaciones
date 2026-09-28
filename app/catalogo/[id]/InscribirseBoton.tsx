"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InscribirseBoton({
  microcertificacionId,
  yaInscrito,
}: {
  microcertificacionId: number;
  yaInscrito: boolean;
}) {
  const router = useRouter();
  const [inscrito, setInscrito] = useState(yaInscrito);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleInscribirse = async () => {
    setError("");
    setCargando(true);

    const respuesta = await fetch("/api/inscripciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ microcertificacionId }),
    });

    const datos = await respuesta.json();
    setCargando(false);

    if (!respuesta.ok) {
      setError(datos.error || "Ocurrió un error.");
      return;
    }

    setInscrito(true);
    router.refresh();
  };

  if (inscrito) {
    return (
      <p className="w-full inline-flex items-center justify-center gap-2 bg-green-50 border border-green-700/25 text-green-700 font-bold px-5 py-3 rounded-xl">
        Ya estás inscrito
        <span aria-hidden>✓</span>
      </p>
    );
  }

  return (
    <div>
      <button
        onClick={handleInscribirse}
        disabled={cargando}
        className="btn-primary w-full disabled:opacity-60"
      >
        {cargando ? "Inscribiendo..." : "Inscribirme"}
      </button>
      {error && <p className="form-error mt-3">{error}</p>}
    </div>
  );
}
