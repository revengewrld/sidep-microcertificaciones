import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import BrandFooter from "@/components/BrandFooter";
import BrandHeader from "@/components/BrandHeader";
import QuizForm from "./QuizForm";
import EntregaTrabajoForm from "./EntregaTrabajoForm";

export default async function TallerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const taller = await prisma.taller.findUnique({
    where: { id: Number(id) },
    include: {
      microcertificacion: true,
      preguntas: {
        orderBy: { orden: "asc" },
        include: {
          opciones: {
            select: { id: true, texto: true },
          },
        },
      },
    },
  });

  if (!taller) {
    return (
      <div className="min-h-screen flex items-center justify-center page-shell">
        <div className="empty-state">Taller no encontrado.</div>
      </div>
    );
  }

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
          <header className="learning-hero">
            <span className="eyebrow">
              {taller.microcertificacion.titulo}
            </span>
            <h1>{taller.titulo}</h1>
            <p>{taller.descripcion}</p>
          </header>

          {taller.videoUrl && (
            <section className="learning-card-section">
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div>
                  <span className="status-pill">Video del módulo</span>
                  <h2 className="text-2xl text-sidep-azul mt-4 mb-2">
                    Empieza por aquí
                  </h2>
                  <p className="text-sm text-sidep-tinta/60 m-0">
                    Mira el video antes de responder la evaluación del taller.
                  </p>
                </div>
                <a
                  href={taller.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Ver video
                  <span aria-hidden>↗</span>
                </a>
              </div>
            </section>
          )}

          <section className="mb-10">
            <h2 className="content-section__title">Evaluación del taller</h2>
            {taller.preguntas.length === 0 ? (
              <div className="empty-state">
                Este taller aún no tiene preguntas de evaluación.
              </div>
            ) : (
              <QuizForm tallerId={taller.id} preguntas={taller.preguntas} />
            )}
          </section>

          <section>
            <h2 className="content-section__title">Entrega de trabajo</h2>
            <EntregaTrabajoForm tallerId={taller.id} />
          </section>
        </div>
      </main>

      <BrandFooter />
    </div>
  );
}
