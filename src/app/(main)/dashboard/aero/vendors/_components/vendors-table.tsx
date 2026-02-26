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
import type { Vendor } from "@/stores/aero/types";

import { DeleteConfirmDialog } from "../../_components/delete-confirm-dialog";
import { createVendorsColumns } from "./columns";
import { VendorFormDrawer } from "./vendor-form-drawer";

export function VendorsTable() {
  const vendors = useAeroStore((state) => state.vendors);
  const deleteVendor = useAeroStore((state) => state.deleteVendor);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | undefined>();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | undefined>();

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDrawerMode("edit");
    setDrawerOpen(true);
  };

  const handleDelete = (vendor: Vendor) => {
    setVendorToDelete(vendor);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (vendorToDelete) {
      deleteVendor(vendorToDelete.id);
      toast.success("Vendor deleted successfully");
      setDeleteDialogOpen(false);
      setVendorToDelete(undefined);
    }
  };

  const handleAdd = () => {
    setSelectedVendor(undefined);
    setDrawerMode("create");
    setDrawerOpen(true);
  };

  const columns = createVendorsColumns(handleEdit, handleDelete);
  const table = useDataTableInstance({
    data: vendors,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Vendors</CardTitle>
          <CardDescription>Manage your vendor relationships and supplier information.</CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <DataTableViewOptions table={table} />
              <Button size="sm" onClick={handleAdd}>
                <Plus />
                <span className="hidden lg:inline">Add Vendor</span>
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

      <VendorFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} vendor={selectedVendor} mode={drawerMode} />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Vendor?"
        description={`Are you sure you want to delete ${vendorToDelete?.companyName}? This action cannot be undone.`}
      />
    </>
  );
}
