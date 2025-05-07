import "next-auth";
import { User } from "next-auth";

declare module "next-auth" {
  /**
   * A forma do objeto de usuário retornado no callback `profile` do provedor OAuth,
   * ou o segundo parâmetro do callback `session`, quando usado um banco de dados.
   */
  interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    auth: {
      access_token: string;
      refresh_token: string;
      session_token: string;
    };
  }

  /**
   * Retornado por `useSession`, `auth`, contém informações sobre a sessão ativa.
   */
  interface Session {
    user: User;
  }
}

// O `JWT` interface pode ser encontrado no submodule `next-auth/jwt`
import "next-auth/jwt";

declare module "next-auth/jwt" {
  /** Retornado pelo callback `jwt` e `auth`, quando usando sessões JWT */
  interface JWT {
    user: User;
  }
}
