"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useAeroStore } from "@/stores/aero/aero-provider";

const chartConfig = {
  paid: {
    label: "Paid",
    color: "hsl(var(--primary))",
  },
  issued: {
    label: "Issued",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig;

export function BillingOverview() {
  const invoices = useAeroStore((state) => state.invoices);

  // Group by month
  const monthlyData: Record<string, { month: string; paid: number; issued: number }> = {};

  invoices.forEach((inv) => {
    const date = new Date(inv.createdAt);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    const monthLabel = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { month: monthLabel, paid: 0, issued: 0 };
    }

    if (inv.status === "Paid") {
      monthlyData[monthKey].paid += inv.total;
    } else if (inv.status === "Issued" || inv.status === "Overdue") {
      monthlyData[monthKey].issued += inv.total;
    }
  });

  const chartData = Object.values(monthlyData).slice(-6);

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Billing Overview</CardTitle>
        <CardDescription>Paid vs Issued invoices by month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="paid" fill="var(--color-paid)" radius={4} />
            <Bar dataKey="issued" fill="var(--color-issued)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
