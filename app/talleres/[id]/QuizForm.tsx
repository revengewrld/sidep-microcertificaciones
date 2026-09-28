"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Opcion = { id: number; texto: string };
type Pregunta = {
  id: number;
  texto: string;
  tipo: string;
  opciones: Opcion[];
};

export default function QuizForm({
  tallerId,
  preguntas,
}: {
  tallerId: number;
  preguntas: Pregunta[];
}) {
  const router = useRouter();
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState<{
    calificacion: number;
    aprobado: boolean;
    siguienteTallerId: number | null;
    examenFinalId: number | null;
  } | null>(null);

  const seleccionar = (preguntaId: number, opcionId: number) => {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: opcionId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (Object.keys(respuestas).length < preguntas.length) {
      setError("Debes responder todas las preguntas.");
      return;
    }

    setCargando(true);

    const respuesta = await fetch(`/api/talleres/${tallerId}/enviar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        respuestas: Object.entries(respuestas).map(
          ([preguntaId, opcionId]) => ({
            preguntaId: Number(preguntaId),
            opcionId,
          })
        ),
      }),
    });

    const datos = await respuesta.json();
    setCargando(false);

    if (!respuesta.ok) {
      setError(datos.error || "Ocurrió un error.");
      return;
    }

    setResultado(datos);
  };

  if (resultado) {
    return (
      <div
        className={`rounded-2xl p-8 text-center border ${
          resultado.aprobado
            ? "bg-sidep-ambar/10 border-sidep-ambar/50"
            : "bg-white border-red-300"
        }`}
      >
        <p className="text-xl text-sidep-tinta mb-1">
          {resultado.aprobado ? "Aprobaste el taller" : "No aprobaste"}
        </p>
        <p className="text-sidep-tinta/70 mb-6">
          Obtuviste {resultado.calificacion}% (se requiere 80% para aprobar)
        </p>
        {!resultado.aprobado && (
          <button
            onClick={() => {
              setResultado(null);
              setRespuestas({});
            }}
            className="btn-primary"
          >
            Intentar de nuevo
          </button>
        )}
                {resultado.aprobado && (
          <button
            onClick={() => {
              if (resultado.siguienteTallerId) {
                router.push(`/talleres/${resultado.siguienteTallerId}`);
              } else if (resultado.examenFinalId) {
                router.push(`/examenes/${resultado.examenFinalId}`);
              } else {
                router.push("/dashboard");
              }
            }}
            className="btn-primary"
          >
            {resultado.siguienteTallerId
              ? "Siguiente taller"
              : resultado.examenFinalId
              ? "Presentar examen final"
              : "Volver al dashboard"}
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {preguntas.map((pregunta, index) => (
        <div
          key={pregunta.id}
          className="quiz-card"
        >
          <p className="font-medium text-sidep-tinta mb-4">
            {index + 1}. {pregunta.texto}
          </p>
          <div className="flex flex-col gap-2.5">
            {pregunta.opciones.map((opcion) => (
              <label
                key={opcion.id}
                className="flex items-center gap-3 text-sm text-sidep-tinta/80 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`pregunta-${pregunta.id}`}
                  checked={respuestas[pregunta.id] === opcion.id}
                  onChange={() => seleccionar(pregunta.id, opcion.id)}
                  className="accent-sidep-azul w-4 h-4"
                />
                {opcion.texto}
              </label>
            ))}
          </div>
        </div>
      ))}

      {error && (
        <p className="form-error">{error}</p>
      )}

      <button
        type="submit"
        disabled={cargando}
        className="form-submit disabled:opacity-60"
      >
        {cargando ? "Calificando..." : "Enviar respuestas"}
      </button>
    </form>
  );
}
