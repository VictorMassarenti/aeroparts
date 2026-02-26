"use client";

import { useCallback, useEffect } from "react";

import { Trash2 } from "lucide-react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { useAeroStore } from "@/stores/aero/aero-provider";
import type { PartCondition } from "@/stores/aero/types";

import { EntityCombobox } from "./entity-combobox";

export interface LineItem {
  id: string;
  partId: string;
  pn: string;
  description: string;
  condition: PartCondition;
  quantity: number;
  unitPrice?: number;
  unitCost?: number;
  total: number;
}

interface LineItemsEditorProps {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  fieldName: string;
  mode: "quote" | "invoice" | "po";
}

export function LineItemsEditor({ control, setValue, fieldName, mode }: LineItemsEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName,
  });

  const parts = useAeroStore((state) => state.parts);

  const priceLabel = mode === "po" ? "Unit Cost" : "Unit Price";

  const calculateTotal = useCallback(
    (index: number, quantity: number, price: number) => {
      const total = quantity * price;
      setValue(`${fieldName}.${index}.total`, total);
    },
    [setValue, fieldName],
  );

  const handlePartChange = (index: number, partId: string | null) => {
    if (!partId) {
      // Clear the fields when part is deselected
      setValue(`${fieldName}.${index}.partId`, "");
      setValue(`${fieldName}.${index}.pn`, "");
      setValue(`${fieldName}.${index}.description`, "");
      return;
    }
    const part = parts.find((p) => p.id === partId);
    if (part) {
      setValue(`${fieldName}.${index}.partId`, partId);
      setValue(`${fieldName}.${index}.pn`, part.pn);
      setValue(`${fieldName}.${index}.description`, part.description);
      setValue(`${fieldName}.${index}.condition`, part.condition);
    }
  };

  const addRow = () => {
    append({
      id: crypto.randomUUID(),
      partId: "",
      pn: "",
      description: "",
      condition: "NEW" as PartCondition,
      quantity: 1,
      [mode === "po" ? "unitCost" : "unitPrice"]: 0,
      total: 0,
    });
  };

  // Calculate totals on mount
  useEffect(() => {
    fields.forEach((field: any, index: number) => {
      const price = mode === "po" ? field.unitCost || 0 : field.unitPrice || 0;
      calculateTotal(index, field.quantity || 0, price);
    });
  }, [calculateTotal, fields.forEach, mode]);

  const grandTotal = fields.reduce((sum: number, field: any) => sum + (field.total || 0), 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Label>Line Items</Label>
        <Button type="button" size="sm" variant="outline" onClick={addRow}>
          Add Row
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="rounded-md border p-4 text-center text-muted-foreground text-sm">
          No items yet. Click "Add Row" to add line items.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-2 text-left font-medium">Part</th>
                <th className="p-2 text-left font-medium">Condition</th>
                <th className="w-24 p-2 text-right font-medium">Qty</th>
                <th className="w-32 p-2 text-right font-medium">{priceLabel}</th>
                <th className="w-32 p-2 text-right font-medium">Total</th>
                <th className="w-16 p-2" />
              </tr>
            </thead>
            <tbody>
              {fields.map((field: any, index: number) => (
                <tr key={field.id} className="border-b last:border-0">
                  <td className="p-2">
                    <EntityCombobox
                      type="part"
                      value={field.partId}
                      onValueChange={(partId) => handlePartChange(index, partId)}
                      placeholder="Select part..."
                    />
                  </td>
                  <td className="p-2">
                    <Select
                      value={field.condition}
                      onValueChange={(val) => setValue(`${fieldName}.${index}.condition`, val)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEW">NEW</SelectItem>
                        <SelectItem value="OH">OH</SelectItem>
                        <SelectItem value="SV">SV</SelectItem>
                        <SelectItem value="AR">AR</SelectItem>
                        <SelectItem value="NS">NS</SelectItem>
                        <SelectItem value="REP">REP</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      min="1"
                      className="h-8 text-right"
                      value={field.quantity}
                      onChange={(e) => {
                        const qty = Number.parseInt(e.target.value, 10) || 0;
                        setValue(`${fieldName}.${index}.quantity`, qty);
                        const price = mode === "po" ? field.unitCost || 0 : field.unitPrice || 0;
                        calculateTotal(index, qty, price);
                      }}
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="h-8 text-right"
                      value={mode === "po" ? field.unitCost : field.unitPrice}
                      onChange={(e) => {
                        const price = Number.parseFloat(e.target.value) || 0;
                        setValue(`${fieldName}.${index}.${mode === "po" ? "unitCost" : "unitPrice"}`, price);
                        calculateTotal(index, field.quantity || 0, price);
                      }}
                    />
                  </td>
                  <td className="p-2 text-right font-medium">{formatCurrency(field.total || 0)}</td>
                  <td className="p-2 text-center">
                    <Button type="button" variant="ghost" size="icon-xs" onClick={() => remove(index)}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t bg-muted/50 font-medium">
              <tr>
                <td colSpan={4} className="p-2 text-right">
                  Subtotal:
                </td>
                <td className="p-2 text-right">{formatCurrency(grandTotal)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
