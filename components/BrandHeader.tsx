import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type BrandHeaderProps = {
  actions?: ReactNode;
  active?: "inicio" | "catalogo";
};

export default function BrandHeader({
  actions,
  active,
}: BrandHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-container site-header__inner">
        <Link href="/" className="site-brand" aria-label="Ir al inicio">
          <Image
            src="/logo-sidep.png"
            alt="Instituto SIDEP"
            width={132}
            height={51}
            priority
          />
        </Link>

        <nav className="site-nav" aria-label="Navegación principal">
          <Link
            href="/"
            className={active === "inicio" ? "is-active" : undefined}
          >
            Inicio
          </Link>
          <Link
            href="/catalogo"
            className={active === "catalogo" ? "is-active" : undefined}
          >
            Microcertificaciones
          </Link>
        </nav>

        {actions && <div className="site-header__actions">{actions}</div>}
      </div>
    </header>
  );
}
