import { email, z } from 'zod';

export const registerSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[\W_]/, { message: 'Password must contain at least one special character' }),
  name: z.string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;