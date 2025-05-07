import { NextResponse } from "next/server";
import { RequestError, ValidationError } from "@/lib/http-errors";
import { ZodError } from "zod";
import logger from "@/lib/logger";
import { AuthError, CredentialsSignin } from "next-auth";
export type ResponseType = "api" | "server";

const formatResponse = (
  responseType: ResponseType,
  status: number,
  message: string,
  errors?: Record<string, string[]> | undefined
) => {
  const responseContent = {
    success: false,
    error: {
      message,
      details: errors,
    },
  };
  return responseType === "api"
    ? NextResponse.json(responseContent, { status })
    : { status, ...responseContent };
};

const handleError = (error: unknown, responseType: ResponseType = "server") => {
  let errorType = "unknown";
  if (error instanceof RequestError) errorType = "request";
  else if (error instanceof ZodError) errorType = "validation";
  else if (error instanceof AuthError) errorType = "auth";
  else if (error instanceof Error) errorType = "general";

  switch (errorType) {
    case "request": {
      const requestError = error as RequestError;
      logger.error(
        { err: requestError },
        `${responseType.toUpperCase()} Erro: ${requestError.message}`
      );
      return formatResponse(
        responseType,
        requestError.statusCode,
        requestError.message,
        requestError.errors
      );
    }

    case "validation": {
      const zodError = error as ZodError;
      const validationError = new ValidationError(
        zodError.flatten().fieldErrors as Record<string, string[]>
      );

      logger.error(
        { err: zodError },
        `Erro de validação: ${validationError.message}`
      );

      return formatResponse(
        responseType,
        validationError.statusCode,
        validationError.message,
        validationError.errors
      );
    }

    case "auth": {
      const authError = error as AuthError;
      logger.error(`Erro de autenticação: ${authError.message}`);

      if (error instanceof CredentialsSignin) {
        return formatResponse(responseType, 401, "Credenciais inválidas");
      }

      return formatResponse(responseType, 401, authError.message);
    }

    case "general": {
      const typedError = error as Error;
      logger.error(typedError.message);
      return formatResponse(responseType, 500, typedError.message);
    }

    default: {
      logger.error(
        { err: error },
        "Um erro inesperado ocorreu. Tente novamente mais tarde."
      );
      return formatResponse(
        responseType,
        500,
        "Um erro inesperado ocorreu. Tente novamente mais tarde."
      );
    }
  }
};

export default handleError;
