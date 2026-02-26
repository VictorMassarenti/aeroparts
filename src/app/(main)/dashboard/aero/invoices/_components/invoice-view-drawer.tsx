"use client";

import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatCurrency } from "@/lib/utils";
import { useAeroStore } from "@/stores/aero/aero-provider";
import type { Invoice } from "@/stores/aero/types";

interface InvoiceViewDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice;
}

export function InvoiceViewDrawer({ open, onOpenChange, invoice }: InvoiceViewDrawerProps) {
  const isMobile = useIsMobile();
  const markInvoicePaid = useAeroStore((state) => state.markInvoicePaid);

  if (!invoice) return null;

  const handleMarkPaid = () => {
    markInvoicePaid(invoice.id);
    toast.success("Invoice marked as paid. Inventory updated and A/R recorded.");
    onOpenChange(false);
  };

  const canMarkPaid = invoice.status === "Issued" || invoice.status === "Overdue";

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={isMobile ? "bottom" : "right"}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="gap-1">
          <DrawerTitle>Invoice {invoice.invoiceNumber}</DrawerTitle>
          <DrawerDescription>Invoice details and line items</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4 overflow-y-auto px-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Customer</p>
              <p className="font-medium">{invoice.customerName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Due Date</p>
              <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <div>
                <Badge
                  variant={
                    invoice.status === "Paid" ? "default" : invoice.status === "Overdue" ? "destructive" : "secondary"
                  }
                >
                  {invoice.status}
                </Badge>
              </div>
            </div>
            {invoice.paidDate && (
              <div>
                <p className="text-muted-foreground">Paid Date</p>
                <p className="font-medium">{new Date(invoice.paidDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 font-semibold">Line Items</h3>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="p-2 text-left font-medium">Part</th>
                    <th className="p-2 text-left font-medium">Condition</th>
                    <th className="w-24 p-2 text-right font-medium">Qty</th>
                    <th className="w-32 p-2 text-right font-medium">Unit Price</th>
                    <th className="w-32 p-2 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="p-2">
                        <div className="flex flex-col">
                          <span className="font-medium">{item.pn}</span>
                          <span className="text-muted-foreground text-xs">{item.description}</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline" className="text-xs">
                          {item.condition}
                        </Badge>
                      </td>
                      <td className="p-2 text-right">{item.quantity}</td>
                      <td className="p-2 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="p-2 text-right font-medium">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium tabular-nums">{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium tabular-nums">{formatCurrency(invoice.shipping)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-medium tabular-nums">{formatCurrency(invoice.tax)}</span>
            </div>
            {invoice.wireCcFee > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Wire/CC Fee</span>
                <span className="font-medium tabular-nums">{formatCurrency(invoice.wireCcFee)}</span>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between font-bold text-lg">
              <span>Total</span>
              <span className="tabular-nums">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        <DrawerFooter>
          {canMarkPaid && (
            <Button onClick={handleMarkPaid} variant="default" className="bg-green-600 hover:bg-green-700">
              Mark as Paid
            </Button>
          )}
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
