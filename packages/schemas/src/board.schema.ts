import { z } from "zod";

export const BoardSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1, "O nome do quadro é obrigatório"),
  description: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const BoardMemberSchema = z.object({
  id: z.number().int().positive().optional(),
  boardId: z.number().int().positive(),
  userId: z.number().int().positive(),
  role: z.enum(["OWNER", "MEMBER"]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateBoardSchema = BoardSchema.pick({
  name: true,
  description: true,
});

export const UpdateBoardSchema = BoardSchema.pick({
  name: true,
  description: true,
}).partial();

export type Board = z.infer<typeof BoardSchema>;
export type BoardMember = z.infer<typeof BoardMemberSchema>;
export type CreateBoardInput = z.infer<typeof CreateBoardSchema>;
export type UpdateBoardInput = z.infer<typeof UpdateBoardSchema>;
