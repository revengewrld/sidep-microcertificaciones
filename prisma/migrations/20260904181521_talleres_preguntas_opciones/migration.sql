-- CreateEnum
CREATE TYPE "public"."TipoPregunta" AS ENUM ('OPCION_MULTIPLE', 'VERDADERO_FALSO');

-- CreateTable
CREATE TABLE "public"."Pregunta" (
    "id" SERIAL NOT NULL,
    "tallerId" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "tipo" "public"."TipoPregunta" NOT NULL DEFAULT 'OPCION_MULTIPLE',
    "orden" INTEGER NOT NULL DEFAULT 0,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pregunta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Opcion" (
    "id" SERIAL NOT NULL,
    "preguntaId" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "esCorrecta" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Opcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ResultadoTaller" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "tallerId" INTEGER NOT NULL,
    "calificacion" DECIMAL(5,2) NOT NULL,
    "aprobado" BOOLEAN NOT NULL DEFAULT false,
    "intentoNumero" INTEGER NOT NULL DEFAULT 1,
    "realizadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResultadoTaller_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ResultadoTaller_usuarioId_tallerId_idx" ON "public"."ResultadoTaller"("usuarioId", "tallerId");

-- AddForeignKey
ALTER TABLE "public"."Pregunta" ADD CONSTRAINT "Pregunta_tallerId_fkey" FOREIGN KEY ("tallerId") REFERENCES "public"."Taller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Opcion" ADD CONSTRAINT "Opcion_preguntaId_fkey" FOREIGN KEY ("preguntaId") REFERENCES "public"."Pregunta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResultadoTaller" ADD CONSTRAINT "ResultadoTaller_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResultadoTaller" ADD CONSTRAINT "ResultadoTaller_tallerId_fkey" FOREIGN KEY ("tallerId") REFERENCES "public"."Taller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
