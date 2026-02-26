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
import type { Part } from "@/stores/aero/types";

import { DeleteConfirmDialog } from "../../_components/delete-confirm-dialog";
import { createPartsColumns } from "./columns";
import { PartFormDrawer } from "./part-form-drawer";

export function PartsTable() {
  const parts = useAeroStore((state) => state.parts);
  const deletePart = useAeroStore((state) => state.deletePart);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [selectedPart, setSelectedPart] = useState<Part | undefined>();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [partToDelete, setPartToDelete] = useState<Part | undefined>();

  const handleEdit = (part: Part) => {
    setSelectedPart(part);
    setDrawerMode("edit");
    setDrawerOpen(true);
  };

  const handleDelete = (part: Part) => {
    setPartToDelete(part);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (partToDelete) {
      deletePart(partToDelete.id);
      toast.success("Part deleted successfully");
      setDeleteDialogOpen(false);
      setPartToDelete(undefined);
    }
  };

  const handleAdd = () => {
    setSelectedPart(undefined);
    setDrawerMode("create");
    setDrawerOpen(true);
  };

  const columns = createPartsColumns(handleEdit, handleDelete);
  const table = useDataTableInstance({
    data: parts,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Parts Database</CardTitle>
          <CardDescription>Manage your aircraft parts catalog and specifications.</CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <DataTableViewOptions table={table} />
              <Button size="sm" onClick={handleAdd}>
                <Plus />
                <span className="hidden lg:inline">Add Part</span>
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

      <PartFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} part={selectedPart} mode={drawerMode} />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Part?"
        description={`Are you sure you want to delete part ${partToDelete?.pn}? This action cannot be undone.`}
      />
    </>
  );
}
