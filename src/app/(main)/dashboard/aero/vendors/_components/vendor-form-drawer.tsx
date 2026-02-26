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
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAeroStore } from "@/stores/aero/aero-provider";
import type { Vendor } from "@/stores/aero/types";

import { type VendorFormData, vendorSchema } from "./schema";

interface VendorFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor?: Vendor;
  mode: "create" | "edit";
}

export function VendorFormDrawer({ open, onOpenChange, vendor, mode }: VendorFormDrawerProps) {
  const isMobile = useIsMobile();
  const addVendor = useAeroStore((state) => state.addVendor);
  const updateVendor = useAeroStore((state) => state.updateVendor);

  const form = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      id: "",
      companyName: "",
      contactPerson: "",
      emails: [""],
      phone: "",
      address: "",
      paymentMethod: "",
      leadTime: "",
      currency: "USD",
      rating: "Not Rated",
      notes: "",
    },
  });

  useEffect(() => {
    if (vendor && mode === "edit") {
      form.reset(vendor);
    } else if (mode === "create") {
      form.reset({
        id: "",
        companyName: "",
        contactPerson: "",
        emails: [""],
        phone: "",
        address: "",
        paymentMethod: "",
        leadTime: "",
        currency: "USD",
        rating: "Not Rated",
        notes: "",
      });
    }
  }, [vendor, mode, form]);

  const onSubmit = (data: VendorFormData) => {
    try {
      const cleanedData = {
        ...data,
        emails: data.emails.filter((e) => e.trim() !== ""),
      };

      if (mode === "create") {
        addVendor(cleanedData);
        toast.success("Vendor created successfully");
      } else if (vendor?.id) {
        updateVendor(vendor.id, cleanedData);
        toast.success("Vendor updated successfully");
      }
      onOpenChange(false);
      form.reset();
    } catch (_error) {
      toast.error("Failed to save vendor");
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={isMobile ? "bottom" : "right"}>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{mode === "create" ? "Add New Vendor" : "Edit Vendor"}</DrawerTitle>
          <DrawerDescription>
            {mode === "create" ? "Enter the vendor information below" : "Update the vendor information"}
          </DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 overflow-y-auto px-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Aviation Parts Supplier Inc" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Jane Smith" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+1 (555) 987-6543" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="emails.0"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="vendor@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="456 Industrial Blvd, City, State, ZIP" rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Wire, Check, ACH..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A">A - Excellent</SelectItem>
                        <SelectItem value="B">B - Good</SelectItem>
                        <SelectItem value="C">C - Fair</SelectItem>
                        <SelectItem value="Not Rated">Not Rated</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Additional notes..." rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DrawerFooter className="px-0">
              <Button type="submit">{mode === "create" ? "Create Vendor" : "Update Vendor"}</Button>
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
