"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { getAgingBucket } from "@/lib/aero-utils";
import { useAeroStore } from "@/stores/aero/aero-provider";

const chartConfig = {
  amount: {
    label: "Amount",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

export function PayablesAging() {
  const accountsPayable = useAeroStore((state) => state.accountsPayable);

  const buckets = { "0-30": 0, "31-60": 0, "61+": 0 };

  accountsPayable
    .filter((ap) => ap.status !== "Paid")
    .forEach((ap) => {
      const bucket = getAgingBucket(ap.dueDate);
      buckets[bucket] += ap.amount - ap.paidAmount;
    });

  const chartData = [
    { bucket: "0-30 days", amount: buckets["0-30"] },
    { bucket: "31-60 days", amount: buckets["31-60"] },
    { bucket: "61+ days", amount: buckets["61+"] },
  ];

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Payables Aging</CardTitle>
        <CardDescription>Outstanding A/P by age</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid horizontal={false} />
            <YAxis dataKey="bucket" type="category" tickLine={false} axisLine={false} width={80} />
            <XAxis type="number" hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
