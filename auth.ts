import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Permite revisar la interfaz localmente aunque el equipo todavía no haya
  // compartido el archivo .env. En producción AUTH_SECRET sigue siendo
  // obligatorio y debe configurarse con un valor seguro.
  secret:
    process.env.AUTH_SECRET ??
    (process.env.NODE_ENV === "development"
      ? "sidep-local-preview-only-change-before-production"
      : undefined),
  providers: [
    Credentials({
      credentials: {
        correo: {},
        contraseña: {},
      },
      authorize: async (credentials) => {
        const usuario = await prisma.usuario.findUnique({
          where: { correo: credentials.correo as string },
        });

        if (!usuario) return null;

        const contraseñaValida = await bcrypt.compare(
          credentials.contraseña as string,
          usuario.contraseña
        );

        if (!contraseñaValida) return null;

        return {
          id: usuario.id.toString(),
          name: usuario.nombre,
          email: usuario.correo,
          rol: usuario.rol,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.rol = user.rol;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.rol = token.rol as string;
        session.user.id = token.id as string;
      }
      return session;
    },
    },
});
