import { z } from "zod";

const quoteItemSchema = z.object({
  id: z.string(),
  partId: z.string(),
  pn: z.string(),
  description: z.string(),
  condition: z.enum(["NEW", "OH", "SV", "AR", "NS", "REP"]),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  total: z.number(),
});

export const quoteSchema = z.object({
  id: z.string(),
  quoteNumber: z.string(),
  customerId: z.string().min(1, "Customer is required"),
  customerName: z.string(),
  items: z.array(quoteItemSchema).min(1, "At least one item is required"),
  leadTime: z.string().min(1, "Lead time is required"),
  shipping: z.number().min(0),
  validUntil: z.string().min(1, "Valid until date is required"),
  status: z.enum(["Draft", "Sent", "Won", "Lost"]),
  notes: z.string().optional(),
});

export type QuoteFormData = z.infer<typeof quoteSchema>;
