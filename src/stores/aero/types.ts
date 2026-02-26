// ============================================================================
// Enums (as union types)
// ============================================================================

export type PartCondition = "NEW" | "OH" | "SV" | "AR" | "NS" | "REP";

export type UnitOfMeasure = "EA" | "LB" | "GAL" | "FT" | "SET" | "KIT";

export type QuoteStatus = "Draft" | "Sent" | "Won" | "Lost";

export type InvoiceStatus = "Draft" | "Issued" | "Paid" | "Overdue" | "Cancelled";

export type POStatus = "Draft" | "Sent" | "Shipped" | "Received" | "Closed" | "Cancelled";

export type CustomerStatus = "Active" | "Inactive" | "Suspended";

export type PaymentTerms = "Net 15" | "Net 30" | "Net 45" | "Net 60" | "COD" | "Prepaid";

export type VendorRating = "A" | "B" | "C" | "Not Rated";

export type VendorCurrency = "USD" | "EUR" | "GBP" | "CAD";

export type APStatus = "Pending" | "Partial" | "Paid" | "Overdue";

export type ARStatus = "Pending" | "Partial" | "Paid" | "Overdue";

export type InventoryMovementType = "IN" | "OUT" | "ADJUSTMENT";

// ============================================================================
// Core Entities
// ============================================================================

export interface Part {
  id: string;
  pn: string;
  description: string;
  ataChapter: string;
  manufacturer: string;
  condition: PartCondition;
  unitOfMeasure: UnitOfMeasure;
  traceabilityRequired: boolean;
  shelfLife: boolean;
  hazardous: boolean;
  alternatePn?: string;
  supersededPn?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryLot {
  id: string;
  partId: string;
  pn: string;
  serialNumber?: string;
  batchLot?: string;
  quantity: number;
  unitCost: number;
  supplierId: string;
  supplierName: string;
  invoiceNumber?: string;
  entryDate: string;
  location: string;
  certificateFileName?: string;
  minimumStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovement {
  id: string;
  lotId: string;
  partId: string;
  type: InventoryMovementType;
  quantity: number;
  reference: string;
  date: string;
  notes?: string;
}

export interface Customer {
  id: string;
  companyName: string;
  contactPerson: string;
  emails: string[];
  phone: string;
  billingAddress: string;
  shippingAddress: string;
  taxId: string;
  paymentTerms: PaymentTerms;
  creditLimit: number;
  status: CustomerStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  companyName: string;
  contactPerson: string;
  emails: string[];
  phone: string;
  address: string;
  paymentMethod: string;
  leadTime: string;
  currency: VendorCurrency;
  rating: VendorRating;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  id: string;
  partId: string;
  pn: string;
  description: string;
  condition: PartCondition;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  items: QuoteItem[];
  leadTime: string;
  shipping: number;
  validUntil: string;
  status: QuoteStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  partId: string;
  pn: string;
  description: string;
  condition: PartCondition;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  quoteId?: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  shipping: number;
  tax: number;
  wireCcFee: number;
  subtotal: number;
  total: number;
  dueDate: string;
  status: InvoiceStatus;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface POItem {
  id: string;
  partId: string;
  pn: string;
  description: string;
  condition: PartCondition;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  items: POItem[];
  shippingCost: number;
  taxes: number;
  totalLandedCost: number;
  status: POStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AccountPayable {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorInvoiceNumber: string;
  poId?: string;
  poNumber?: string;
  dueDate: string;
  amount: number;
  currency: VendorCurrency;
  status: APStatus;
  paidAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AccountReceivable {
  id: string;
  customerId: string;
  customerName: string;
  invoiceId: string;
  invoiceNumber: string;
  dueDate: string;
  amount: number;
  status: ARStatus;
  paidAmount: number;
  createdAt: string;
  updatedAt: string;
}
