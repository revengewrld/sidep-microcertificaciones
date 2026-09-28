import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "Debes iniciar sesión para inscribirte." },
      { status: 401 }
    );
  }

  const { microcertificacionId } = await request.json();

  if (!microcertificacionId) {
    return NextResponse.json(
      { error: "Falta el ID de la microcertificación." },
      { status: 400 }
    );
  }

  const yaInscrito = await prisma.inscripcion.findUnique({
    where: {
      usuarioId_microcertificacionId: {
        usuarioId: Number(session.user.id),
        microcertificacionId: Number(microcertificacionId),
      },
    },
  });

  if (yaInscrito) {
    return NextResponse.json(
      { error: "Ya estás inscrito en esta microcertificación." },
      { status: 409 }
    );
  }

  const inscripcion = await prisma.inscripcion.create({
    data: {
      usuarioId: Number(session.user.id),
      microcertificacionId: Number(microcertificacionId),
    },
  });

  return NextResponse.json(inscripcion, { status: 201 });
}