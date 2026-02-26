"use client";
"use no memo";

import { useState } from "react";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { useAeroStore } from "@/stores/aero/aero-provider";
import type { PurchaseOrder } from "@/stores/aero/types";

import { DeleteConfirmDialog } from "../../_components/delete-confirm-dialog";
import { createPOColumns } from "./columns";
import { POFormDrawer } from "./po-form-drawer";

export function POTable() {
  const purchaseOrders = useAeroStore((state) => state.purchaseOrders);
  const deletePurchaseOrder = useAeroStore((state) => state.deletePurchaseOrder);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | undefined>();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [poToDelete, setPOToDelete] = useState<PurchaseOrder | undefined>();

  const handleEdit = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setDrawerMode("edit");
    setDrawerOpen(true);
  };

  const handleDelete = (po: PurchaseOrder) => {
    setPOToDelete(po);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (poToDelete) {
      deletePurchaseOrder(poToDelete.id);
      toast.success("Purchase order deleted successfully");
      setDeleteDialogOpen(false);
      setPOToDelete(undefined);
    }
  };

  const handleAdd = () => {
    setSelectedPO(undefined);
    setDrawerMode("create");
    setDrawerOpen(true);
  };

  const columns = createPOColumns(handleEdit, handleDelete);
  const table = useDataTableInstance({
    data: purchaseOrders,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
          <CardDescription>Manage vendor purchase orders and inventory receiving.</CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <DataTableViewOptions table={table} />
              <Button size="sm" onClick={handleAdd}>
                <Plus />
                <span className="hidden lg:inline">Create PO</span>
              </Button>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex size-full flex-col gap-4">
          <div className="overflow-hidden rounded-md border">
            <DataTable table={table} columns={columns} />
          </div>
          <DataTablePagination table={table} />
        </CardContent>
      </Card>

      <POFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} po={selectedPO} mode={drawerMode} />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Purchase Order?"
        description={`Are you sure you want to delete PO ${poToDelete?.poNumber}? This action cannot be undone.`}
      />
    </>
  );
}
