import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DetalleTallerAdminPage({
  params,
}: {
  params: Promise<{ tallerId: string }>;
}) {
  const { tallerId } = await params;
  const session = await auth();

  if (!session || session.user.rol !== "ADMINISTRADOR") {
    redirect("/dashboard");
  }

  const taller = await prisma.taller.findUnique({
    where: { id: Number(tallerId) },
    include: {
      microcertificacion: true,
      preguntas: {
        orderBy: { orden: "asc" },
        include: { opciones: true },
      },
    },
  });

  if (!taller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Taller no encontrado.</p>
      </div>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-wrap">
        <Link
          href={`/dashboard/microcertificaciones/${taller.microcertificacionId}`}
          className="admin-back"
        >
          ← Volver a {taller.microcertificacion.titulo}
        </Link>

        <div className="admin-card">
          <h1>
            {taller.titulo}
          </h1>
          <p className="text-gray-600">{taller.descripcion}</p>
        </div>

        <div className="admin-section">
          <div className="admin-section__header">
            <h2 className="text-lg font-semibold text-gray-800">
              Preguntas de evaluación
            </h2>
            <Link
              href={`/dashboard/talleres/${taller.id}/preguntas/nueva`}
              className="btn-primary"
            >
              + Agregar pregunta
            </Link>
          </div>

          {taller.preguntas.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Aún no hay preguntas creadas para este taller.
            </p>
          ) : (
            <ul className="space-y-3">
              {taller.preguntas.map((pregunta, index) => (
                <li
                  key={pregunta.id}
                  className="admin-list-card"
                >
                  <p className="font-medium text-gray-800 mb-2">
                    {index + 1}. {pregunta.texto}
                  </p>
                  <ul className="space-y-1">
                    {pregunta.opciones.map((opcion) => (
                      <li
                        key={opcion.id}
                        className={`text-sm px-3 py-1 rounded ${
                          opcion.esCorrecta
                            ? "bg-green-50 text-green-700 font-medium"
                            : "text-gray-600"
                        }`}
                      >
                        {opcion.esCorrecta ? "✓ " : "○ "}
                        {opcion.texto}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
