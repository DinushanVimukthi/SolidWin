import { z } from "zod";

const phone = z
  .string()
  .trim()
  .min(1, "Enter your phone number")
  .refine((v) => /^[+\d\s()-]+$/.test(v), "Use digits, spaces, + or - only")
  .refine((v) => {
    const digits = v.replace(/\D/g, "").length;
    return digits >= 7 && digits <= 15;
  }, "Enter a valid phone number");

export const rfqSchema = z.object({
  // Contact details
  fullName: z.string().trim().min(2, "Enter your name").max(100),
  phone,
  email: z.string().trim().email("Enter a valid email address"),
  companyName: z.string().trim().optional(),

  // Project details
  serviceDivision: z.enum(["construction", "ready-mix", "hardware"], {
    message: "Select a division",
  }),
  projectLocation: z.string().trim().min(2, "Enter project location / site address"),
  estimatedBudget: z.string().trim().optional(),
  targetStartDate: z.string().trim().optional(),

  // Ready-Mix specific fields (RMC-04)
  concreteGrade: z.string().optional(),
  concreteVolumeM3: z.string().optional(),
  pumpTruckRequired: z.boolean().optional(),
  targetPourDate: z.string().optional(),
  pourTimeSlot: z.string().optional(),
  siteAccessRestrictions: z.string().optional(),

  // Construction & Hardware specific fields
  constructionType: z.string().optional(),
  hardwareItemsList: z.string().optional(),

  // General scope & description
  projectDescription: z
    .string()
    .trim()
    .min(10, "Please describe your project scope (minimum 10 characters)")
    .max(3000),
});

export type RfqInput = z.infer<typeof rfqSchema>;
