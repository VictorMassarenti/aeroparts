"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAeroStore } from "@/stores/aero/aero-provider";
import type { Part } from "@/stores/aero/types";

import { type PartFormData, partSchema } from "./schema";

interface PartFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  part?: Part;
  mode: "create" | "edit";
}

export function PartFormDrawer({ open, onOpenChange, part, mode }: PartFormDrawerProps) {
  const isMobile = useIsMobile();
  const addPart = useAeroStore((state) => state.addPart);
  const updatePart = useAeroStore((state) => state.updatePart);

  const form = useForm<PartFormData>({
    resolver: zodResolver(partSchema),
    defaultValues: {
      id: "",
      pn: "",
      description: "",
      ataChapter: "",
      manufacturer: "",
      condition: "NEW",
      unitOfMeasure: "EA",
      traceabilityRequired: false,
      shelfLife: false,
      hazardous: false,
      alternatePn: "",
      supersededPn: "",
    },
  });

  useEffect(() => {
    if (part && mode === "edit") {
      form.reset(part);
    } else if (mode === "create") {
      form.reset({
        id: "",
        pn: "",
        description: "",
        ataChapter: "",
        manufacturer: "",
        condition: "NEW",
        unitOfMeasure: "EA",
        traceabilityRequired: false,
        shelfLife: false,
        hazardous: false,
        alternatePn: "",
        supersededPn: "",
      });
    }
  }, [part, mode, form]);

  const onSubmit = (data: PartFormData) => {
    try {
      if (mode === "create") {
        addPart(data);
        toast.success("Part created successfully");
      } else if (part?.id) {
        updatePart(part.id, data);
        toast.success("Part updated successfully");
      }
      onOpenChange(false);
      form.reset();
    } catch (_error) {
      toast.error("Failed to save part");
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={isMobile ? "bottom" : "right"}>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{mode === "create" ? "Add New Part" : "Edit Part"}</DrawerTitle>
          <DrawerDescription>
            {mode === "create" ? "Enter the part information below" : "Update the part information"}
          </DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 overflow-y-auto px-4">
            <FormField
              control={form.control}
              name="pn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ABC-123-456" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Part description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ataChapter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ATA Chapter</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="32-41-00" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Boeing, Airbus..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NEW">NEW - New</SelectItem>
                        <SelectItem value="OH">OH - Overhauled</SelectItem>
                        <SelectItem value="SV">SV - Serviceable</SelectItem>
                        <SelectItem value="AR">AR - As Removed</SelectItem>
                        <SelectItem value="NS">NS - New Surplus</SelectItem>
                        <SelectItem value="REP">REP - Repaired</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitOfMeasure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit of Measure</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select UoM" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EA">EA - Each</SelectItem>
                        <SelectItem value="LB">LB - Pound</SelectItem>
                        <SelectItem value="GAL">GAL - Gallon</SelectItem>
                        <SelectItem value="FT">FT - Foot</SelectItem>
                        <SelectItem value="SET">SET - Set</SelectItem>
                        <SelectItem value="KIT">KIT - Kit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="alternatePn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternate P/N</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Optional" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supersededPn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Superseded P/N</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Optional" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="traceabilityRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Traceability Required</FormLabel>
                      <FormDescription>Part requires serial/batch tracking</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shelfLife"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Shelf Life</FormLabel>
                      <FormDescription>Part has expiration date</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hazardous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Hazardous Material</FormLabel>
                      <FormDescription>Part contains hazmat</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DrawerFooter className="px-0">
              <Button type="submit">{mode === "create" ? "Create Part" : "Update Part"}</Button>
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
