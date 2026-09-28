import { prisma } from "@/lib/prisma";
import { obtenerProgramaPorId } from "@/lib/catalogo";
import { auth } from "@/auth";
import Link from "next/link";
import BrandFooter from "@/components/BrandFooter";
import BrandHeader from "@/components/BrandHeader";
import InscribirseBoton from "./InscribirseBoton";
import ConfirmarDocumentoBoton from "./ConfirmarDocumentoBoton";

export default async function DetalleMicrocertificacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const microcertificacion = await obtenerProgramaPorId(Number(id));

  if (!microcertificacion) {
    return (
      <div className="min-h-screen flex items-center justify-center page-shell px-4">
        <div className="empty-state max-w-xl">
          <h1 className="text-2xl text-sidep-azul mb-2">
            Microcertificación no encontrada
          </h1>
          <p>El programa que buscas no está disponible.</p>
          <Link href="/catalogo" className="btn-primary mt-5">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  let yaInscrito = false;
  let documentoConfirmado = false;

  if (session && !microcertificacion.esVistaPrevia) {
    const inscripcion = await prisma.inscripcion.findUnique({
      where: {
        usuarioId_microcertificacionId: {
          usuarioId: Number(session.user.id),
          microcertificacionId: microcertificacion.id,
        },
      },
    });
    yaInscrito = !!inscripcion;
    documentoConfirmado = inscripcion?.documentoConfirmado ?? false;
  }

  const debeConfirmarDocumento =
    session &&
    yaInscrito &&
    microcertificacion.documentoUrl &&
    !documentoConfirmado;

  return (
    <div className="page-shell">
      <BrandHeader
        active="catalogo"
        actions={
          <Link
            href={session ? "/dashboard" : "/login"}
            className="header-button"
          >
            {session ? "Ir a mi aula" : "Iniciar sesión"}
          </Link>
        }
      />

      <main>
        <section className="page-banner">
          <div className="site-container page-banner__inner">
            <span className="eyebrow">{microcertificacion.categoria}</span>
            <h1>{microcertificacion.titulo}</h1>
            <p>{microcertificacion.descripcion}</p>
          </div>
        </section>

        <div className="site-container page-content detail-layout">
          <section className="detail-main">
            {debeConfirmarDocumento ? (
              <>
                <span className="status-pill">Lectura requerida</span>
                <h2 className="text-2xl text-sidep-azul mt-5 mb-3">
                  Antes de comenzar
                </h2>
                <p className="text-sidep-tinta/65 mb-6">
                  Revisa el documento del programa y confirma su lectura para
                  habilitar los talleres y el examen final.
                </p>
                <iframe
                  src={microcertificacion.documentoUrl ?? undefined}
                  title={`Documento de ${microcertificacion.titulo}`}
                  className="w-full h-[560px] rounded-2xl border border-sidep-azul-medio/30 mb-5"
                />
                <ConfirmarDocumentoBoton
                  microcertificacionId={microcertificacion.id}
                />
              </>
            ) : (
              <>
                <div className="content-section mt-0">
                  <h2 className="content-section__title">
                    Ruta de talleres
                    <span>
                      {microcertificacion.talleres.length}{" "}
                      {microcertificacion.talleres.length === 1
                        ? "taller"
                        : "talleres"}
                    </span>
                  </h2>
                  {microcertificacion.talleres.length === 0 ? (
                    <div className="empty-state">
                      Aún no hay talleres publicados para este programa.
                    </div>
                  ) : (
                    <ol className="lesson-list">
                      {microcertificacion.talleres.map((taller, index) => (
                        <li key={taller.id}>
                          {microcertificacion.esVistaPrevia ? (
                            <div className="lesson-link">
                              <span className="lesson-number">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <div>
                                <strong>{taller.titulo}</strong>
                                <p>{taller.descripcion}</p>
                              </div>
                              <span className="lesson-arrow" aria-hidden>
                                →
                              </span>
                            </div>
                          ) : (
                            <Link
                              href={`/talleres/${taller.id}`}
                              className="lesson-link"
                            >
                            <span className="lesson-number">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <div>
                              <strong>{taller.titulo}</strong>
                              <p>{taller.descripcion}</p>
                            </div>
                            <span className="lesson-arrow" aria-hidden>
                              →
                            </span>
                            </Link>
                          )}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>

                {session &&
                  !microcertificacion.esVistaPrevia &&
                  microcertificacion.examenFinal && (
                  <div className="content-section">
                    <h2 className="content-section__title">Evaluación final</h2>
                    <div className="learning-card-section mb-0">
                      <h3 className="text-xl text-sidep-azul mb-2">
                        Examen de certificación
                      </h3>
                      <p className="text-sm text-sidep-tinta/60 mb-5">
                        Se habilita después de aprobar todos los talleres de la
                        ruta.
                      </p>
                      <Link
                        href={`/examenes/${microcertificacion.examenFinal.id}`}
                        className="btn-primary"
                      >
                        Presentar examen final
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>

          <aside className="detail-aside">
            <span className="eyebrow">Resumen</span>
            <h2 className="text-xl text-sidep-azul mt-3 mb-5">
              Información del programa
            </h2>
            <div className="detail-stats">
              <div className="detail-stat">
                <span>Duración</span>
                <strong>{microcertificacion.duracionHoras} horas</strong>
              </div>
              <div className="detail-stat">
                <span>Modalidad</span>
                <strong>100% virtual</strong>
              </div>
            </div>
            <div className="mb-6">
              <span className="block text-xs font-bold uppercase tracking-wider text-sidep-tinta/50">
                Inversión
              </span>
              <strong className="block text-2xl text-sidep-azul mt-1">
                {microcertificacion.precio === 0
                  ? "Gratuito"
                  : `$${microcertificacion.precio.toLocaleString("es-CO")}`}
              </strong>
            </div>

            {session && !microcertificacion.esVistaPrevia ? (
              <InscribirseBoton
                microcertificacionId={microcertificacion.id}
                yaInscrito={yaInscrito}
              />
            ) : (
              <Link href="/login" className="btn-primary w-full">
                Inicia sesión para inscribirte
              </Link>
            )}

            <p className="text-xs text-sidep-tinta/50 mt-5 mb-0">
              Incluye talleres prácticos, evaluación final y certificado
              verificable al completar la ruta.
            </p>
          </aside>
        </div>
      </main>

      <BrandFooter />
    </div>
  );
}
