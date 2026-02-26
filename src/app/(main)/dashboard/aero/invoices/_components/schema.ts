import { z } from "zod";

// Invoice schema is read-only as invoices are created from quotes
// This is just for type checking
export const invoiceSchema = z.object({
  id: z.string(),
  invoiceNumber: z.string(),
  quoteId: z.string().optional(),
  customerId: z.string(),
  customerName: z.string(),
  items: z.array(
    z.object({
      id: z.string(),
      partId: z.string(),
      pn: z.string(),
      description: z.string(),
      condition: z.enum(["NEW", "OH", "SV", "AR", "NS", "REP"]),
      quantity: z.number(),
      unitPrice: z.number(),
      total: z.number(),
    }),
  ),
  shipping: z.number(),
  tax: z.number(),
  wireCcFee: z.number(),
  subtotal: z.number(),
  total: z.number(),
  dueDate: z.string(),
  status: z.enum(["Draft", "Issued", "Paid", "Overdue", "Cancelled"]),
  paidDate: z.string().optional(),
});

export type InvoiceData = z.infer<typeof invoiceSchema>;
