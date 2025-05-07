import { z } from "zod";

export const CardSchema = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().min(1, "O título do card é obrigatório"),
  description: z.string().optional().nullable(),
  position: z.number().int().nonnegative(),
  listId: z.number().int().positive(),
  ownerId: z.number().int().positive().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateCardSchema = z.object({
  title: z.string().min(1, "O título do card é obrigatório"),
  description: z.string().optional(),
  listId: z.number().int().positive(),
  ownerId: z.number().int().positive().optional(),
});

export const UpdateCardSchema = CardSchema.pick({
  title: true,
  description: true,
  ownerId: true,
}).partial();

export const UpdateCardPositionSchema = z.object({
  id: z.number().int().positive(),
  position: z.number().int().nonnegative(),
  listId: z.number().int().positive(),
});

export type Card = z.infer<typeof CardSchema>;
export type CreateCardInput = z.infer<typeof CreateCardSchema>;
export type UpdateCardInput = z.infer<typeof UpdateCardSchema>;
export type UpdateCardPositionInput = z.infer<typeof UpdateCardPositionSchema>;
