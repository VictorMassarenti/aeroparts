import { z } from "zod";

const poItemSchema = z.object({
  id: z.string(),
  partId: z.string(),
  pn: z.string(),
  description: z.string(),
  condition: z.enum(["NEW", "OH", "SV", "AR", "NS", "REP"]),
  quantity: z.number().min(1),
  unitCost: z.number().min(0),
  total: z.number(),
});

export const purchaseOrderSchema = z.object({
  id: z.string(),
  poNumber: z.string(),
  vendorId: z.string().min(1, "Vendor is required"),
  vendorName: z.string(),
  items: z.array(poItemSchema).min(1, "At least one item is required"),
  shippingCost: z.number().min(0),
  taxes: z.number().min(0),
  totalLandedCost: z.number(),
  status: z.enum(["Draft", "Sent", "Shipped", "Received", "Closed", "Cancelled"]),
});

export type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>;
