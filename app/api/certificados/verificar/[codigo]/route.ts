import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ codigo: string }> }
) {
  const { codigo } = await params;

  const certificado = await prisma.certificado.findUnique({
    where: { codigo },
    include: {
      usuario: { select: { nombre: true } },
      microcertificacion: { select: { titulo: true, duracionHoras: true } },
    },
  });

  if (!certificado) {
    return NextResponse.json(
      { valido: false, error: "Certificado no encontrado." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    valido: true,
    codigo: certificado.codigo,
    nombreUsuario: certificado.usuario.nombre,
    tituloMicrocertificacion: certificado.microcertificacion.titulo,
    duracionHoras: certificado.microcertificacion.duracionHoras,
    emitidoEn: certificado.emitidoEn,
  });
}