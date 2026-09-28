import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "Debes iniciar sesión." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const tallerId = Number(id);
  const { respuestas } = await request.json();

  if (!Array.isArray(respuestas) || respuestas.length === 0) {
    return NextResponse.json(
      { error: "No se recibieron respuestas." },
      { status: 400 }
    );
  }

  const preguntas = await prisma.pregunta.findMany({
    where: { tallerId },
    include: { opciones: true },
  });

  if (preguntas.length === 0) {
    return NextResponse.json(
      { error: "Este taller no tiene preguntas." },
      { status: 400 }
    );
  }

  let correctas = 0;

  for (const pregunta of preguntas) {
    const respuestaUsuario = respuestas.find(
      (r: { preguntaId: number; opcionId: number }) =>
        r.preguntaId === pregunta.id
    );
    if (!respuestaUsuario) continue;

    const opcionCorrecta = pregunta.opciones.find((op) => op.esCorrecta);
    if (opcionCorrecta && opcionCorrecta.id === respuestaUsuario.opcionId) {
      correctas++;
    }
  }

  const calificacion = Math.round((correctas / preguntas.length) * 100);
  const aprobado = calificacion >= 80;

  const intentosPrevios = await prisma.resultadoTaller.count({
    where: { usuarioId: Number(session.user.id), tallerId },
  });

    await prisma.resultadoTaller.create({
    data: {
      usuarioId: Number(session.user.id),
      tallerId,
      calificacion,
      aprobado,
      intentoNumero: intentosPrevios + 1,
    },
  });

  let siguienteTallerId: number | null = null;
  let examenFinalId: number | null = null;

  if (aprobado) {
    const tallerActual = await prisma.taller.findUnique({
      where: { id: tallerId },
      select: { microcertificacionId: true },
    });

    if (tallerActual) {
      const talleresMicro = await prisma.taller.findMany({
        where: { microcertificacionId: tallerActual.microcertificacionId },
        orderBy: { orden: "asc" },
      });

      const aprobadosUsuario = await prisma.resultadoTaller.findMany({
        where: {
          usuarioId: Number(session.user.id),
          tallerId: { in: talleresMicro.map((t) => t.id) },
          aprobado: true,
        },
        select: { tallerId: true },
      });

      const aprobadosIds = new Set(aprobadosUsuario.map((r) => r.tallerId));

      const siguienteTaller = talleresMicro.find(
        (t) => !aprobadosIds.has(t.id)
      );

      if (siguienteTaller) {
        siguienteTallerId = siguienteTaller.id;
      } else {
        const examen = await prisma.examenFinal.findUnique({
          where: { microcertificacionId: tallerActual.microcertificacionId },
          select: { id: true },
        });
        examenFinalId = examen?.id ?? null;
      }
    }
  }

  return NextResponse.json({
    calificacion,
    aprobado,
    siguienteTallerId,
    examenFinalId,
  });
}