import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().email("This is not a valid email"),
  password: z
    .string()
    .min(8, "Password too short")
    .max(50, "Password too long"),
});

export type LoginForm = z.infer<typeof LoginFormSchema>;

export const SignupFormSchema = z.object({
  firstName: z.string().min(1, "Name too short").max(100, "Name too long"),
  lastName: z.string().min(1, "Name too short").max(100, "Name too long"),
  email: z.string().email("This is not a valid email"),
  password: z
    .string()
    .min(8, "Password too short")
    .max(50, "Password too long")
    .regex(
      /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/,
      "Password should be minimum eight characters, at least one uppercase letter, one lowercase letter and one number"
    ),
  confirmPassword: z
    .string()
    .min(8, "Password too short")
    .max(50, "Password too long"),
  doctorCode: z.string().optional(),
});

export type SignupForm = z.infer<typeof SignupFormSchema>;
