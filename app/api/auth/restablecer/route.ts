import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { token, nuevaContrasena } = await request.json();

    if (!token || !nuevaContrasena) {
      return NextResponse.json(
        { error: "Token y nueva contraseña son obligatorios" },
        { status: 400 }
      );
    }

    if (nuevaContrasena.length < 8) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 8 caracteres" },
        { status: 400 }
      );
    }

    const registroToken = await prisma.tokenRecuperacion.findUnique({
      where: { token },
    });

    if (!registroToken) {
      return NextResponse.json(
        { error: "El enlace de recuperación no es válido" },
        { status: 400 }
      );
    }

    if (registroToken.usado) {
      return NextResponse.json(
        { error: "Este enlace ya fue utilizado" },
        { status: 400 }
      );
    }

    if (registroToken.expiraEn < new Date()) {
      return NextResponse.json(
        { error: "El enlace de recuperación expiró. Solicita uno nuevo" },
        { status: 400 }
      );
    }

    const contraseñaHash = await bcrypt.hash(nuevaContrasena, 10);

    await prisma.usuario.update({
      where: { id: registroToken.usuarioId },
      data: { contraseña: contraseñaHash },
    });

    await prisma.tokenRecuperacion.update({
      where: { id: registroToken.id },
      data: { usado: true },
    });

    return NextResponse.json({
      mensaje: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar la solicitud" },
      { status: 500 }
    );
  }
}