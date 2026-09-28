import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import BrandFooter from "@/components/BrandFooter";
import BrandHeader from "@/components/BrandHeader";
import ExamenForm from "./ExamenForm";

export default async function ExamenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const examen = await prisma.examenFinal.findUnique({
    where: { id: Number(id) },
    include: {
      microcertificacion: {
        include: { talleres: true },
      },
      preguntas: {
        orderBy: { orden: "asc" },
        include: {
          opciones: { select: { id: true, texto: true } },
        },
      },
    },
  });

  if (!examen) {
    return (
      <div className="min-h-screen flex items-center justify-center page-shell">
        <div className="empty-state">Examen no encontrado.</div>
      </div>
    );
  }

  const usuarioId = Number(session.user.id);
  const talleresIds = examen.microcertificacion.talleres.map((t) => t.id);

  const resultadosAprobados = await prisma.resultadoTaller.findMany({
    where: {
      usuarioId,
      tallerId: { in: talleresIds },
      aprobado: true,
    },
    select: { tallerId: true },
  });

  const talleresAprobadosIds = new Set(
    resultadosAprobados.map((r) => r.tallerId)
  );

  const puedePresentar =
    talleresIds.length > 0 &&
    talleresIds.every((tid) => talleresAprobadosIds.has(tid));

  return (
    <div className="page-shell">
      <BrandHeader
        actions={
          <Link href="/dashboard" className="header-button">
            Volver a mi aula
          </Link>
        }
      />

      <main className="learning-page">
        <div className="learning-wrap">
          {!puedePresentar ? (
            <section className="learning-card-section text-center py-12">
              <span className="status-pill">Aún no disponible</span>
              <h1 className="text-3xl text-sidep-azul mt-5 mb-3">
                Completa primero todos los talleres
              </h1>
              <p className="text-sidep-tinta/60 max-w-lg mx-auto mb-6">
                El examen final de{" "}
                <strong>{examen.microcertificacion.titulo}</strong> se habilita
                cuando apruebes todos los talleres de la ruta.
              </p>
              <Link href="/dashboard" className="btn-secondary">
                Volver a mi aula
              </Link>
            </section>
          ) : (
            <>
              <header className="learning-hero">
                <span className="eyebrow">
                  {examen.microcertificacion.titulo}
                </span>
                <h1>Examen final</h1>
                <p>
                  Responde todas las preguntas. Necesitas obtener el 100% para
                  aprobar y emitir tu certificado.
                </p>
              </header>

              {examen.preguntas.length === 0 ? (
                <div className="empty-state">
                  Este examen aún no tiene preguntas.
                </div>
              ) : (
                <ExamenForm
                  examenId={examen.id}
                  preguntas={examen.preguntas}
                />
              )}
            </>
          )}
        </div>
      </main>

      <BrandFooter />
    </div>
  );
}
