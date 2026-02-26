"use client";

import { useState } from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatCurrency } from "@/lib/utils";
import { useAeroStore } from "@/stores/aero/aero-provider";
import type { AccountPayable } from "@/stores/aero/types";

interface APPaymentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ap?: AccountPayable;
}

export function APPaymentDrawer({ open, onOpenChange, ap }: APPaymentDrawerProps) {
  const isMobile = useIsMobile();
  const updateAccountPayable = useAeroStore((state) => state.updateAccountPayable);
  const [paymentAmount, setPaymentAmount] = useState("");

  if (!ap) return null;

  const remainingBalance = ap.amount - ap.paidAmount;

  const handleRecordPayment = () => {
    const payment = Number.parseFloat(paymentAmount) || 0;
    if (payment <= 0 || payment > remainingBalance) {
      toast.error("Invalid payment amount");
      return;
    }

    const newPaidAmount = ap.paidAmount + payment;
    const newStatus = newPaidAmount >= ap.amount ? ("Paid" as const) : ("Partial" as const);

    updateAccountPayable(ap.id, {
      paidAmount: newPaidAmount,
      status: newStatus,
    });

    toast.success("Payment recorded successfully");
    onOpenChange(false);
    setPaymentAmount("");
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={isMobile ? "bottom" : "right"}>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Account Payable</DrawerTitle>
          <DrawerDescription>Record payment for vendor invoice</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4 px-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Vendor</p>
              <p className="font-medium">{ap.vendorName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Vendor Invoice#</p>
              <p className="font-medium">{ap.vendorInvoiceNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">PO#</p>
              <p className="font-medium">{ap.poNumber || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Due Date</p>
              <p className="font-medium">{new Date(ap.dueDate).toLocaleDateString()}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-medium tabular-nums">{formatCurrency(ap.amount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Paid Amount</span>
              <span className="font-medium tabular-nums">{formatCurrency(ap.paidAmount)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-bold">
              <span>Remaining Balance</span>
              <span className="tabular-nums">{formatCurrency(remainingBalance)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={ap.status === "Paid" ? "default" : ap.status === "Partial" ? "secondary" : "outline"}>
              {ap.status}
            </Badge>
            <span className="text-muted-foreground text-sm">{ap.currency}</span>
          </div>

          {ap.status !== "Paid" && (
            <>
              <Separator />
              <div className="flex flex-col gap-3">
                <Label htmlFor="payment">Record Payment</Label>
                <Input
                  id="payment"
                  type="number"
                  step="0.01"
                  min="0"
                  max={remainingBalance}
                  placeholder={`Max: ${formatCurrency(remainingBalance)}`}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <DrawerFooter>
          {ap.status !== "Paid" && (
            <Button onClick={handleRecordPayment} disabled={!paymentAmount}>
              Record Payment
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
