import { z } from "zod";

/** International phone check: digits, spaces, +, -, parentheses; 7 to 15 digits when provided. */
const phoneOptional = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || /^[+\d\s()-]+$/.test(v), "Use digits, spaces, + or - only")
  .refine((v) => {
    if (!v) return true;
    const digits = v.replace(/\D/g, "").length;
    return digits >= 7 && digits <= 15;
  }, "Enter a valid phone number");

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  phone: phoneOptional,
  email: z.string().trim().email("Enter a valid email address"),
  division: z.string().trim().optional(),
  message: z.string().trim().min(10, "Tell us a little more (10 characters minimum)").max(2000),
  consent: z.boolean(),
});

export type ContactInput = z.infer<typeof contactSchema>;

