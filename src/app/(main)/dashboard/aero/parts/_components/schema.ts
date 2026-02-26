import { z } from "zod";

export const partSchema = z.object({
  id: z.string(),
  pn: z.string().min(1, "Part number is required"),
  description: z.string().min(1, "Description is required"),
  ataChapter: z.string().min(1, "ATA Chapter is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  condition: z.enum(["NEW", "OH", "SV", "AR", "NS", "REP"]),
  unitOfMeasure: z.enum(["EA", "LB", "GAL", "FT", "SET", "KIT"]),
  traceabilityRequired: z.boolean().default(false),
  shelfLife: z.boolean().default(false),
  hazardous: z.boolean().default(false),
  alternatePn: z.string().optional(),
  supersededPn: z.string().optional(),
});

export type PartFormData = z.infer<typeof partSchema>;
