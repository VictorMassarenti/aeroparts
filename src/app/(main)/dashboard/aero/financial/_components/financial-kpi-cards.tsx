"use client";

import { ArrowDownRight, ArrowUpRight, CreditCard, DollarSign } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useAeroStore } from "@/stores/aero/aero-provider";

export function FinancialKpiCards() {
  const invoices = useAeroStore((state) => state.invoices);
  const accountsPayable = useAeroStore((state) => state.accountsPayable);
  const accountsReceivable = useAeroStore((state) => state.accountsReceivable);

  const revenue = invoices.filter((inv) => inv.status === "Paid").reduce((sum, inv) => sum + inv.total, 0);

  const expenses = accountsPayable.filter((ap) => ap.status === "Paid").reduce((sum, ap) => sum + ap.amount, 0);

  const netReceivables = accountsReceivable
    .filter((ar) => ar.status !== "Paid")
    .reduce((sum, ar) => sum + (ar.amount - ar.paidAmount), 0);

  const netPayables = accountsPayable
    .filter((ap) => ap.status !== "Paid")
    .reduce((sum, ap) => sum + (ap.amount - ap.paidAmount), 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Total Revenue</CardTitle>
          <DollarSign className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{formatCurrency(revenue)}</div>
          <p className="text-muted-foreground text-xs">Paid invoices</p>
        </CardContent>
      </Card>

      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Total Expenses</CardTitle>
          <CreditCard className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{formatCurrency(expenses)}</div>
          <p className="text-muted-foreground text-xs">Paid A/P</p>
        </CardContent>
      </Card>

      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Net Receivables</CardTitle>
          <ArrowDownRight className="size-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl text-green-600">{formatCurrency(netReceivables)}</div>
          <p className="text-muted-foreground text-xs">Outstanding A/R</p>
        </CardContent>
      </Card>

      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Net Payables</CardTitle>
          <ArrowUpRight className="size-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl text-destructive">{formatCurrency(netPayables)}</div>
          <p className="text-muted-foreground text-xs">Outstanding A/P</p>
        </CardContent>
      </Card>
    </div>
  );
}
