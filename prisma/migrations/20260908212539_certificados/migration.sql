-- CreateTable
CREATE TABLE "public"."Certificado" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "microcertificacionId" INTEGER NOT NULL,
    "emitidoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Certificado_codigo_key" ON "public"."Certificado"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Certificado_usuarioId_microcertificacionId_key" ON "public"."Certificado"("usuarioId", "microcertificacionId");

-- AddForeignKey
ALTER TABLE "public"."Certificado" ADD CONSTRAINT "Certificado_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Certificado" ADD CONSTRAINT "Certificado_microcertificacionId_fkey" FOREIGN KEY ("microcertificacionId") REFERENCES "public"."Microcertificacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
