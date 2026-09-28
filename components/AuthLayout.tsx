import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  intro?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthLayout({
  title,
  intro,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <main className="auth-shell">
      <section className="auth-brand-panel" aria-label="Instituto SIDEP">
        <Link href="/" aria-label="Ir al inicio">
          <Image
            src="/logo-sidep.png"
            alt="Instituto SIDEP"
            width={144}
            height={55}
            priority
          />
        </Link>
        <div className="auth-brand-copy">
          <span className="eyebrow">Aula virtual SIDEP</span>
          <h2>Aprender también es abrir camino.</h2>
          <p>
            Ingresa a una experiencia formativa práctica, clara y diseñada
            para que cada avance se convierta en una habilidad demostrable.
          </p>
        </div>
        <p className="auth-brand-note">
          Servicios Integrales de Desarrollo Educativo y Profesional
        </p>
      </section>

      <section className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-card__mobile-logo">
            <Link href="/" aria-label="Ir al inicio">
              <Image
                src="/logo-sidep.png"
                alt="Instituto SIDEP"
                width={144}
                height={55}
                priority
              />
            </Link>
          </div>
          <h1>{title}</h1>
          {intro && <p className="auth-card__intro">{intro}</p>}
          {children}
          {footer && <div className="auth-card__footer">{footer}</div>}
        </div>
      </section>
    </main>
  );
}
