import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { nombre, cedula, correo, contraseña } = await request.json();

    if (!nombre || !cedula || !correo || !contraseña) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios." },
        { status: 400 }
      );
    }

    if (contraseña.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      );
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese correo." },
        { status: 409 }
      );
    }

    const contraseñaEncriptada = await bcrypt.hash(contraseña, 10);

    await prisma.usuario.create({
      data: {
        nombre,
        cedula,
        correo,
        contraseña: contraseñaEncriptada,
        rol: "ESTUDIANTE",
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Ocurrió un error al crear la cuenta." },
      { status: 500 }
    );
  }
}