"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAeroStore } from "@/stores/aero/aero-provider";
import type { InventoryLot } from "@/stores/aero/types";

import { EntityCombobox } from "../../_components/entity-combobox";
import { type InventoryLotFormData, inventoryLotSchema } from "./schema";

interface InventoryFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lot?: InventoryLot;
  mode: "create" | "edit";
}

export function InventoryFormDrawer({ open, onOpenChange, lot, mode }: InventoryFormDrawerProps) {
  const isMobile = useIsMobile();
  const addInventoryLot = useAeroStore((state) => state.addInventoryLot);
  const updateInventoryLot = useAeroStore((state) => state.updateInventoryLot);
  const parts = useAeroStore((state) => state.parts);
  const vendors = useAeroStore((state) => state.vendors);

  const form = useForm<InventoryLotFormData>({
    resolver: zodResolver(inventoryLotSchema),
    defaultValues: {
      id: "",
      partId: "",
      pn: "",
      serialNumber: "",
      batchLot: "",
      quantity: 1,
      unitCost: 0,
      supplierId: "",
      supplierName: "",
      invoiceNumber: "",
      entryDate: new Date().toISOString().split("T")[0],
      location: "",
      certificateFileName: "",
      minimumStock: 1,
    },
  });

  useEffect(() => {
    if (lot && mode === "edit") {
      form.reset({
        ...lot,
        entryDate: lot.entryDate.split("T")[0],
      });
    } else if (mode === "create") {
      form.reset({
        id: "",
        partId: "",
        pn: "",
        serialNumber: "",
        batchLot: "",
        quantity: 1,
        unitCost: 0,
        supplierId: "",
        supplierName: "",
        invoiceNumber: "",
        entryDate: new Date().toISOString().split("T")[0],
        location: "",
        certificateFileName: "",
        minimumStock: 1,
      });
    }
  }, [lot, mode, form]);

  const onSubmit = (data: InventoryLotFormData) => {
    try {
      if (mode === "create") {
        addInventoryLot(data);
        toast.success("Inventory lot created successfully");
      } else {
        updateInventoryLot(lot?.id || "", data);
        toast.success("Inventory lot updated successfully");
      }
      onOpenChange(false);
      form.reset();
    } catch (_error) {
      toast.error("Failed to save inventory lot");
    }
  };

  const watchedPartId = form.watch("partId");
  const watchedSupplierId = form.watch("supplierId");

  useEffect(() => {
    if (watchedPartId) {
      const part = parts.find((p) => p.id === watchedPartId);
      if (part) {
        form.setValue("pn", part.pn);
      }
    }
  }, [watchedPartId, parts, form]);

  useEffect(() => {
    if (watchedSupplierId) {
      const vendor = vendors.find((v) => v.id === watchedSupplierId);
      if (vendor) {
        form.setValue("supplierName", vendor.companyName);
      }
    }
  }, [watchedSupplierId, vendors, form]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={isMobile ? "bottom" : "right"}>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{mode === "create" ? "Add Inventory Lot" : "Edit Inventory Lot"}</DrawerTitle>
          <DrawerDescription>
            {mode === "create" ? "Enter the lot information below" : "Update the lot information"}
          </DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 overflow-y-auto px-4">
            <FormField
              control={form.control}
              name="partId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part</FormLabel>
                  <FormControl>
                    <EntityCombobox type="part" value={field.value} onValueChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Optional" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batchLot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch/Lot</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Optional" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Cost</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <EntityCombobox type="vendor" value={field.value} onValueChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Optional" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="entryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minimumStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Stock</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Main Warehouse, Section A..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="certificateFileName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificate (Placeholder)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="No file upload in POC" disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DrawerFooter className="px-0">
              <Button type="submit">{mode === "create" ? "Create Lot" : "Update Lot"}</Button>
              <DrawerClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
