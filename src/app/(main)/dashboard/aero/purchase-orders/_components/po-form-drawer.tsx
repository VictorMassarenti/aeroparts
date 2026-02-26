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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatCurrency } from "@/lib/utils";
import { useAeroStore } from "@/stores/aero/aero-provider";
import type { POStatus, PurchaseOrder } from "@/stores/aero/types";

import { EntityCombobox } from "../../_components/entity-combobox";
import { LineItemsEditor } from "../../_components/line-items-editor";
import { type PurchaseOrderFormData, purchaseOrderSchema } from "./schema";

interface POFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  po?: PurchaseOrder;
  mode: "create" | "edit";
}

export function POFormDrawer({ open, onOpenChange, po, mode }: POFormDrawerProps) {
  const isMobile = useIsMobile();
  const addPurchaseOrder = useAeroStore((state) => state.addPurchaseOrder);
  const updatePurchaseOrder = useAeroStore((state) => state.updatePurchaseOrder);
  const receivePurchaseOrder = useAeroStore((state) => state.receivePurchaseOrder);
  const vendors = useAeroStore((state) => state.vendors);

  const form = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      id: "",
      poNumber: "",
      vendorId: "",
      vendorName: "",
      items: [],
      shippingCost: 0,
      taxes: 0,
      totalLandedCost: 0,
      status: "Draft",
    },
  });

  const watchedVendorId = form.watch("vendorId");
  const watchedItems = form.watch("items");
  const watchedShipping = form.watch("shippingCost");
  const watchedTaxes = form.watch("taxes");
  const watchedStatus = form.watch("status");

  useEffect(() => {
    if (watchedVendorId) {
      const vendor = vendors.find((v) => v.id === watchedVendorId);
      if (vendor) {
        form.setValue("vendorName", vendor.companyName);
      }
    }
  }, [watchedVendorId, vendors, form]);

  useEffect(() => {
    const itemsTotal = watchedItems?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;
    const totalLanded = itemsTotal + watchedShipping + watchedTaxes;
    form.setValue("totalLandedCost", totalLanded);
  }, [watchedItems, watchedShipping, watchedTaxes, form]);

  useEffect(() => {
    if (po && mode === "edit") {
      form.reset(po);
    } else if (mode === "create") {
      form.reset({
        id: "",
        poNumber: "",
        vendorId: "",
        vendorName: "",
        items: [],
        shippingCost: 0,
        taxes: 0,
        totalLandedCost: 0,
        status: "Draft",
      });
    }
  }, [po, mode, form]);

  const onSubmit = (data: PurchaseOrderFormData) => {
    try {
      if (mode === "create") {
        addPurchaseOrder(data);
        toast.success("Purchase order created successfully");
      } else {
        updatePurchaseOrder(po?.id || "", data);
        toast.success("Purchase order updated successfully");
      }
      onOpenChange(false);
      form.reset();
    } catch (_error) {
      toast.error("Failed to save purchase order");
    }
  };

  const handleReceive = () => {
    if (po) {
      receivePurchaseOrder(po.id);
      toast.success("Purchase order received. Inventory lots and A/P created.");
      onOpenChange(false);
    }
  };

  const canReceive = mode === "edit" && (watchedStatus === "Sent" || watchedStatus === "Shipped");

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={isMobile ? "bottom" : "right"}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="gap-1">
          <DrawerTitle>{mode === "create" ? "Create Purchase Order" : `PO ${po?.poNumber}`}</DrawerTitle>
          <DrawerDescription>
            {mode === "create" ? "Create a new purchase order" : "View and manage purchase order"}
          </DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 overflow-y-auto px-4">
            <FormField
              control={form.control}
              name="vendorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor</FormLabel>
                  <FormControl>
                    <EntityCombobox type="vendor" value={field.value} onValueChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LineItemsEditor control={form.control} setValue={form.setValue} fieldName="items" mode="po" />

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="shippingCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Cost</FormLabel>
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

              <FormField
                control={form.control}
                name="taxes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxes</FormLabel>
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

            <div className="rounded-md border bg-muted/50 p-4">
              <div className="flex items-center justify-between font-bold text-lg">
                <span>Total Landed Cost:</span>
                <span>{formatCurrency(form.watch("totalLandedCost"))}</span>
              </div>
            </div>

            {mode === "edit" && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={(val) => field.onChange(val as POStatus)} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Sent">Sent</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Received">Received</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DrawerFooter className="px-0">
              {canReceive && (
                <Button type="button" onClick={handleReceive} variant="default">
                  Mark as Received
                </Button>
              )}
              <Button type="submit">{mode === "create" ? "Create PO" : "Update PO"}</Button>
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
