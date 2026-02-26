"use client";

import { AlertCircle, DollarSign, Package, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useAeroStore } from "@/stores/aero/aero-provider";

export function InventoryKpiCards() {
  const inventoryLots = useAeroStore((state) => state.inventoryLots);

  const totalItems = inventoryLots.reduce((sum, lot) => sum + lot.quantity, 0);
  const totalValue = inventoryLots.reduce((sum, lot) => sum + lot.quantity * lot.unitCost, 0);
  const lowStockCount = inventoryLots.filter((lot) => lot.quantity < lot.minimumStock).length;
  const uniqueParts = new Set(inventoryLots.map((lot) => lot.partId)).size;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Total Items</CardTitle>
          <Package className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{totalItems}</div>
          <p className="text-muted-foreground text-xs">{uniqueParts} unique parts</p>
        </CardContent>
      </Card>

      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Total Value</CardTitle>
          <DollarSign className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{formatCurrency(totalValue)}</div>
          <p className="text-muted-foreground text-xs">Inventory valuation</p>
        </CardContent>
      </Card>

      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Low Stock Alerts</CardTitle>
          <AlertCircle className="size-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl text-destructive">{lowStockCount}</div>
          <p className="text-muted-foreground text-xs">Items below minimum</p>
        </CardContent>
      </Card>

      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Avg Unit Cost</CardTitle>
          <TrendingUp className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">
            {formatCurrency(inventoryLots.length > 0 ? totalValue / totalItems : 0)}
          </div>
          <p className="text-muted-foreground text-xs">Average cost per unit</p>
        </CardContent>
      </Card>
    </div>
  );
}
