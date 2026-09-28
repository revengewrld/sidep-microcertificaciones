import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Debes iniciar sesión." }, { status: 401 });
  }

  const { microcertificacionId } = await request.json();

  if (!microcertificacionId) {
    return NextResponse.json(
      { error: "Falta el ID de la microcertificación." },
      { status: 400 }
    );
  }

  await prisma.inscripcion.update({
    where: {
      usuarioId_microcertificacionId: {
        usuarioId: Number(session.user.id),
        microcertificacionId: Number(microcertificacionId),
      },
    },
    data: { documentoConfirmado: true },
  });

  return NextResponse.json({ ok: true });
}