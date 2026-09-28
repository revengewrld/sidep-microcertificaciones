import { prisma } from "@/lib/prisma";
import Image from "next/image";
import BotonImprimir from "./BotonImprimir";

export default async function VerificarCertificadoPage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;

  const certificado = await prisma.certificado.findUnique({
    where: { codigo },
    include: {
      usuario: { select: { nombre: true, cedula: true } },
      microcertificacion: { select: { titulo: true, duracionHoras: true } },
    },
  });

  if (!certificado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sidep-hueso px-4">
        <div className="text-center">
          <h1 className="text-2xl text-sidep-tinta mb-2">
            Certificado no encontrado
          </h1>
          <p className="text-sidep-tinta/60">
            El código ingresado no corresponde a ningún certificado válido.
          </p>
        </div>
      </div>
    );
  }

  const emitido = certificado.emitidoEn;
  const dia = emitido.getDate();
  const mes = emitido.toLocaleDateString("es-ES", { month: "long" });
  const año = emitido.getFullYear();

  return (
    <div className="min-h-screen bg-sidep-hueso flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        <div className="relative bg-white overflow-hidden aspect-[1.414/1] shadow-sm">
                   {/* Listón curvo superior izquierdo */}
          <svg
            viewBox="0 0 300 300"
            className="absolute top-0 left-0 w-[38%] h-auto"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="grad-tl" x1="0" y1="0" x2="300" y2="300">
                <stop offset="0%" stopColor="#1b3a5c" />
                <stop offset="65%" stopColor="#1b3a5c" />
                <stop offset="100%" stopColor="#e8a33d" />
              </linearGradient>
            </defs>
            <path
              d="M0,0 L300,0 C150,60 60,150 0,300 Z"
              fill="url(#grad-tl)"
            />
            <path
              d="M0,0 L300,0 C150,60 60,150 0,300"
              fill="none"
              stroke="#e8a33d"
              strokeWidth="4"
            />
            <path
              d="M20,0 L300,0 C165,70 70,165 0,320"
              fill="none"
              stroke="#e8a33d"
              strokeWidth="3"
              opacity="0.7"
            />
          </svg>

          {/* Listón curvo inferior derecho */}
          <svg
            viewBox="0 0 300 300"
            className="absolute bottom-0 right-0 w-[38%] h-auto"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="grad-br" x1="300" y1="300" x2="0" y2="0">
                <stop offset="0%" stopColor="#e8a33d" />
                <stop offset="35%" stopColor="#1b3a5c" />
                <stop offset="100%" stopColor="#1b3a5c" />
              </linearGradient>
            </defs>
            <path
              d="M300,300 L0,300 C150,240 240,150 300,0 Z"
              fill="url(#grad-br)"
            />
            <path
              d="M300,300 L0,300 C150,240 240,150 300,0"
              fill="none"
              stroke="#e8a33d"
              strokeWidth="4"
            />
            <path
              d="M280,300 L0,300 C135,230 230,135 300,-20"
              fill="none"
              stroke="#e8a33d"
              strokeWidth="3"
              opacity="0.7"
            />
          </svg>

                    {/* Marca de agua del logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Image
              src="/logo-sidep.png"
              alt=""
              width={420}
              height={162}
              className="opacity-[0.06] grayscale"
            />
          </div>

          {/* Contenido */}
          <div className="relative h-full flex flex-col items-center justify-center text-center px-10 sm:px-24 py-10">
            <Image
              src="/logo-sidep.png"
              alt="SIDEP"
              width={110}
              height={42}
              className="mb-3"
            />

            <p className="text-sm sm:text-base font-semibold text-sidep-tinta">
              Servicios Integrales de Desarrollo Educativo y Profesional
            </p>
            <p className="text-xs italic text-sidep-tinta/60 mb-6">
              En cumplimiento del Decreto 1075
            </p>

            <p className="italic text-sidep-tinta/80 text-sm mb-1">
              Hace constar que
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-sidep-tinta mb-2 uppercase tracking-wide">
              {certificado.usuario.nombre}
            </h1>

            {certificado.usuario.cedula && (
              <p className="text-sm text-sidep-tinta/80 mb-4">
                con cédula de ciudadanía no.{" "}
                <span className="font-semibold">
                  {certificado.usuario.cedula}
                </span>
              </p>
            )}

            <p className="italic text-sidep-tinta/80 text-sm mb-1">
              Cursó y aprobó la acción de formación en:
            </p>
            <p className="italic font-bold text-sidep-azul text-base sm:text-lg mb-1 uppercase">
              {certificado.microcertificacion.titulo}
            </p>
            <p className="font-bold text-sidep-tinta text-sm mb-1">
              Con una duración de {certificado.microcertificacion.duracionHoras}{" "}
              horas
            </p>
            <p className="font-bold text-sidep-tinta text-sm mb-10">
              En testimonio de lo anterior se firma en Bogotá a los {dia} días
              del mes de {mes} de {año}.
            </p>

            <div className="flex items-end justify-center gap-16 sm:gap-28 mt-auto">
              <div className="text-center">
                <p className="font-signature text-3xl text-sidep-tinta -rotate-2 -mb-1">
                  C. Triviño
                </p>
                <div className="w-40 sm:w-48 border-t border-sidep-tinta/50 pt-2">
                  <p className="text-xs font-semibold text-sidep-tinta">
                    CARLOS JULIO TRIVIÑO BOHÓRQUEZ
                  </p>
                  <p className="text-[10px] text-sidep-tinta/60">
                    DIRECTOR DE PROYECTOS EDUCATIVOS
                  </p>
                  <p className="text-[10px] text-sidep-tinta/60">
                    INSTITUTO SIDEP S.A.S
                  </p>
                </div>
              </div>
              <div className="text-center">
                <p className="font-signature text-3xl text-sidep-tinta rotate-2 -mb-1">
                  V. Bastidas
                </p>
                <div className="w-40 sm:w-48 border-t border-sidep-tinta/50 pt-2">
                  <p className="text-xs font-semibold text-sidep-tinta">
                    VICTOR BASTIDAS POVEDA
                  </p>
                  <p className="text-[10px] text-sidep-tinta/60">
                    REPRESENTANTE LEGAL
                  </p>
                  <p className="text-[10px] text-sidep-tinta/60">
                    INSTITUTO SIDEP S.A.S
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[10px] italic text-sidep-tinta/50 mt-6">
              Para verificación de este documento puede verificar su validez en
              sidep.edu.co
              <br />
              RESOLUCIÓN 10-3183 del 29 de julio de 2024
            </p>
          </div>
        </div>

                <div className="flex flex-col items-center gap-3 mt-8 print:hidden">
          <BotonImprimir />
          <p className="text-xs text-sidep-tinta/50 font-mono">
            Código: {certificado.codigo}
          </p>
        </div>
      </div>
    </div>
  );
}