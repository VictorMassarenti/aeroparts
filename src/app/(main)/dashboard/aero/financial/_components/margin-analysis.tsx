"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useAeroStore } from "@/stores/aero/aero-provider";

export function MarginAnalysis() {
  const invoices = useAeroStore((state) => state.invoices);
  const inventoryLots = useAeroStore((state) => state.inventoryLots);

  // Calculate margins by part
  const marginsByPart: Record<string, { pn: string; revenue: number; cogs: number; count: number }> = {};

  invoices
    .filter((inv) => inv.status === "Paid")
    .forEach((inv) => {
      inv.items.forEach((item) => {
        if (!marginsByPart[item.pn]) {
          marginsByPart[item.pn] = { pn: item.pn, revenue: 0, cogs: 0, count: 0 };
        }

        const lot = inventoryLots.find((l) => l.partId === item.partId);
        const cost = lot ? lot.unitCost * item.quantity : 0;

        marginsByPart[item.pn].revenue += item.total;
        marginsByPart[item.pn].cogs += cost;
        marginsByPart[item.pn].count += 1;
      });
    });

  const topMargins = Object.values(marginsByPart)
    .map((m) => ({
      ...m,
      margin: m.revenue - m.cogs,
      marginPercent: m.revenue > 0 ? ((m.revenue - m.cogs) / m.revenue) * 100 : 0,
    }))
    .sort((a, b) => b.margin - a.margin)
    .slice(0, 10);

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Margin Analysis</CardTitle>
        <CardDescription>Top 10 parts by gross margin</CardDescription>
      </CardHeader>
      <CardContent>
        {topMargins.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">No sales data yet</p>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-2 text-left font-medium">Part Number</th>
                  <th className="p-2 text-right font-medium">Revenue</th>
                  <th className="p-2 text-right font-medium">COGS</th>
                  <th className="p-2 text-right font-medium">Margin</th>
                  <th className="p-2 text-right font-medium">Margin %</th>
                </tr>
              </thead>
              <tbody>
                {topMargins.map((m) => (
                  <tr key={m.pn} className="border-b last:border-0">
                    <td className="p-2 font-medium">{m.pn}</td>
                    <td className="p-2 text-right">{formatCurrency(m.revenue)}</td>
                    <td className="p-2 text-right">{formatCurrency(m.cogs)}</td>
                    <td className="p-2 text-right font-medium">{formatCurrency(m.margin)}</td>
                    <td className="p-2 text-right">
                      <span
                        className={
                          m.marginPercent >= 30
                            ? "text-green-600"
                            : m.marginPercent >= 15
                              ? "text-yellow-600"
                              : "text-destructive"
                        }
                      >
                        {m.marginPercent.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
