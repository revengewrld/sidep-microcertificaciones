-- AlterTable
ALTER TABLE "public"."Taller" ADD COLUMN     "videoUrl" TEXT;

-- CreateTable
CREATE TABLE "public"."Entrega" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "tallerId" INTEGER NOT NULL,
    "archivoUrl" TEXT NOT NULL,
    "nombreArchivo" TEXT NOT NULL,
    "comentario" TEXT,
    "entregadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revisado" BOOLEAN NOT NULL DEFAULT false,
    "calificacion" DECIMAL(5,2),
    "retroalimentacion" TEXT,

    CONSTRAINT "Entrega_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Entrega_usuarioId_tallerId_idx" ON "public"."Entrega"("usuarioId", "tallerId");

-- AddForeignKey
ALTER TABLE "public"."Entrega" ADD CONSTRAINT "Entrega_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entrega" ADD CONSTRAINT "Entrega_tallerId_fkey" FOREIGN KEY ("tallerId") REFERENCES "public"."Taller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
