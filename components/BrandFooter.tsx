import Image from "next/image";
import Link from "next/link";

export default function BrandFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container site-footer__inner">
        <div className="site-footer__brand">
          <Image
            src="/logo-sidep.png"
            alt="Instituto SIDEP"
            width={118}
            height={45}
          />
          <p>
            Formación práctica para fortalecer habilidades profesionales y
            abrir nuevas oportunidades.
          </p>
        </div>
        <div className="site-footer__links">
          <Link href="/catalogo">Explorar programas</Link>
          <Link href="/login">Iniciar sesión</Link>
          <span>Instituto SIDEP S.A.S.</span>
        </div>
      </div>
      <div className="site-container site-footer__bottom">
        <p>Servicios Integrales de Desarrollo Educativo y Profesional</p>
        <p>Educación que se convierte en progreso.</p>
      </div>
    </footer>
  );
}
