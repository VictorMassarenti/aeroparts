"use client";
"use no memo";

import { useState } from "react";

import { toast } from "sonner";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { useAeroStore } from "@/stores/aero/aero-provider";
import type { Invoice } from "@/stores/aero/types";

import { DeleteConfirmDialog } from "../../_components/delete-confirm-dialog";
import { createInvoicesColumns } from "./columns";
import { InvoiceViewDrawer } from "./invoice-view-drawer";

export function InvoicesTable() {
  const invoices = useAeroStore((state) => state.invoices);
  const deleteInvoice = useAeroStore((state) => state.deleteInvoice);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | undefined>();

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDrawerOpen(true);
  };

  const handleDelete = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (invoiceToDelete) {
      deleteInvoice(invoiceToDelete.id);
      toast.success("Invoice deleted successfully");
      setDeleteDialogOpen(false);
      setInvoiceToDelete(undefined);
    }
  };

  const columns = createInvoicesColumns(handleView, handleDelete);
  const table = useDataTableInstance({
    data: invoices,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>View and manage customer invoices. Invoices are created from won quotes.</CardDescription>
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

      <InvoiceViewDrawer open={drawerOpen} onOpenChange={setDrawerOpen} invoice={selectedInvoice} />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Invoice?"
        description={`Are you sure you want to delete invoice ${invoiceToDelete?.invoiceNumber}? This action cannot be undone.`}
      />
    </>
  );
}
