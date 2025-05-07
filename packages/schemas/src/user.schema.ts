import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  username: z.string().min(3),
  name: z.string().min(1),
});

export const GetAllUsersSchema = z.object({
  data: z.array(UserSchema),
});

export type User = z.infer<typeof UserSchema>;
export type GetAllUsers = z.infer<typeof GetAllUsersSchema>;
