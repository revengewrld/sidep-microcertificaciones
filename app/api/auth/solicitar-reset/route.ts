import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { enviarCorreoRecuperacion } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { correo } = await request.json();

    if (!correo) {
      return NextResponse.json(
        { error: "El correo es obligatorio" },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { correo },
    });

    // Por seguridad, respondemos igual exista o no el usuario
    // (así no revelamos qué correos están registrados)
    if (!usuario) {
      return NextResponse.json({
        mensaje: "Si el correo existe, se enviará un enlace de recuperación",
      });
    }

    const token = randomUUID();
    const expiraEn = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    await prisma.tokenRecuperacion.create({
      data: {
        token,
        usuarioId: usuario.id,
        expiraEn,
      },
    });

    await enviarCorreoRecuperacion(usuario.correo, usuario.nombre, token);

    return NextResponse.json({
      mensaje: "Si el correo existe, se enviará un enlace de recuperación",
    });
  } catch (error) {
    console.error("Error al solicitar reset:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar la solicitud" },
      { status: 500 }
    );
  }
}