import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || session.user.rol !== "ADMINISTRADOR") {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const formData = await request.formData();
  const archivo = formData.get("archivo") as File | null;

  if (!archivo) {
    return NextResponse.json(
      { error: "No se recibió ningún archivo." },
      { status: 400 }
    );
  }

  if (archivo.type !== "application/pdf") {
    return NextResponse.json(
      { error: "El archivo debe ser un PDF." },
      { status: 400 }
    );
  }

  const carpetaDestino = path.join(
    process.cwd(),
    "public",
    "uploads",
    "documentos"
  );
  await mkdir(carpetaDestino, { recursive: true });

  const nombreUnico = `${randomUUID()}.pdf`;
  const rutaCompleta = path.join(carpetaDestino, nombreUnico);

  const bytes = await archivo.arrayBuffer();
  await writeFile(rutaCompleta, Buffer.from(bytes));

  const urlPublica = `/uploads/documentos/${nombreUnico}`;

  return NextResponse.json({ url: urlPublica });
}