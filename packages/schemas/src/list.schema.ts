import { z } from "zod";

export const ListSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1, "O nome da lista é obrigatório"),
  position: z.number().int().nonnegative(),
  boardId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateListSchema = z.object({
  name: z.string().min(1, "O nome da lista é obrigatório"),
  boardId: z.number().int().positive(),
});

export const UpdateListSchema = ListSchema.pick({
  name: true,
}).partial();

export const UpdateListPositionSchema = z.object({
  id: z.number().int().positive(),
  position: z.number().int().nonnegative(),
});

export type List = z.infer<typeof ListSchema>;
export type CreateListInput = z.infer<typeof CreateListSchema>;
export type UpdateListInput = z.infer<typeof UpdateListSchema>;
export type UpdateListPositionInput = z.infer<typeof UpdateListPositionSchema>;
