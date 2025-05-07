"use server";

import { revalidateTag } from "next/cache";
import {
  SignIn,
  SignInDataSchema,
  SignInSchema,
  SignUp,
  SignUpSchema,
  DefaultReturnSchema,
  SignOut,
  SignOutSchema,
  ChangePassword,
  ChangePasswordSchema,
  GetSessionSchema,
  Session,
  GetSessionsSchema,
} from "@repo/schemas";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { z } from "zod";
import { User } from "next-auth";
import { safeFetch } from "@/lib/safeFetch";
import { getDeviceInfo } from "@/lib/device";
import { signIn, signOut } from "@/auth";

/**
 * Analisa e envia login com credenciais e informações do dispositivo para o backend.
 */
export const authorizeSignIn = async (
  params: SignIn
): Promise<ActionResponse<User>> => {
  const validationResult = await action({
    params,
    schema: SignInSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { identifier, password } = validationResult.params!;

  try {
    const deviceInfo = await getDeviceInfo();

    const [error, data] = await safeFetch(SignInDataSchema, "/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        identifier,
        password,
        ...deviceInfo,
      }),
    });

    if (error) throw new Error(error);

    const dataSend = {
      id: data.data.id,
      name: data.data.name,
      email: data.data.email,
      username: data.data.username,
      auth: {
        access_token: data.tokens.access_token,
        refresh_token: data.tokens.refresh_token,
        session_token: data.tokens.session_token,
      },
    };

    return { success: true, data: dataSend };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

/**
 * Server action de login com credenciais.
 */
export const signInWithCredentials = async (
  params: SignIn
): Promise<ActionResponse> => {
  const validationResult = await action({
    params,
    schema: SignInSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { identifier, password } = validationResult.params!;

  try {
    await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

/**
 * Server action de registro com credenciais.
 */
export const signUpWithCredentials = async (
  params: SignUp
): Promise<ActionResponse> => {
  const validationResult = await action({
    params,
    schema: SignUpSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email, password, name } = validationResult.params!;

  try {
    const [error] = await safeFetch(DefaultReturnSchema, "/auth/sign-up", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (error) throw new Error(error);

    await signIn("credentials", {
      identifier: email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

/**
 * Desloga um dispositivo pelo token de sessão.
 */
export const signOutBySessionToken = async (params: {
  token: string;
}): Promise<ActionResponse> => {
  const validationResult = await action({
    params,
    schema: z.object({ token: z.string() }),
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { session } = validationResult;
  const { token } = validationResult.params!;

  try {
    const [error] = await safeFetch(DefaultReturnSchema, "/auth/sign-out", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.auth.access_token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ session_token: token }),
    });

    if (error) throw new Error(error);

    revalidateTag("nest-auth-sessions");

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

/**
 * Desloga do dispositivo atual.
 */
export const signOutCurrentDevice = async (): Promise<ActionResponse> => {
  const validationResult = await action({
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { session } = validationResult;

  try {
    await signOutBySessionToken({
      token: session?.user.auth.session_token || "",
    });
    await signOut({ redirect: false });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

/**
 * Desloga de um dispositivo diferente pelo token de sessão.
 */
export const signOutOtherDevice = async (
  params: SignOut
): Promise<ActionResponse> => {
  const validationResult = await action({
    params,
    schema: SignOutSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { session_token } = validationResult.params!;
  try {
    await signOutBySessionToken({
      token: session_token,
    });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

/**
 * Desloga de todos os dispositivos.
 */
export const signOutAllDevice = async (): Promise<ActionResponse> => {
  const validationResult = await action({
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { session } = validationResult;
  try {
    const [error] = await safeFetch(
      DefaultReturnSchema,
      "/auth/sign-out-allDevices",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.auth.access_token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ userId: session?.user.id }),
      }
    );

    if (error) throw new Error(error);

    revalidateTag("nest-auth-sessions");

    await signOut({ redirect: false });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

/**
 * Altera a senha do usuário atual.
 */
export const changePassword = async (
  params: ChangePassword
): Promise<ActionResponse> => {
  const validationResult = await action({
    params,
    schema: ChangePasswordSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { session } = validationResult;
  const { password, newPassword } = validationResult.params!;

  try {
    const [error] = await safeFetch(
      DefaultReturnSchema,
      "/auth/change-password",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.auth.access_token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          identifier: session?.user.email,
          password,
          newPassword,
        }),
      }
    );

    if (error) throw new Error(error);

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

/**
 * Obtém a sessão atual pelo token.
 */
export const getSessionById = async (): Promise<ActionResponse<Session>> => {
  const validationResult = await action({
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { session } = validationResult;
  try {
    const [error, data] = await safeFetch(
      GetSessionSchema,
      `/sessions/${session?.user.auth.session_token}`,
      {
        next: {
          tags: ["next-auth-session"],
          revalidate: 86400, // 24 h
        },
        headers: {
          Authorization: `Bearer ${session?.user.auth.access_token}`,
        },
      }
    );

    if (error) throw new Error(error);

    return { success: true, data: data.data };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

/**
 * Obtém todas as sessões ativas para o usuário.
 */
export const getAuthSessions = async (): Promise<ActionResponse<Session[]>> => {
  const validationResult = await action({
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { session } = validationResult;
  try {
    const [error, data] = await safeFetch(
      GetSessionsSchema,
      `/sessions/${session?.user.id}`,
      {
        next: {
          tags: ["nest-auth-sessions"],
          revalidate: 86400, // 24 h
        },
        headers: {
          Authorization: `Bearer ${session?.user.auth.access_token}`,
        },
      }
    );

    if (error) throw new Error(error);

    return { success: true, data: data.data };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
