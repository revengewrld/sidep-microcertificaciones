import { prisma } from "@/lib/prisma";

export async function emitirCertificadoSiAplica(
  usuarioId: number,
  microcertificacionId: number
) {
  const existente = await prisma.certificado.findUnique({
    where: {
      usuarioId_microcertificacionId: {
        usuarioId,
        microcertificacionId,
      },
    },
  });

  if (existente) {
    return existente;
  }

  const certificado = await prisma.certificado.create({
    data: {
      usuarioId,
      microcertificacionId,
    },
  });

  return certificado;
}