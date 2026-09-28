"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function NuevoExamenPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const microcertificacionId = params.id;

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const crearExamen = async () => {
    setError("");
    setCargando(true);

    const respuesta = await fetch(
      `/api/microcertificaciones/${microcertificacionId}/examen`,
      { method: "POST" }
    );

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
      <div className="admin-wrap admin-wrap--narrow admin-card text-center">
        <h1>
          Crear examen final
        </h1>
        <p className="text-gray-600 mb-6">
          Se creará el examen final para esta microcertificación. Luego
          podrás agregarle preguntas. Los estudiantes necesitarán 100% para
          aprobarlo, y solo podrán presentarlo después de aprobar todos los
          talleres.
        </p>

        {error && (
          <p className="form-error mb-4">{error}</p>
        )}

        <button
          onClick={crearExamen}
          disabled={cargando}
          className="form-submit disabled:opacity-60"
        >
          {cargando ? "Creando..." : "Crear examen final"}
        </button>
      </div>
    </main>
  );
}
