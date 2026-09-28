import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BrandFooter from "@/components/BrandFooter";
import BrandHeader from "@/components/BrandHeader";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const { name, rol } = session.user;

  const certificados =
    rol === "ESTUDIANTE"
      ? await prisma.certificado.findMany({
          where: { usuarioId: Number(session.user.id) },
          include: {
            microcertificacion: {
              select: { titulo: true, duracionHoras: true },
            },
          },
          orderBy: { emitidoEn: "desc" },
        })
      : [];

  return (
    <div className="page-shell">
      <BrandHeader
        actions={
          <>
            <Link href="/catalogo" className="header-link">
              Catálogo
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button type="submit" className="header-button">
                Cerrar sesión
              </button>
            </form>
          </>
        }
      />

      <main>
        <section className="page-banner">
          <div className="site-container page-banner__inner">
            <span className="eyebrow">Tu espacio de aprendizaje</span>
            <h1>Hola, {name}</h1>
            <p>
              {rol === "ESTUDIANTE"
                ? "Continúa tus rutas, revisa tus logros y consulta los certificados obtenidos."
                : rol === "ADMINISTRADOR"
                  ? "Gestiona programas, talleres y evaluaciones desde un solo lugar."
                  : "Gestiona tus talleres y acompaña el avance de los estudiantes."}
            </p>
          </div>
        </section>

        <section className="site-container page-content">
          <div className="flex items-center justify-between gap-4 mb-7">
            <span className="status-pill">Rol: {rol}</span>
          </div>

          {rol === "ADMINISTRADOR" && (
            <div className="detail-layout">
              <section className="detail-main">
                <span className="eyebrow">Administración</span>
                <h2 className="text-3xl text-sidep-azul mt-4 mb-3">
                  Panel de administrador
                </h2>
                <p className="text-sidep-tinta/65 max-w-xl mb-7">
                  Crea la estructura académica de cada microcertificación y
                  organiza sus talleres, preguntas y evaluación final.
                </p>
                <Link
                  href="/dashboard/microcertificaciones/nueva"
                  className="btn-primary"
                >
                  Crear microcertificación
                  <span aria-hidden>→</span>
                </Link>
              </section>
              <aside className="detail-aside">
                <h2 className="text-lg text-sidep-azul mb-3">
                  Flujo recomendado
                </h2>
                <ol className="text-sm text-sidep-tinta/65 space-y-3 m-0 pl-5">
                  <li>Crea el programa y publica su información.</li>
                  <li>Agrega los talleres en el orden de la ruta.</li>
                  <li>Configura preguntas y examen final.</li>
                </ol>
              </aside>
            </div>
          )}

          {rol === "INSTRUCTOR" && (
            <div className="detail-main">
              <span className="eyebrow">Acompañamiento</span>
              <h2 className="text-3xl text-sidep-azul mt-4 mb-3">
                Panel de instructor
              </h2>
              <p className="text-sidep-tinta/65 max-w-2xl m-0">
                Aquí podrás gestionar tus talleres, calificar evaluaciones y
                consultar el avance de los estudiantes.
              </p>
            </div>
          )}

          {rol === "ESTUDIANTE" && (
            <div className="detail-layout">
              <section className="detail-main">
                <span className="eyebrow">Mis logros</span>
                <h2 className="text-3xl text-sidep-azul mt-4 mb-3">
                  Certificados obtenidos
                </h2>
                <p className="text-sidep-tinta/65 mb-7">
                  Consulta, imprime o comparte los certificados de las rutas
                  que completaste.
                </p>

                {certificados.length === 0 ? (
                  <div className="empty-state">
                    Aún no tienes certificados. Completa todos los talleres y
                    aprueba el examen final para obtener el primero.
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {certificados.map((cert) => (
                      <div
                        key={cert.id}
                        className="admin-list-card flex items-center justify-between gap-5"
                      >
                        <div>
                          <p className="font-bold text-sidep-tinta m-0">
                            {cert.microcertificacion.titulo}
                          </p>
                          <p className="text-sm text-sidep-tinta/55 mt-1 mb-0">
                            {cert.microcertificacion.duracionHoras} horas ·
                            Emitido el{" "}
                            {cert.emitidoEn.toLocaleDateString("es-ES")}
                          </p>
                        </div>
                        <Link
                          href={`/verificar/${cert.codigo}`}
                          target="_blank"
                          className="btn-secondary whitespace-nowrap"
                        >
                          Ver certificado
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <aside className="detail-aside">
                <h2 className="text-xl text-sidep-azul mb-3">
                  Sigue aprendiendo
                </h2>
                <p className="text-sm text-sidep-tinta/60 mb-5">
                  Explora nuevas rutas y fortalece tu perfil con habilidades
                  concretas.
                </p>
                <Link href="/catalogo" className="btn-primary w-full">
                  Ver catálogo
                </Link>
              </aside>
            </div>
          )}
        </section>
      </main>

      <BrandFooter />
    </div>
  );
}
