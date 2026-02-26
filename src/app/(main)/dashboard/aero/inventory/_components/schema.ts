import { z } from "zod";

export const inventoryLotSchema = z.object({
  id: z.string(),
  partId: z.string().min(1, "Part is required"),
  pn: z.string(),
  serialNumber: z.string().optional(),
  batchLot: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitCost: z.number().min(0, "Cost must be at least 0"),
  supplierId: z.string().min(1, "Supplier is required"),
  supplierName: z.string(),
  invoiceNumber: z.string().optional(),
  entryDate: z.string(),
  location: z.string().min(1, "Location is required"),
  certificateFileName: z.string().optional(),
  minimumStock: z.number().min(0),
});

export type InventoryLotFormData = z.infer<typeof inventoryLotSchema>;
