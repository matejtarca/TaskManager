import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { hash, verify } from "argon2";
import { prisma } from "@/server/prismaClient";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          return null;
        }
        const { username, password } = credentials;
        const user = await prisma.user.findUnique({
          where: {
            username,
          },
        });
        if (!user) {
          return null;
        }
        if (!(await verify(user.password, password))) {
          return null;
        }
        return {
          id: user.id,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id && user?.username) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && token?.username) {
        session.id = token.id;
        session.username = token.username;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
