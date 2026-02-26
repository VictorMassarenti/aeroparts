import { createStore } from "zustand/vanilla";

import { formatSequence, generateId } from "@/lib/aero-utils";

import type {
  AccountPayable,
  AccountReceivable,
  Customer,
  InventoryLot,
  InventoryMovement,
  Invoice,
  InvoiceItem,
  Part,
  PurchaseOrder,
  Quote,
  Vendor,
} from "./types";

// ============================================================================
// State Type
// ============================================================================

export type AeroState = {
  // Entities
  parts: Part[];
  inventoryLots: InventoryLot[];
  inventoryMovements: InventoryMovement[];
  customers: Customer[];
  vendors: Vendor[];
  quotes: Quote[];
  invoices: Invoice[];
  purchaseOrders: PurchaseOrder[];
  accountsPayable: AccountPayable[];
  accountsReceivable: AccountReceivable[];

  // Sequence counters
  nextQuoteSeq: number;
  nextInvoiceSeq: number;
  nextPOSeq: number;

  // Parts CRUD
  addPart: (part: Omit<Part, "id" | "createdAt" | "updatedAt">) => void;
  updatePart: (id: string, updates: Partial<Part>) => void;
  deletePart: (id: string) => void;

  // Inventory CRUD
  addInventoryLot: (lot: Omit<InventoryLot, "id" | "createdAt" | "updatedAt">) => void;
  updateInventoryLot: (id: string, updates: Partial<InventoryLot>) => void;
  deleteInventoryLot: (id: string) => void;

  // Customers CRUD
  addCustomer: (customer: Omit<Customer, "id" | "createdAt" | "updatedAt">) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Vendors CRUD
  addVendor: (vendor: Omit<Vendor, "id" | "createdAt" | "updatedAt">) => void;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;

  // Quotes CRUD
  addQuote: (quote: Omit<Quote, "id" | "quoteNumber" | "createdAt" | "updatedAt">) => void;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;

  // Invoices CRUD
  addInvoice: (invoice: Omit<Invoice, "id" | "invoiceNumber" | "createdAt" | "updatedAt">) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;

  // Purchase Orders CRUD
  addPurchaseOrder: (po: Omit<PurchaseOrder, "id" | "poNumber" | "createdAt" | "updatedAt">) => void;
  updatePurchaseOrder: (id: string, updates: Partial<PurchaseOrder>) => void;
  deletePurchaseOrder: (id: string) => void;

  // Accounts Payable CRUD
  updateAccountPayable: (id: string, updates: Partial<AccountPayable>) => void;

  // Accounts Receivable CRUD
  updateAccountReceivable: (id: string, updates: Partial<AccountReceivable>) => void;

  // Workflow actions
  convertQuoteToInvoice: (quoteId: string) => void;
  markInvoicePaid: (invoiceId: string) => void;
  receivePurchaseOrder: (poId: string) => void;
};

// ============================================================================
// Store Creator
// ============================================================================

const STORAGE_KEY = "aero-sales-poc";

function loadFromStorage(): Partial<AeroState> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export const createAeroStore = (init?: Partial<AeroState>) => {
  const stored = loadFromStorage();

  const store = createStore<AeroState>()((set, get) => ({
    // Initial state
    parts: init?.parts ?? stored.parts ?? [],
    inventoryLots: init?.inventoryLots ?? stored.inventoryLots ?? [],
    inventoryMovements: init?.inventoryMovements ?? stored.inventoryMovements ?? [],
    customers: init?.customers ?? stored.customers ?? [],
    vendors: init?.vendors ?? stored.vendors ?? [],
    quotes: init?.quotes ?? stored.quotes ?? [],
    invoices: init?.invoices ?? stored.invoices ?? [],
    purchaseOrders: init?.purchaseOrders ?? stored.purchaseOrders ?? [],
    accountsPayable: init?.accountsPayable ?? stored.accountsPayable ?? [],
    accountsReceivable: init?.accountsReceivable ?? stored.accountsReceivable ?? [],
    nextQuoteSeq: init?.nextQuoteSeq ?? stored.nextQuoteSeq ?? 1,
    nextInvoiceSeq: init?.nextInvoiceSeq ?? stored.nextInvoiceSeq ?? 1,
    nextPOSeq: init?.nextPOSeq ?? stored.nextPOSeq ?? 1,

    // Parts CRUD
    addPart: (part) =>
      set((state) => ({
        parts: [
          ...state.parts,
          {
            ...part,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      })),

    updatePart: (id, updates) =>
      set((state) => ({
        parts: state.parts.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)),
      })),

    deletePart: (id) =>
      set((state) => ({
        parts: state.parts.filter((p) => p.id !== id),
      })),

    // Inventory CRUD
    addInventoryLot: (lot) =>
      set((state) => ({
        inventoryLots: [
          ...state.inventoryLots,
          {
            ...lot,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      })),

    updateInventoryLot: (id, updates) =>
      set((state) => ({
        inventoryLots: state.inventoryLots.map((l) =>
          l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l,
        ),
      })),

    deleteInventoryLot: (id) =>
      set((state) => ({
        inventoryLots: state.inventoryLots.filter((l) => l.id !== id),
      })),

    // Customers CRUD
    addCustomer: (customer) =>
      set((state) => ({
        customers: [
          ...state.customers,
          {
            ...customer,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      })),

    updateCustomer: (id, updates) =>
      set((state) => ({
        customers: state.customers.map((c) =>
          c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c,
        ),
      })),

    deleteCustomer: (id) =>
      set((state) => ({
        customers: state.customers.filter((c) => c.id !== id),
      })),

    // Vendors CRUD
    addVendor: (vendor) =>
      set((state) => ({
        vendors: [
          ...state.vendors,
          {
            ...vendor,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      })),

    updateVendor: (id, updates) =>
      set((state) => ({
        vendors: state.vendors.map((v) =>
          v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v,
        ),
      })),

    deleteVendor: (id) =>
      set((state) => ({
        vendors: state.vendors.filter((v) => v.id !== id),
      })),

    // Quotes CRUD
    addQuote: (quote) =>
      set((state) => {
        const quoteNumber = formatSequence("QT", state.nextQuoteSeq);
        return {
          quotes: [
            ...state.quotes,
            {
              ...quote,
              id: generateId(),
              quoteNumber,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          nextQuoteSeq: state.nextQuoteSeq + 1,
        };
      }),

    updateQuote: (id, updates) =>
      set((state) => ({
        quotes: state.quotes.map((q) => (q.id === id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q)),
      })),

    deleteQuote: (id) =>
      set((state) => ({
        quotes: state.quotes.filter((q) => q.id !== id),
      })),

    // Invoices CRUD
    addInvoice: (invoice) =>
      set((state) => {
        const invoiceNumber = formatSequence("INV", state.nextInvoiceSeq);
        return {
          invoices: [
            ...state.invoices,
            {
              ...invoice,
              id: generateId(),
              invoiceNumber,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          nextInvoiceSeq: state.nextInvoiceSeq + 1,
        };
      }),

    updateInvoice: (id, updates) =>
      set((state) => ({
        invoices: state.invoices.map((inv) =>
          inv.id === id ? { ...inv, ...updates, updatedAt: new Date().toISOString() } : inv,
        ),
      })),

    deleteInvoice: (id) =>
      set((state) => ({
        invoices: state.invoices.filter((inv) => inv.id !== id),
      })),

    // Purchase Orders CRUD
    addPurchaseOrder: (po) =>
      set((state) => {
        const poNumber = formatSequence("PO", state.nextPOSeq);
        return {
          purchaseOrders: [
            ...state.purchaseOrders,
            {
              ...po,
              id: generateId(),
              poNumber,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          nextPOSeq: state.nextPOSeq + 1,
        };
      }),

    updatePurchaseOrder: (id, updates) =>
      set((state) => ({
        purchaseOrders: state.purchaseOrders.map((po) =>
          po.id === id ? { ...po, ...updates, updatedAt: new Date().toISOString() } : po,
        ),
      })),

    deletePurchaseOrder: (id) =>
      set((state) => ({
        purchaseOrders: state.purchaseOrders.filter((po) => po.id !== id),
      })),

    // Accounts Payable CRUD
    updateAccountPayable: (id, updates) =>
      set((state) => ({
        accountsPayable: state.accountsPayable.map((ap) =>
          ap.id === id ? { ...ap, ...updates, updatedAt: new Date().toISOString() } : ap,
        ),
      })),

    // Accounts Receivable CRUD
    updateAccountReceivable: (id, updates) =>
      set((state) => ({
        accountsReceivable: state.accountsReceivable.map((ar) =>
          ar.id === id ? { ...ar, ...updates, updatedAt: new Date().toISOString() } : ar,
        ),
      })),

    // Workflow: Convert Quote to Invoice
    convertQuoteToInvoice: (quoteId) => {
      const state = get();
      const quote = state.quotes.find((q) => q.id === quoteId);
      if (!quote) return;

      const invoiceNumber = formatSequence("INV", state.nextInvoiceSeq);
      const now = new Date().toISOString();
      const customer = state.customers.find((c) => c.id === quote.customerId);
      const paymentTerms = customer?.paymentTerms ?? "Net 30";
      const termsDays = Number.parseInt(paymentTerms.replace(/\D/g, ""), 10) || 30;
      const dueDate = new Date(Date.now() + termsDays * 24 * 60 * 60 * 1000).toISOString();

      const items: InvoiceItem[] = quote.items.map((item) => ({ ...item, id: generateId() }));
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.08; // 8% tax
      const wireCcFee = 0;
      const total = subtotal + quote.shipping + tax + wireCcFee;

      const invoice: Invoice = {
        id: generateId(),
        invoiceNumber,
        quoteId: quote.id,
        customerId: quote.customerId,
        customerName: quote.customerName,
        items,
        shipping: quote.shipping,
        tax,
        wireCcFee,
        subtotal,
        total,
        dueDate,
        status: "Issued",
        createdAt: now,
        updatedAt: now,
      };

      const ar: AccountReceivable = {
        id: generateId(),
        customerId: quote.customerId,
        customerName: quote.customerName,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        dueDate,
        amount: total,
        status: "Pending",
        paidAmount: 0,
        createdAt: now,
        updatedAt: now,
      };

      set((state) => ({
        invoices: [...state.invoices, invoice],
        accountsReceivable: [...state.accountsReceivable, ar],
        quotes: state.quotes.map((q) => (q.id === quoteId ? { ...q, status: "Won", updatedAt: now } : q)) as Quote[],
        nextInvoiceSeq: state.nextInvoiceSeq + 1,
      }));
    },

    // Workflow: Mark Invoice as Paid
    markInvoicePaid: (invoiceId) => {
      const state = get();
      const invoice = state.invoices.find((inv) => inv.id === invoiceId);
      if (!invoice) return;

      const now = new Date().toISOString();
      const movements: InventoryMovement[] = [];

      // Create OUT movements for each item
      invoice.items.forEach((item) => {
        // Find a lot with enough quantity
        const lot = state.inventoryLots.find((l) => l.partId === item.partId && l.quantity >= item.quantity);
        if (lot) {
          movements.push({
            id: generateId(),
            lotId: lot.id,
            partId: item.partId,
            type: "OUT",
            quantity: item.quantity,
            reference: `Invoice ${invoice.invoiceNumber}`,
            date: now,
          });
        }
      });

      set((state) => ({
        invoices: state.invoices.map((inv) =>
          inv.id === invoiceId ? { ...inv, status: "Paid", paidDate: now, updatedAt: now } : inv,
        ) as Invoice[],
        accountsReceivable: state.accountsReceivable.map((ar) =>
          ar.invoiceId === invoiceId ? { ...ar, status: "Paid", paidAmount: ar.amount, updatedAt: now } : ar,
        ) as AccountReceivable[],
        inventoryMovements: [...state.inventoryMovements, ...movements],
        inventoryLots: state.inventoryLots.map((lot) => {
          const movement = movements.find((m) => m.lotId === lot.id);
          if (movement) {
            return { ...lot, quantity: lot.quantity - movement.quantity, updatedAt: now };
          }
          return lot;
        }),
      }));
    },

    // Workflow: Receive Purchase Order
    receivePurchaseOrder: (poId) => {
      const state = get();
      const po = state.purchaseOrders.find((p) => p.id === poId);
      if (!po) return;

      const now = new Date().toISOString();
      const newLots: InventoryLot[] = [];
      const movements: InventoryMovement[] = [];

      po.items.forEach((item) => {
        const part = state.parts.find((p) => p.id === item.partId);
        if (!part) return;

        const lotId = generateId();
        const lot: InventoryLot = {
          id: lotId,
          partId: item.partId,
          pn: item.pn,
          quantity: item.quantity,
          unitCost: item.unitCost,
          supplierId: po.vendorId,
          supplierName: po.vendorName,
          entryDate: now,
          location: "Main Warehouse",
          minimumStock: 1,
          createdAt: now,
          updatedAt: now,
        };

        const movement: InventoryMovement = {
          id: generateId(),
          lotId,
          partId: item.partId,
          type: "IN",
          quantity: item.quantity,
          reference: `PO ${po.poNumber}`,
          date: now,
        };

        newLots.push(lot);
        movements.push(movement);
      });

      const vendor = state.vendors.find((v) => v.id === po.vendorId);
      const paymentTerms = vendor?.leadTime ?? "Net 30";
      const termsDays = Number.parseInt(paymentTerms.replace(/\D/g, ""), 10) || 30;
      const dueDate = new Date(Date.now() + termsDays * 24 * 60 * 60 * 1000).toISOString();

      const ap: AccountPayable = {
        id: generateId(),
        vendorId: po.vendorId,
        vendorName: po.vendorName,
        vendorInvoiceNumber: `VINV-${po.poNumber}`,
        poId: po.id,
        poNumber: po.poNumber,
        dueDate,
        amount: po.totalLandedCost,
        currency: vendor?.currency ?? "USD",
        status: "Pending",
        paidAmount: 0,
        createdAt: now,
        updatedAt: now,
      };

      set((state) => ({
        purchaseOrders: state.purchaseOrders.map((p) =>
          p.id === poId ? { ...p, status: "Received", updatedAt: now } : p,
        ) as PurchaseOrder[],
        inventoryLots: [...state.inventoryLots, ...newLots],
        inventoryMovements: [...state.inventoryMovements, ...movements],
        accountsPayable: [...state.accountsPayable, ap],
      }));
    },
  }));

  // Subscribe to changes and persist to localStorage
  if (typeof window !== "undefined") {
    store.subscribe((state) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save to localStorage:", error);
      }
    });
  }

  return store;
};
