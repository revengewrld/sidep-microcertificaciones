"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

type Opcion = { texto: string; esCorrecta: boolean };
type Tipo = "OPCION_MULTIPLE" | "VERDADERO_FALSO";

export default function NuevaPreguntaExamenPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const examenId = params.id;

  const [texto, setTexto] = useState("");
  const [tipo, setTipo] = useState<Tipo>("OPCION_MULTIPLE");
  const [opciones, setOpciones] = useState<Opcion[]>([
    { texto: "", esCorrecta: false },
    { texto: "", esCorrecta: false },
  ]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const cambiarTipo = (nuevoTipo: Tipo) => {
    setTipo(nuevoTipo);
    if (nuevoTipo === "VERDADERO_FALSO") {
      setOpciones([
        { texto: "Verdadero", esCorrecta: false },
        { texto: "Falso", esCorrecta: false },
      ]);
    } else {
      setOpciones([
        { texto: "", esCorrecta: false },
        { texto: "", esCorrecta: false },
      ]);
    }
  };

  const actualizarTextoOpcion = (index: number, valor: string) => {
    const nuevas = [...opciones];
    nuevas[index].texto = valor;
    setOpciones(nuevas);
  };

  const marcarCorrecta = (index: number) => {
    const nuevas = opciones.map((op, i) => ({
      ...op,
      esCorrecta: i === index,
    }));
    setOpciones(nuevas);
  };

  const agregarOpcion = () => {
    if (opciones.length >= 6) return;
    setOpciones([...opciones, { texto: "", esCorrecta: false }]);
  };

  const quitarOpcion = (index: number) => {
    if (opciones.length <= 2) return;
    setOpciones(opciones.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    const respuesta = await fetch(`/api/examenes/${examenId}/preguntas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto, tipo, opciones }),
    });

    const datos = await respuesta.json();
    setCargando(false);

    if (!respuesta.ok) {
      setError(datos.error || "Ocurrió un error.");
      return;
    }

    router.back();
  };

  return (
    <main className="admin-page">
      <div className="admin-wrap admin-wrap--narrow admin-card">
        <h1>
          Nueva pregunta del examen final
        </h1>

        <form onSubmit={handleSubmit} className="form-stack">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Texto de la pregunta
            </label>
            <textarea
              required
              rows={3}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sidep-azul"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de pregunta
            </label>
            <select
              value={tipo}
              onChange={(e) => cambiarTipo(e.target.value as Tipo)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sidep-azul"
            >
              <option value="OPCION_MULTIPLE">Opción múltiple</option>
              <option value="VERDADERO_FALSO">Verdadero / Falso</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opciones de respuesta (marca la correcta)
            </label>
            <div className="space-y-2">
              {opciones.map((op, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correcta"
                    checked={op.esCorrecta}
                    onChange={() => marcarCorrecta(index)}
                  />
                  <input
                    type="text"
                    required
                    placeholder={`Opción ${index + 1}`}
                    value={op.texto}
                    disabled={tipo === "VERDADERO_FALSO"}
                    onChange={(e) =>
                      actualizarTextoOpcion(index, e.target.value)
                    }
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sidep-azul disabled:bg-gray-100"
                  />
                  {tipo === "OPCION_MULTIPLE" && opciones.length > 2 && (
                    <button
                      type="button"
                      onClick={() => quitarOpcion(index)}
                      className="text-red-500 text-sm px-2"
                    >
                      Quitar
                    </button>
                  )}
                </div>
              ))}
            </div>

            {tipo === "OPCION_MULTIPLE" && opciones.length < 6 && (
              <button
                type="button"
                onClick={agregarOpcion}
                className="mt-2 text-sm text-sidep-azul font-medium hover:underline"
              >
                + Agregar opción
              </button>
            )}
          </div>

          {error && (
            <p className="form-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="form-submit disabled:opacity-60"
          >
            {cargando ? "Guardando..." : "Crear pregunta"}
          </button>
        </form>
      </div>
    </main>
  );
}
