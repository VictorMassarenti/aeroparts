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
import type { AccountReceivable } from "@/stores/aero/types";

interface ARPaymentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ar?: AccountReceivable;
}

export function ARPaymentDrawer({ open, onOpenChange, ar }: ARPaymentDrawerProps) {
  const isMobile = useIsMobile();
  const updateAccountReceivable = useAeroStore((state) => state.updateAccountReceivable);
  const [paymentAmount, setPaymentAmount] = useState("");

  if (!ar) return null;

  const remainingBalance = ar.amount - ar.paidAmount;

  const handleRecordPayment = () => {
    const payment = Number.parseFloat(paymentAmount) || 0;
    if (payment <= 0 || payment > remainingBalance) {
      toast.error("Invalid payment amount");
      return;
    }

    const newPaidAmount = ar.paidAmount + payment;
    const newStatus = newPaidAmount >= ar.amount ? ("Paid" as const) : ("Partial" as const);

    updateAccountReceivable(ar.id, {
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
          <DrawerTitle>Account Receivable</DrawerTitle>
          <DrawerDescription>Record payment from customer</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4 px-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Customer</p>
              <p className="font-medium">{ar.customerName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Invoice#</p>
              <p className="font-medium">{ar.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Due Date</p>
              <p className="font-medium">{new Date(ar.dueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <div>
                <Badge variant={ar.status === "Paid" ? "default" : ar.status === "Partial" ? "secondary" : "outline"}>
                  {ar.status}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-medium tabular-nums">{formatCurrency(ar.amount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Paid Amount</span>
              <span className="font-medium tabular-nums">{formatCurrency(ar.paidAmount)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-bold">
              <span>Remaining Balance</span>
              <span className="tabular-nums">{formatCurrency(remainingBalance)}</span>
            </div>
          </div>

          {ar.status !== "Paid" && (
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
          {ar.status !== "Paid" && (
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
