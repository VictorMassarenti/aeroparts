"use client";
"use no memo";

import { useState } from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { useAeroStore } from "@/stores/aero/aero-provider";
import type { AccountPayable } from "@/stores/aero/types";

import { APPaymentDrawer } from "./ap-payment-drawer";
import { createAPColumns } from "./columns";

export function APTable() {
  const accountsPayable = useAeroStore((state) => state.accountsPayable);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAP, setSelectedAP] = useState<AccountPayable | undefined>();

  const handleView = (ap: AccountPayable) => {
    setSelectedAP(ap);
    setDrawerOpen(true);
  };

  const columns = createAPColumns(handleView);
  const table = useDataTableInstance({
    data: accountsPayable,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Accounts Payable</CardTitle>
          <CardDescription>
            Manage vendor payables. A/P entries are created automatically when POs are received.
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

      <APPaymentDrawer open={drawerOpen} onOpenChange={setDrawerOpen} ap={selectedAP} />
    </>
  );
}
