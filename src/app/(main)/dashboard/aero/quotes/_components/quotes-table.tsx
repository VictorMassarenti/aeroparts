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
import type { Quote } from "@/stores/aero/types";

import { DeleteConfirmDialog } from "../../_components/delete-confirm-dialog";
import { createQuotesColumns } from "./columns";
import { QuoteFormDrawer } from "./quote-form-drawer";

export function QuotesTable() {
  const quotes = useAeroStore((state) => state.quotes);
  const deleteQuote = useAeroStore((state) => state.deleteQuote);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [selectedQuote, setSelectedQuote] = useState<Quote | undefined>();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | undefined>();

  const handleEdit = (quote: Quote) => {
    setSelectedQuote(quote);
    setDrawerMode("edit");
    setDrawerOpen(true);
  };

  const handleDelete = (quote: Quote) => {
    setQuoteToDelete(quote);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (quoteToDelete) {
      deleteQuote(quoteToDelete.id);
      toast.success("Quote deleted successfully");
      setDeleteDialogOpen(false);
      setQuoteToDelete(undefined);
    }
  };

  const handleAdd = () => {
    setSelectedQuote(undefined);
    setDrawerMode("create");
    setDrawerOpen(true);
  };

  const columns = createQuotesColumns(handleEdit, handleDelete);
  const table = useDataTableInstance({
    data: quotes,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quotes</CardTitle>
          <CardDescription>Create and manage sales quotes for customers.</CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <DataTableViewOptions table={table} />
              <Button size="sm" onClick={handleAdd}>
                <Plus />
                <span className="hidden lg:inline">Create Quote</span>
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

      <QuoteFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} quote={selectedQuote} mode={drawerMode} />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Quote?"
        description={`Are you sure you want to delete quote ${quoteToDelete?.quoteNumber}? This action cannot be undone.`}
      />
    </>
  );
}
