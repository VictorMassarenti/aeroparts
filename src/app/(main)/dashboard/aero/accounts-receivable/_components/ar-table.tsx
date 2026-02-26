"use client";
"use no memo";

import { useState } from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { useAeroStore } from "@/stores/aero/aero-provider";
import type { AccountReceivable } from "@/stores/aero/types";

import { ARPaymentDrawer } from "./ar-payment-drawer";
import { createARColumns } from "./columns";

export function ARTable() {
  const accountsReceivable = useAeroStore((state) => state.accountsReceivable);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAR, setSelectedAR] = useState<AccountReceivable | undefined>();

  const handleView = (ar: AccountReceivable) => {
    setSelectedAR(ar);
    setDrawerOpen(true);
  };

  const columns = createARColumns(handleView);
  const table = useDataTableInstance({
    data: accountsReceivable,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Accounts Receivable</CardTitle>
          <CardDescription>
            Manage customer receivables. A/R entries are created when invoices are generated.
          </CardDescription>
          <CardAction>
            <DataTableViewOptions table={table} />
          </CardAction>
        </CardHeader>
        <CardContent className="flex size-full flex-col gap-4">
          <div className="overflow-hidden rounded-md border">
            <DataTable table={table} columns={columns} />
          </div>
          <DataTablePagination table={table} />
        </CardContent>
      </Card>

      <ARPaymentDrawer open={drawerOpen} onOpenChange={setDrawerOpen} ar={selectedAR} />
    </>
  );
}
