import { z } from "zod";

export const vendorSchema = z.object({
  id: z.string(),
  companyName: z.string().min(1, "Company name is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  emails: z.array(z.string().email()).min(1, "At least one email is required"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  leadTime: z.string().min(1, "Lead time is required"),
  currency: z.enum(["USD", "EUR", "GBP", "CAD"]),
  rating: z.enum(["A", "B", "C", "Not Rated"]),
  notes: z.string().optional(),
});

export type VendorFormData = z.infer<typeof vendorSchema>;
