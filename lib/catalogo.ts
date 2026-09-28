import { prisma } from "@/lib/prisma";

export type ProgramaCatalogo = {
  id: number;
  titulo: string;
  descripcion: string;
  duracionHoras: number;
  categoria: string;
  precio: number;
  imagenUrl: string | null;
  esVistaPrevia: boolean;
};

export type ProgramaDetalle = ProgramaCatalogo & {
  documentoUrl: string | null;
  talleres: Array<{
    id: number;
    titulo: string;
    descripcion: string;
    orden: number;
  }>;
  examenFinal: { id: number } | null;
};

const programasDemostracion: ProgramaDetalle[] = [
  {
    id: 9001,
    titulo: "Automatización de procesos con IA y No-Code",
    descripcion:
      "Aprende a diseñar flujos eficientes, conectar herramientas digitales y automatizar tareas repetitivas sin necesidad de programar.",
    duracionHoras: 20,
    categoria: "Automatización e inteligencia artificial",
    precio: 0,
    imagenUrl: null,
    documentoUrl: null,
    esVistaPrevia: true,
    talleres: [
      {
        id: 9101,
        titulo: "Fundamentos y oportunidades",
        descripcion:
          "Identifica procesos que pueden optimizarse y define un objetivo claro.",
        orden: 1,
      },
      {
        id: 9102,
        titulo: "Diseño de flujos No-Code",
        descripcion:
          "Organiza disparadores, acciones y datos en un flujo funcional.",
        orden: 2,
      },
      {
        id: 9103,
        titulo: "Automatización con inteligencia artificial",
        descripcion:
          "Integra herramientas de IA para clasificar, redactar y responder.",
        orden: 3,
      },
      {
        id: 9104,
        titulo: "Proyecto aplicado",
        descripcion:
          "Construye, prueba y presenta una automatización completa.",
        orden: 4,
      },
    ],
    examenFinal: { id: 9901 },
  },
  {
    id: 9002,
    titulo: "Alfabetización digital para entornos productivos",
    descripcion:
      "Fortalece competencias digitales esenciales para trabajar, comunicarte y gestionar información con mayor seguridad.",
    duracionHoras: 20,
    categoria: "Competencias digitales",
    precio: 0,
    imagenUrl: null,
    documentoUrl: null,
    esVistaPrevia: true,
    talleres: [
      {
        id: 9201,
        titulo: "Entorno digital y organización",
        descripcion: "Configura un espacio de trabajo digital claro y ordenado.",
        orden: 1,
      },
      {
        id: 9202,
        titulo: "Documentos y colaboración",
        descripcion: "Crea, comparte y administra archivos de forma práctica.",
        orden: 2,
      },
      {
        id: 9203,
        titulo: "Comunicación y ciudadanía digital",
        descripcion: "Aplica buenas prácticas de comunicación y convivencia digital.",
        orden: 3,
      },
      {
        id: 9204,
        titulo: "Seguridad de la información",
        descripcion: "Protege cuentas, datos personales y dispositivos.",
        orden: 4,
      },
    ],
    examenFinal: { id: 9902 },
  },
  {
    id: 9003,
    titulo: "Herramientas digitales para emprender",
    descripcion:
      "Organiza clientes, contenidos y tareas con herramientas accesibles que ayudan a convertir una idea en un proyecto sostenible.",
    duracionHoras: 20,
    categoria: "Emprendimiento",
    precio: 0,
    imagenUrl: null,
    documentoUrl: null,
    esVistaPrevia: true,
    talleres: [
      {
        id: 9301,
        titulo: "Propuesta de valor",
        descripcion: "Define el problema, el público y el beneficio de tu proyecto.",
        orden: 1,
      },
      {
        id: 9302,
        titulo: "Organización y productividad",
        descripcion: "Gestiona tareas, tiempos y recursos con claridad.",
        orden: 2,
      },
      {
        id: 9303,
        titulo: "Presencia digital",
        descripcion: "Construye una comunicación coherente para canales digitales.",
        orden: 3,
      },
      {
        id: 9304,
        titulo: "Validación de la idea",
        descripcion: "Prueba tu propuesta y toma decisiones con evidencia.",
        orden: 4,
      },
    ],
    examenFinal: { id: 9903 },
  },
];

function catalogoDeDemostracion(): ProgramaCatalogo[] {
  return programasDemostracion.map((programa) => ({
    id: programa.id,
    titulo: programa.titulo,
    descripcion: programa.descripcion,
    duracionHoras: programa.duracionHoras,
    categoria: programa.categoria,
    precio: programa.precio,
    imagenUrl: programa.imagenUrl,
    esVistaPrevia: true,
  }));
}

function puedeUsarDemostracion() {
  return process.env.NODE_ENV === "development";
}

export async function obtenerProgramasPublicados(): Promise<ProgramaCatalogo[]> {
  if (!process.env.DATABASE_URL && puedeUsarDemostracion()) {
    return catalogoDeDemostracion();
  }

  try {
    const programas = await prisma.microcertificacion.findMany({
      where: { publicado: true },
      orderBy: { creadoEn: "desc" },
    });

    return programas.map((programa) => ({
      id: programa.id,
      titulo: programa.titulo,
      descripcion: programa.descripcion,
      duracionHoras: programa.duracionHoras,
      categoria: programa.categoria,
      precio: Number(programa.precio),
      imagenUrl: programa.imagenUrl,
      esVistaPrevia: false,
    }));
  } catch (error) {
    if (!puedeUsarDemostracion()) throw error;
    console.warn(
      "[SIDEP] Base de datos no disponible. Se mostrará el catálogo de demostración."
    );
    return catalogoDeDemostracion();
  }
}

export async function obtenerProgramaPorId(
  id: number
): Promise<ProgramaDetalle | null> {
  const programaDemostracion = programasDemostracion.find(
    (programa) => programa.id === id
  );

  if (!process.env.DATABASE_URL && puedeUsarDemostracion()) {
    return programaDemostracion ?? null;
  }

  try {
    const programa = await prisma.microcertificacion.findUnique({
      where: { id },
      include: {
        talleres: { orderBy: { orden: "asc" } },
        examenFinal: true,
      },
    });

    if (!programa) return programaDemostracion ?? null;

    return {
      id: programa.id,
      titulo: programa.titulo,
      descripcion: programa.descripcion,
      duracionHoras: programa.duracionHoras,
      categoria: programa.categoria,
      precio: Number(programa.precio),
      imagenUrl: programa.imagenUrl,
      documentoUrl: programa.documentoUrl,
      esVistaPrevia: false,
      talleres: programa.talleres.map((taller) => ({
        id: taller.id,
        titulo: taller.titulo,
        descripcion: taller.descripcion,
        orden: taller.orden,
      })),
      examenFinal: programa.examenFinal
        ? { id: programa.examenFinal.id }
        : null,
    };
  } catch (error) {
    if (!puedeUsarDemostracion()) throw error;
    console.warn(
      "[SIDEP] Base de datos no disponible. Se mostrará el programa de demostración."
    );
    return programaDemostracion ?? null;
  }
}
