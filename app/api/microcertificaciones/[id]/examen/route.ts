import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session || session.user.rol !== "ADMINISTRADOR") {
    return NextResponse.json(
      { error: "No tienes permiso para hacer esto." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const microcertificacionId = Number(id);

  const existente = await prisma.examenFinal.findUnique({
    where: { microcertificacionId },
  });

  if (existente) {
    return NextResponse.json(
      { error: "Esta microcertificación ya tiene un examen final." },
      { status: 400 }
    );
  }

  const nuevo = await prisma.examenFinal.create({
    data: { microcertificacionId },
  });

  return NextResponse.json(nuevo, { status: 201 });
}