-- AlterTable
ALTER TABLE "public"."Inscripcion" ADD COLUMN     "documentoConfirmado" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Microcertificacion" ADD COLUMN     "documentoUrl" TEXT;
