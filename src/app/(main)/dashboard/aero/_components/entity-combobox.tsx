"use client";

import { useState } from "react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useAeroStore } from "@/stores/aero/aero-provider";
import type { Customer, Part, Vendor } from "@/stores/aero/types";

type EntityType = "part" | "customer" | "vendor";

interface EntityComboboxProps {
  type: EntityType;
  value?: string;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function EntityCombobox({ type, value, onValueChange, placeholder, disabled }: EntityComboboxProps) {
  const [search, setSearch] = useState("");

  const parts = useAeroStore((state) => state.parts);
  const customers = useAeroStore((state) => state.customers);
  const vendors = useAeroStore((state) => state.vendors);

  let entities: Array<Part | Customer | Vendor> = [];
  let getLabel: (entity: Part | Customer | Vendor) => string = () => "";
  let getDescription: (entity: Part | Customer | Vendor) => string = () => "";

  if (type === "part") {
    entities = parts;
    getLabel = (e) => (e as Part).pn;
    getDescription = (e) => (e as Part).description;
  } else if (type === "customer") {
    entities = customers;
    getLabel = (e) => (e as Customer).companyName;
    getDescription = (e) => (e as Customer).contactPerson;
  } else if (type === "vendor") {
    entities = vendors;
    getLabel = (e) => (e as Vendor).companyName;
    getDescription = (e) => (e as Vendor).contactPerson;
  }

  const filtered = entities.filter((entity) => {
    const label = getLabel(entity).toLowerCase();
    const description = getDescription(entity).toLowerCase();
    const searchLower = search.toLowerCase();
    return label.includes(searchLower) || description.includes(searchLower);
  });

  const selectedEntity = entities.find((e) => e.id === value);
  const displayValue = selectedEntity ? getLabel(selectedEntity) : "";

  return (
    <Combobox value={value} onValueChange={onValueChange} disabled={disabled}>
      <ComboboxInput
        placeholder={placeholder || `Select ${type}...`}
        value={displayValue}
        onChange={(e) => setSearch(e.target.value)}
        showClear={!!value}
      />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxEmpty>No {type} found.</ComboboxEmpty>
          {filtered.map((entity) => (
            <ComboboxItem key={entity.id} value={entity.id}>
              <div className="flex flex-col">
                <span className="font-medium">{getLabel(entity)}</span>
                <span className="text-muted-foreground text-xs">{getDescription(entity)}</span>
              </div>
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
