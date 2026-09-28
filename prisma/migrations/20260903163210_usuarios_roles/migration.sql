/*
  Warnings:

  - Added the required column `contraseña` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Rol" AS ENUM ('ESTUDIANTE', 'INSTRUCTOR', 'ADMINISTRADOR');

-- AlterTable
ALTER TABLE "public"."Usuario" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "contraseña" TEXT NOT NULL,
ADD COLUMN     "rol" "public"."Rol" NOT NULL DEFAULT 'ESTUDIANTE';
