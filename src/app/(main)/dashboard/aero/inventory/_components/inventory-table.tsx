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
import type { InventoryLot } from "@/stores/aero/types";

import { DeleteConfirmDialog } from "../../_components/delete-confirm-dialog";
import { createInventoryColumns } from "./columns";
import { InventoryFormDrawer } from "./inventory-form-drawer";

export function InventoryTable() {
  const inventoryLots = useAeroStore((state) => state.inventoryLots);
  const deleteInventoryLot = useAeroStore((state) => state.deleteInventoryLot);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [selectedLot, setSelectedLot] = useState<InventoryLot | undefined>();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lotToDelete, setLotToDelete] = useState<InventoryLot | undefined>();

  const handleEdit = (lot: InventoryLot) => {
    setSelectedLot(lot);
    setDrawerMode("edit");
    setDrawerOpen(true);
  };

  const handleDelete = (lot: InventoryLot) => {
    setLotToDelete(lot);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (lotToDelete) {
      deleteInventoryLot(lotToDelete.id);
      toast.success("Inventory lot deleted successfully");
      setDeleteDialogOpen(false);
      setLotToDelete(undefined);
    }
  };

  const handleAdd = () => {
    setSelectedLot(undefined);
    setDrawerMode("create");
    setDrawerOpen(true);
  };

  const columns = createInventoryColumns(handleEdit, handleDelete);
  const table = useDataTableInstance({
    data: inventoryLots,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>Manage your inventory lots, stock levels, and locations.</CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <DataTableViewOptions table={table} />
              <Button size="sm" onClick={handleAdd}>
                <Plus />
                <span className="hidden lg:inline">Add Lot</span>
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

      <InventoryFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} lot={selectedLot} mode={drawerMode} />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Inventory Lot?"
        description={`Are you sure you want to delete lot for part ${lotToDelete?.pn}? This action cannot be undone.`}
      />
    </>
  );
}
