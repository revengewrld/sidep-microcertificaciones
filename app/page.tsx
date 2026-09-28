import Link from "next/link";
import { auth } from "@/auth";
import BrandFooter from "@/components/BrandFooter";
import BrandHeader from "@/components/BrandHeader";

const modules = [
  {
    number: "01",
    title: "No-Code y disparadores",
    detail: "Diseña tu primer flujo automatizable.",
  },
  {
    number: "02",
    title: "Zapier, hojas y formularios",
    detail: "Conecta datos sin escribir código.",
  },
  {
    number: "03",
    title: "Correo, IA y Make",
    detail: "Crea automatizaciones inteligentes.",
  },
  {
    number: "04",
    title: "Pruebas y despliegue",
    detail: "Publica procesos seguros y confiables.",
  },
];

export default async function Home() {
  const session = await auth();

  return (
    <div className="home-shell">
      <BrandHeader
        active="inicio"
        actions={
          session ? (
            <Link href="/dashboard" className="header-button">
              Ir a mi aula
            </Link>
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
        <section className="hero">
          <div className="site-container hero__grid">
            <div>
              <span className="eyebrow">Aprende. Practica. Certifícate.</span>
              <h1>
                Habilidades que convierten tu experiencia en{" "}
                <span>nuevas oportunidades.</span>
              </h1>
              <p className="hero__lead">
                Microcertificaciones virtuales de 20 horas, creadas para
                aprender haciendo y demostrar lo que sabes con un certificado
                verificable.
              </p>
              <div className="hero__actions">
                <Link href="/catalogo" className="btn-primary">
                  Explorar microcertificaciones
                  <span aria-hidden>→</span>
                </Link>
                {!session && (
                  <Link href="/registro" className="btn-secondary">
                    Crear una cuenta gratis
                  </Link>
                )}
              </div>
              <ul className="hero__facts" aria-label="Características">
                <li>100% virtual</li>
                <li>Ritmo flexible</li>
                <li>Certificado verificable</li>
              </ul>
            </div>

            <aside className="learning-card" aria-label="Ruta de aprendizaje">
              <div className="learning-card__top">
                <div>
                  <strong>Tu ruta de aprendizaje</strong>
                  <p>Un recorrido corto, práctico y progresivo.</p>
                </div>
                <div className="hours-badge" aria-label="20 horas">
                  <span>
                    <b>20</b>
                    horas
                  </span>
                </div>
              </div>
              <ol className="module-route">
                {modules.map((module) => (
                  <li key={module.number}>
                    <span className="module-route__number">
                      {module.number}
                    </span>
                    <div>
                      <strong>{module.title}</strong>
                      <p>{module.detail}</p>
                    </div>
                    <span className="module-route__time">5 h</span>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </section>

        <section className="trust-strip" aria-label="Beneficios">
          <div className="site-container trust-strip__grid">
            <div className="trust-item">
              <strong>Aprendizaje aplicado</strong>
              <span>Talleres conectados con situaciones reales.</span>
            </div>
            <div className="trust-item">
              <strong>Ruta guiada</strong>
              <span>Avanza módulo por módulo con claridad.</span>
            </div>
            <div className="trust-item">
              <strong>Evaluación final</strong>
              <span>Demuestra los conocimientos adquiridos.</span>
            </div>
            <div className="trust-item">
              <strong>Respaldo SIDEP</strong>
              <span>Certificado con código de verificación.</span>
            </div>
          </div>
        </section>

        <section className="home-section">
          <div className="site-container">
            <div className="section-heading">
              <span className="eyebrow">Una experiencia sencilla</span>
              <h2>Todo lo que necesitas para avanzar, sin complicaciones.</h2>
              <p>
                La plataforma organiza contenidos, prácticas y evaluaciones
                para que siempre sepas cuál es tu siguiente paso.
              </p>
            </div>
            <div className="process-grid">
              <article className="process-card">
                <span className="process-card__number">01</span>
                <h3>Aprende a tu ritmo</h3>
                <p>
                  Revisa los contenidos y videos de cada módulo desde cualquier
                  dispositivo y en el horario que prefieras.
                </p>
              </article>
              <article className="process-card">
                <span className="process-card__number">02</span>
                <h3>Practica con propósito</h3>
                <p>
                  Resuelve talleres y entregables diseñados para convertir la
                  teoría en una habilidad útil.
                </p>
              </article>
              <article className="process-card">
                <span className="process-card__number">03</span>
                <h3>Certifica tu logro</h3>
                <p>
                  Aprueba la evaluación final y recibe un certificado listo
                  para verificar, compartir o imprimir.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="cta-band">
          <div className="site-container cta-band__inner">
            <div>
              <h2>Tu próximo aprendizaje puede empezar hoy.</h2>
              <p>Explora el catálogo y elige la ruta que más te interesa.</p>
            </div>
            <Link href="/catalogo" className="btn-primary">
              Ver programas disponibles
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      </main>

      <BrandFooter />
    </div>
  );
}
