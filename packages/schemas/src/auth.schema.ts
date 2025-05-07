import { UserSchema } from "./user.schema";
import { z } from "zod";

/**
 * Schema para o cadastro de um usuário
 */
export const SignUpSchema = z
  .object({
    email: z.string().email("Por favor, forneça um endereço de email válido"),
    password: z
      .string()
      .min(8, "A senha deve conter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
    confirmPassword: z.string(),
    name: z.string().min(2, "O nome deve conter pelo menos 2 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type SignUp = z.infer<typeof SignUpSchema>;

/**
 * Schema para o login de um usuário usando email ou nome de usuário
 */
export const SignInSchema = z.object({
  identifier: z.string().min(1, {
    message: "Email ou nome de usuário é obrigatório!",
  }),
  password: z.string().min(1, {
    message: "Senha é obrigatória!",
  }),
});

export type SignIn = z.infer<typeof SignInSchema>;
/**
 * Schema para os dados de resposta do login, incluindo informações do usuário e tokens
 */
export const SignInDataSchema = z.object({
  data: UserSchema,
  tokens: z.object({
    refresh_token: z.string(),
    access_token: z.string(),
    session_token: z.string(),
  }),
});

/**
 * Schema para representar uma sessão única
 */
export const SessionSchema = z.object({
  id: z.string().min(1),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ip: z.string().min(1),
  browser: z.string().min(1),
  device_os: z.string().min(1),
  device_type: z.string().min(1),
  device_name: z.string().min(1),
  location: z.string().min(1),
  refresh_token: z.string(),
  userId: z.number(),
});

export type Session = z.infer<typeof SessionSchema>;

/**
 * Schema para obter uma resposta de sessão única
 */
export const GetSessionSchema = z.object({
  data: SessionSchema,
});

/**
 * Schema para obter múltiplas sessões
 */
export const GetSessionsSchema = z.object({
  data: z.array(SessionSchema),
});

/**
 * Schema para sair de uma sessão usando o token de sessão
 */
export const SignOutSchema = z.object({
  session_token: z.string(),
});

export type SignOut = z.infer<typeof SignOutSchema>;

/**
 * Schema para alterar a senha
 */
export const ChangePasswordSchema = z
  .object({
    password: z.string(),
    newPassword: z
      .string()
      .min(8, "A senha deve conter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não coincidem",
    path: ["confirmNewPassword"],
  });

export type ChangePassword = z.infer<typeof ChangePasswordSchema>;
