-- CreateTable
CREATE TABLE "public"."ExamenFinal" (
    "id" SERIAL NOT NULL,
    "microcertificacionId" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamenFinal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PreguntaExamen" (
    "id" SERIAL NOT NULL,
    "examenFinalId" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "tipo" "public"."TipoPregunta" NOT NULL DEFAULT 'OPCION_MULTIPLE',
    "orden" INTEGER NOT NULL DEFAULT 0,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PreguntaExamen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OpcionExamen" (
    "id" SERIAL NOT NULL,
    "preguntaExamenId" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "esCorrecta" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OpcionExamen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ResultadoExamen" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "examenFinalId" INTEGER NOT NULL,
    "calificacion" DECIMAL(5,2) NOT NULL,
    "aprobado" BOOLEAN NOT NULL DEFAULT false,
    "intentoNumero" INTEGER NOT NULL DEFAULT 1,
    "realizadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResultadoExamen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamenFinal_microcertificacionId_key" ON "public"."ExamenFinal"("microcertificacionId");

-- CreateIndex
CREATE INDEX "ResultadoExamen_usuarioId_examenFinalId_idx" ON "public"."ResultadoExamen"("usuarioId", "examenFinalId");

-- AddForeignKey
ALTER TABLE "public"."ExamenFinal" ADD CONSTRAINT "ExamenFinal_microcertificacionId_fkey" FOREIGN KEY ("microcertificacionId") REFERENCES "public"."Microcertificacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PreguntaExamen" ADD CONSTRAINT "PreguntaExamen_examenFinalId_fkey" FOREIGN KEY ("examenFinalId") REFERENCES "public"."ExamenFinal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OpcionExamen" ADD CONSTRAINT "OpcionExamen_preguntaExamenId_fkey" FOREIGN KEY ("preguntaExamenId") REFERENCES "public"."PreguntaExamen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResultadoExamen" ADD CONSTRAINT "ResultadoExamen_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResultadoExamen" ADD CONSTRAINT "ResultadoExamen_examenFinalId_fkey" FOREIGN KEY ("examenFinalId") REFERENCES "public"."ExamenFinal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
