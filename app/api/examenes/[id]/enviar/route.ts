import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { emitirCertificadoSiAplica } from "@/lib/certificados";

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
  const examenFinalId = Number(id);
  const { respuestas } = await request.json();

  if (!Array.isArray(respuestas) || respuestas.length === 0) {
    return NextResponse.json(
      { error: "No se recibieron respuestas." },
      { status: 400 }
    );
  }

  const preguntas = await prisma.preguntaExamen.findMany({
    where: { examenFinalId },
    include: { opciones: true },
  });

  if (preguntas.length === 0) {
    return NextResponse.json(
      { error: "Este examen no tiene preguntas." },
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
  const aprobado = calificacion >= 100;

  const intentosPrevios = await prisma.resultadoExamen.count({
    where: { usuarioId: Number(session.user.id), examenFinalId },
  });

  await prisma.resultadoExamen.create({
    data: {
      usuarioId: Number(session.user.id),
      examenFinalId,
      calificacion,
      aprobado,
      intentoNumero: intentosPrevios + 1,
    },
  });

    let certificadoCodigo: string | null = null;

  if (aprobado) {
    const examenFinal = await prisma.examenFinal.findUnique({
      where: { id: examenFinalId },
      select: { microcertificacionId: true },
    });

    if (examenFinal) {
      const certificado = await emitirCertificadoSiAplica(
        Number(session.user.id),
        examenFinal.microcertificacionId
      );
      certificadoCodigo = certificado.codigo;
    }
  }

  return NextResponse.json({ calificacion, aprobado, certificadoCodigo });
}