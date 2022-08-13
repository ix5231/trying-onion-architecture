import { z } from 'zod';

export const loginAccountValidator = z.object({
  id: z.string(),
  password: z.string(),
});

export type LoginAccount = z.infer<typeof loginAccountValidator>;