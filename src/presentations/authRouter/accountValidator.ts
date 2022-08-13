import { z } from 'zod';

export const accountValidator = z.object({
  id: z.string(),
  password: z.string(),
});