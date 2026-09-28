-- CreateTable
CREATE TABLE "public"."Microcertificacion" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "duracionHoras" INTEGER NOT NULL DEFAULT 20,
    "categoria" TEXT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "imagenUrl" TEXT,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Microcertificacion_pkey" PRIMARY KEY ("id")
);
