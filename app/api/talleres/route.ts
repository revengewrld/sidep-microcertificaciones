import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();

  if (!session || session.user.rol !== "ADMINISTRADOR") {
    return NextResponse.json(
      { error: "No tienes permiso para hacer esto." },
      { status: 403 }
    );
  }

    const {
    titulo,
    descripcion,
    orden,
    microcertificacionId,
    instructorId,
    videoUrl,
  } = await request.json();
  
  console.log("VIDEO URL RECIBIDO:", videoUrl);

  if (!titulo || !descripcion || !microcertificacionId) {
    return NextResponse.json(
      { error: "Título, descripción y microcertificación son obligatorios." },
      { status: 400 }
    );
  }

    const nuevo = await prisma.taller.create({
    data: {
      titulo,
      descripcion,
      orden: orden ?? 0,
      videoUrl: videoUrl || null,
      microcertificacionId: Number(microcertificacionId),
      instructorId: instructorId ? Number(instructorId) : null,
    },
  });

  return NextResponse.json(nuevo, { status: 201 });
}