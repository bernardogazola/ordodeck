import { env } from "@/lib/env";
import { authorizeSignIn } from "@/lib/actions/auth.action";
import NextAuth, {
  NextAuthConfig,
  NextAuthResult,
  Session,
  User,
} from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { NextRequest } from "next/server";
import ROUTES from "@/constants/routes";

const authConfig: NextAuthConfig = {
  pages: {
    signIn: ROUTES.LOGIN,
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Identifier", type: "string" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        const response: ActionResponse<User> = await authorizeSignIn({
          identifier: credentials.identifier as string,
          password: credentials.password as string,
        });

        if (response.success && response.data) {
          return {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            username: response.data.username,
            // Incluir aqui outros campos necessários se o tipo User tiver eles
            auth: response.data.auth,
          };
        } else {
          console.error("Autenticação falhou:", response.error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }): Promise<JWT> {
      if (trigger === "update") {
        return {
          ...token,
          user: {
            ...token.user,
            ...session.user,
          },
        };
      }

      if (trigger === "signIn" && user) {
        const typedUser = user as User;
        token.user = {
          id: typedUser.id,
          name: typedUser.name,
          email: typedUser.email,
          username: typedUser.username,
          image: typedUser.image,
          auth: typedUser.auth,
        };
      }

      return token;
    },

    async session({ session, token }): Promise<Session> {
      if (token?.user) {
        const jwtUser = token.user as User;
        return {
          ...session,
          user: {
            id: jwtUser.id,
            name: jwtUser.name,
            email: jwtUser.email,
            username: jwtUser.username,
            image: jwtUser.image,
            auth: jwtUser.auth,
          },
        };
      }
      return session;
    },

    async authorized({
      request,
      auth,
    }: {
      request: NextRequest;
      auth: Session | null;
    }): Promise<boolean | Response> {
      const isAuth = !!auth?.user;
      const { nextUrl } = request;
      const { pathname } = nextUrl;

      const isAuthRoute = pathname.startsWith(ROUTES.LOGIN);
      const isDashboardRoute = pathname.startsWith(ROUTES.DASHBOARD);

      if (!isAuth) {
        if (isDashboardRoute) {
          const signInUrl = new URL(ROUTES.LOGIN, nextUrl.origin);
          signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
          return Response.redirect(signInUrl);
        }

        return true;
      }

      if (isAuth) {
        if (isAuthRoute) {
          return Response.redirect(new URL(ROUTES.DASHBOARD, nextUrl));
        }

        return true;
      }

      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: env.AUTH_SESSION_AGE,
    updateAge: 86400 * 5, //5 dias,
  },
  cookies: {
    callbackUrl: {
      name: "ordodeck-callback-url",
    },
    csrfToken: {
      name: "ordodeck-csrf-token",
    },
    sessionToken: {
      name: "ordodeck-session",
    },
  },
  secret: env.AUTH_SECRET,
  // debug: process.env.NODE_ENV === 'development',
};

const result = NextAuth(authConfig);

export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;
export const unstable_update: NextAuthResult["unstable_update"] =
  result.unstable_update;
