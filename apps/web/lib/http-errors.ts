export class RequestError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;
  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = "Erro de requisição";
  }
}

export class ValidationError extends RequestError {
  constructor(fieldErrors: Record<string, string[]>) {
    const message = ValidationError.formatFieldErrors(fieldErrors);
    super(400, message, fieldErrors);
    this.name = "Erro de validação";
    this.errors = fieldErrors;
  }
  static formatFieldErrors(fieldErrors: Record<string, string[]>): string {
    const formattedMessages = Object.entries(fieldErrors).map(
      ([field, messages]) => {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);

        if (messages[0] === "Required") {
          return `${fieldName} é obrigatório`;
        } else {
          return messages.join(" e ");
        }
      }
    );

    return formattedMessages.join(", ");
  }
}

export class NotFoundError extends RequestError {
  constructor(resource: string) {
    super(404, `${resource} não encontrado`);
    this.name = "Erro de não encontrado";
  }
}

export class ForbiddenError extends RequestError {
  constructor(message: string = "Proibido") {
    super(403, message);
    this.name = "Erro de proibição";
  }
}

export class UnauthorizedError extends RequestError {
  constructor(message: string = "Não autorizado") {
    super(401, message);
    this.name = "Erro de autorização";
  }
}
