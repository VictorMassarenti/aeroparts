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
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatCurrency } from "@/lib/utils";
import { useAeroStore } from "@/stores/aero/aero-provider";
import type { Quote, QuoteStatus } from "@/stores/aero/types";

import { EntityCombobox } from "../../_components/entity-combobox";
import { LineItemsEditor } from "../../_components/line-items-editor";
import { type QuoteFormData, quoteSchema } from "./schema";

interface QuoteFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote?: Quote;
  mode: "create" | "edit";
}

export function QuoteFormDrawer({ open, onOpenChange, quote, mode }: QuoteFormDrawerProps) {
  const isMobile = useIsMobile();
  const addQuote = useAeroStore((state) => state.addQuote);
  const updateQuote = useAeroStore((state) => state.updateQuote);
  const convertQuoteToInvoice = useAeroStore((state) => state.convertQuoteToInvoice);
  const customers = useAeroStore((state) => state.customers);

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      id: "",
      quoteNumber: "",
      customerId: "",
      customerName: "",
      items: [],
      leadTime: "",
      shipping: 0,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "Draft",
      notes: "",
    },
  });

  const watchedCustomerId = form.watch("customerId");
  const watchedItems = form.watch("items");
  const watchedShipping = form.watch("shipping");
  const watchedStatus = form.watch("status");

  useEffect(() => {
    if (watchedCustomerId) {
      const customer = customers.find((c) => c.id === watchedCustomerId);
      if (customer) {
        form.setValue("customerName", customer.companyName);
      }
    }
  }, [watchedCustomerId, customers, form]);

  useEffect(() => {
    if (quote && mode === "edit") {
      form.reset({
        ...quote,
        validUntil: quote.validUntil.split("T")[0],
      });
    } else if (mode === "create") {
      form.reset({
        id: "",
        quoteNumber: "",
        customerId: "",
        customerName: "",
        items: [],
        leadTime: "",
        shipping: 0,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "Draft",
        notes: "",
      });
    }
  }, [quote, mode, form]);

  const onSubmit = (data: QuoteFormData) => {
    try {
      if (mode === "create") {
        addQuote(data);
        toast.success("Quote created successfully");
      } else {
        updateQuote(quote?.id || "", data);
        toast.success("Quote updated successfully");
      }
      onOpenChange(false);
      form.reset();
    } catch (_error) {
      toast.error("Failed to save quote");
    }
  };

  const handleConvertToInvoice = () => {
    if (quote) {
      convertQuoteToInvoice(quote.id);
      toast.success("Invoice created successfully from quote!");
      onOpenChange(false);
    }
  };

  const itemsTotal = watchedItems?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;
  const grandTotal = itemsTotal + watchedShipping;

  const canConvert = mode === "edit" && watchedStatus === "Won";

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={isMobile ? "bottom" : "right"}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="gap-1">
          <DrawerTitle>{mode === "create" ? "Create Quote" : `Quote ${quote?.quoteNumber}`}</DrawerTitle>
          <DrawerDescription>
            {mode === "create" ? "Create a new sales quote" : "View and manage quote"}
          </DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 overflow-y-auto px-4">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <FormControl>
                    <EntityCombobox type="customer" value={field.value} onValueChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LineItemsEditor control={form.control} setValue={form.setValue} fieldName="items" mode="quote" />

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="leadTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Time</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="7-14 days" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shipping"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping</FormLabel>
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
              name="validUntil"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid Until</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-md border bg-muted/50 p-4">
              <div className="flex items-center justify-between font-bold text-lg">
                <span>Quote Total:</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {mode === "edit" && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={(val) => field.onChange(val as QuoteStatus)} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Sent">Sent</SelectItem>
                        <SelectItem value="Won">Won</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Optional notes..." rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DrawerFooter className="px-0">
              {canConvert && (
                <Button
                  type="button"
                  onClick={handleConvertToInvoice}
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Convert to Invoice
                </Button>
              )}
              <Button type="submit">{mode === "create" ? "Create Quote" : "Update Quote"}</Button>
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
