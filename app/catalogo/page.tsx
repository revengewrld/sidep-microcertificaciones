import { auth, signOut } from "@/auth";
import { obtenerProgramasPublicados } from "@/lib/catalogo";
import Image from "next/image";
import Link from "next/link";
import BrandFooter from "@/components/BrandFooter";
import BrandHeader from "@/components/BrandHeader";

export default async function CatalogoPage() {
  const session = await auth();

  const microcertificaciones = await obtenerProgramasPublicados();

  return (
    <div className="page-shell">
      <BrandHeader
        active="catalogo"
        actions={
          session ? (
            <>
              <Link href="/dashboard" className="header-link">
                Mi aula
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
          ) : (
            <>
              <Link href="/login" className="header-link">
                Iniciar sesión
              </Link>
              <Link href="/registro" className="header-button">
                Crear cuenta
              </Link>
            </>
          )
        }
      />

      <main>
        <section className="page-banner">
          <div className="site-container page-banner__inner">
            <span className="eyebrow">Formación para avanzar</span>
            <h1>Microcertificaciones</h1>
            <p>
              Programas cortos de 20 horas para desarrollar habilidades
              específicas, practicar con casos reales y certificar tus logros.
            </p>
          </div>
        </section>

        <section className="site-container page-content">
          {microcertificaciones.length === 0 ? (
            <div className="empty-state">
              <h2 className="text-xl text-sidep-azul mb-2">
                Muy pronto encontrarás nuevos programas
              </h2>
              <p className="m-0">
                El catálogo está siendo actualizado. Vuelve a consultarlo más
                adelante.
              </p>
            </div>
          ) : (
            <div className="catalog-grid">
              {microcertificaciones.map((mc) => (
                <Link
                  key={mc.id}
                  href={`/catalogo/${mc.id}`}
                  className="catalog-card"
                >
                  <div className="catalog-card__media">
                    {mc.imagenUrl ? (
                      <Image
                        src={mc.imagenUrl}
                        alt={mc.titulo}
                        width={520}
                        height={260}
                      />
                    ) : (
                      <span className="catalog-card__category">
                        {mc.categoria}
                      </span>
                    )}
                  </div>
                  <div className="catalog-card__body">
                    <h2>{mc.titulo}</h2>
                    <p>{mc.descripcion}</p>
                    <div className="catalog-card__meta">
                      <span>{mc.duracionHoras} horas</span>
                      <strong>
                        {mc.precio === 0
                          ? "Gratuito"
                          : `$${mc.precio.toLocaleString("es-CO")}`}
                      </strong>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <BrandFooter />
    </div>
  );
}
