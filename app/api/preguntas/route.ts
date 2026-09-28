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

  const { tallerId, texto, tipo, orden, opciones } = await request.json();

  if (!tallerId || !texto || !tipo || !Array.isArray(opciones)) {
    return NextResponse.json(
      { error: "Faltan datos obligatorios." },
      { status: 400 }
    );
  }

  if (opciones.length < 2 || opciones.length > 6) {
    return NextResponse.json(
      { error: "Debe haber entre 2 y 6 opciones." },
      { status: 400 }
    );
  }

  const tieneCorrecta = opciones.some(
    (op: { esCorrecta: boolean }) => op.esCorrecta
  );
  if (!tieneCorrecta) {
    return NextResponse.json(
      { error: "Debes marcar al menos una opción como correcta." },
      { status: 400 }
    );
  }

  const opcionesVacias = opciones.some(
    (op: { texto: string }) => !op.texto || !op.texto.trim()
  );
  if (opcionesVacias) {
    return NextResponse.json(
      { error: "Ninguna opción puede estar vacía." },
      { status: 400 }
    );
  }

  const nueva = await prisma.pregunta.create({
    data: {
      tallerId: Number(tallerId),
      texto,
      tipo,
      orden: orden ?? 0,
      opciones: {
        create: opciones.map((op: { texto: string; esCorrecta: boolean }) => ({
          texto: op.texto,
          esCorrecta: op.esCorrecta,
        })),
      },
    },
    include: { opciones: true },
  });

  return NextResponse.json(nueva, { status: 201 });
}