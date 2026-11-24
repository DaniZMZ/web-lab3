import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (credentials?.username === "admin" && credentials?.password === "admin") {
          return { id: "1", name: "Администратор", role: "admin" };
        }
        if (credentials?.username === "user" && credentials?.password === "user") {
          return { id: "2", name: "Пользователь", role: "user" };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});