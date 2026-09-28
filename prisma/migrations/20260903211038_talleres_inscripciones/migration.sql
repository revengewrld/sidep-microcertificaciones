-- CreateTable
CREATE TABLE "public"."Taller" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "microcertificacionId" INTEGER NOT NULL,
    "instructorId" INTEGER,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Taller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Inscripcion" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "microcertificacionId" INTEGER NOT NULL,
    "inscritoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inscripcion_usuarioId_microcertificacionId_key" ON "public"."Inscripcion"("usuarioId", "microcertificacionId");

-- AddForeignKey
ALTER TABLE "public"."Taller" ADD CONSTRAINT "Taller_microcertificacionId_fkey" FOREIGN KEY ("microcertificacionId") REFERENCES "public"."Microcertificacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Taller" ADD CONSTRAINT "Taller_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inscripcion" ADD CONSTRAINT "Inscripcion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inscripcion" ADD CONSTRAINT "Inscripcion_microcertificacionId_fkey" FOREIGN KEY ("microcertificacionId") REFERENCES "public"."Microcertificacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
