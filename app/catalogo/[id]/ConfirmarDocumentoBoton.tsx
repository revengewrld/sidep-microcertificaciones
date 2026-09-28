"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmarDocumentoBoton({
  microcertificacionId,
}: {
  microcertificacionId: number;
}) {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirmar() {
    setError("");
    setCargando(true);

    const res = await fetch("/api/inscripciones/confirmar-documento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ microcertificacionId }),
    });

    setCargando(false);

    if (!res.ok) {
      setError("Ocurrió un error. Intenta de nuevo.");
      return;
    }

    router.refresh();
  }

  return (
    <div>
      {error && <p className="form-error mb-3">{error}</p>}
      <button
        onClick={handleConfirmar}
        disabled={cargando}
        className="form-submit disabled:opacity-60"
      >
        {cargando ? "Confirmando..." : "Ya leí el documento, continuar"}
      </button>
    </div>
  );
}
