import { z } from "zod";

export const customerSchema = z.object({
  id: z.string(),
  companyName: z.string().min(1, "Company name is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  emails: z.array(z.string().email()).min(1, "At least one email is required"),
  phone: z.string().min(1, "Phone is required"),
  billingAddress: z.string().min(1, "Billing address is required"),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  taxId: z.string().min(1, "Tax ID is required"),
  paymentTerms: z.enum(["Net 15", "Net 30", "Net 45", "Net 60", "COD", "Prepaid"]),
  creditLimit: z.number().min(0),
  status: z.enum(["Active", "Inactive", "Suspended"]),
  notes: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
