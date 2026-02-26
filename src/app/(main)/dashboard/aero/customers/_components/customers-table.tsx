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
import type { Customer } from "@/stores/aero/types";

import { DeleteConfirmDialog } from "../../_components/delete-confirm-dialog";
import { createCustomersColumns } from "./columns";
import { CustomerFormDrawer } from "./customer-form-drawer";

export function CustomersTable() {
  const customers = useAeroStore((state) => state.customers);
  const deleteCustomer = useAeroStore((state) => state.deleteCustomer);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | undefined>();

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDrawerMode("edit");
    setDrawerOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete.id);
      toast.success("Customer deleted successfully");
      setDeleteDialogOpen(false);
      setCustomerToDelete(undefined);
    }
  };

  const handleAdd = () => {
    setSelectedCustomer(undefined);
    setDrawerMode("create");
    setDrawerOpen(true);
  };

  const columns = createCustomersColumns(handleEdit, handleDelete);
  const table = useDataTableInstance({
    data: customers,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>Manage your customer accounts and billing information.</CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <DataTableViewOptions table={table} />
              <Button size="sm" onClick={handleAdd}>
                <Plus />
                <span className="hidden lg:inline">Add Customer</span>
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

      <CustomerFormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        customer={selectedCustomer}
        mode={drawerMode}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Customer?"
        description={`Are you sure you want to delete ${customerToDelete?.companyName}? This action cannot be undone.`}
      />
    </>
  );
}
