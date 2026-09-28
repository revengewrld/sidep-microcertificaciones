import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const microcertificaciones = await prisma.microcertificacion.findMany({
    where: { publicado: true },
    orderBy: { creadoEn: "desc" },
  });

  return NextResponse.json(microcertificaciones);
}

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
    categoria,
    precio,
    imagenUrl,
    documentoUrl,
    duracionHoras,
    publicado,
  } = await request.json();

  if (!titulo || !descripcion || !categoria) {
    return NextResponse.json(
      { error: "Título, descripción y categoría son obligatorios." },
      { status: 400 }
    );
  }

      const nueva = await prisma.microcertificacion.create({
    data: {
      titulo,
      descripcion,
      categoria,
      precio: precio ?? 0,
      imagenUrl: imagenUrl || null,
      documentoUrl: documentoUrl || null,
      duracionHoras: duracionHoras ? Number(duracionHoras) : 20,
      publicado: publicado ?? false,
    },
  });

  return NextResponse.json(nueva, { status: 201 });
}