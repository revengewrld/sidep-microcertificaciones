import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DetalleMicrocertificacionAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session || session.user.rol !== "ADMINISTRADOR") {
    redirect("/dashboard");
  }

  const microcertificacion = await prisma.microcertificacion.findUnique({
    where: { id: Number(id) },
    include: {
      talleres: {
        orderBy: { orden: "asc" },
        include: {
          preguntas: { select: { id: true } },
        },
      },
      examenFinal: {
        include: {
          preguntas: { select: { id: true } },
        },
      },
    },
  });

  if (!microcertificacion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Microcertificación no encontrada.</p>
      </div>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-wrap">
        <Link
          href="/dashboard"
          className="admin-back"
        >
          ← Volver al dashboard
        </Link>

        <div className="admin-card">
          <span className="inline-block bg-sidep-amarillo/30 text-sidep-azul text-xs font-medium px-3 py-1 rounded-full mb-3">
            {microcertificacion.categoria}
          </span>
          <h1>
            {microcertificacion.titulo}
          </h1>
          <p className="text-gray-600 mb-4">
            {microcertificacion.descripcion}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{microcertificacion.duracionHoras} horas</span>
            <span>
              {microcertificacion.publicado
                ? "Publicada"
                : "No publicada"}
            </span>
          </div>
        </div>

        <div className="admin-section">
          <div className="admin-section__header">
            <h2 className="text-lg font-semibold text-gray-800">
              Talleres
            </h2>
            <Link
              href={`/dashboard/microcertificaciones/${microcertificacion.id}/talleres/nuevo`}
              className="btn-primary"
            >
              + Agregar taller
            </Link>
          </div>

          {microcertificacion.talleres.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Aún no hay talleres creados para esta microcertificación.
            </p>
          ) : (
            <ul className="space-y-3">
              {microcertificacion.talleres.map((taller, index) => (
                <li key={taller.id}>
                  <Link
                    href={`/dashboard/talleres/${taller.id}`}
                    className="admin-list-card"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">
                          {index + 1}. {taller.titulo}
                        </p>
                        <p className="text-sm text-gray-500">
                          {taller.descripcion}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {taller.preguntas.length}{" "}
                        {taller.preguntas.length === 1
                          ? "pregunta"
                          : "preguntas"}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="admin-section">
          <div className="admin-section__header">
            <h2 className="text-lg font-semibold text-gray-800">
              Examen final
            </h2>
            {!microcertificacion.examenFinal && (
              <Link
                href={`/dashboard/microcertificaciones/${microcertificacion.id}/examen/nuevo`}
                className="btn-primary"
              >
                + Crear examen final
              </Link>
            )}
          </div>

          {!microcertificacion.examenFinal ? (
            <p className="text-gray-500 text-sm">
              Aún no se ha creado el examen final de esta microcertificación.
            </p>
          ) : (
            <Link
              href={`/dashboard/examenes/${microcertificacion.examenFinal.id}/preguntas/nueva`}
              className="admin-list-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">
                    Examen final
                  </p>
                  <p className="text-sm text-gray-500">
                    Se requiere 100% para aprobar
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {microcertificacion.examenFinal.preguntas.length}{" "}
                  {microcertificacion.examenFinal.preguntas.length === 1
                    ? "pregunta"
                    : "preguntas"}
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
