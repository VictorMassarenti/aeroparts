import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";
import type { InventoryLot } from "@/stores/aero/types";

export const createInventoryColumns = (
  onEdit: (lot: InventoryLot) => void,
  onDelete: (lot: InventoryLot) => void,
): ColumnDef<InventoryLot>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "pn",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Part Number" />,
    cell: ({ row }) => (
      <Button
        variant="link"
        className="w-fit px-0 text-left font-medium text-foreground"
        onClick={() => onEdit(row.original)}
      >
        {row.original.pn}
      </Button>
    ),
  },
  {
    accessorKey: "serialNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Serial #" />,
    cell: ({ row }) => <div className="w-28">{row.original.serialNumber || "—"}</div>,
  },
  {
    accessorKey: "batchLot",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Batch/Lot" />,
    cell: ({ row }) => <div className="w-24">{row.original.batchLot || "—"}</div>,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Qty" className="text-right" />,
    cell: ({ row }) => {
      const isLowStock = row.original.quantity < row.original.minimumStock;
      return (
        <div className={`w-16 text-right font-medium ${isLowStock ? "text-destructive" : ""}`}>
          {row.original.quantity}
        </div>
      );
    },
  },
  {
    accessorKey: "unitCost",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Unit Cost" className="text-right" />,
    cell: ({ row }) => <div className="w-24 text-right">{formatCurrency(row.original.unitCost)}</div>,
  },
  {
    accessorKey: "supplierName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Supplier" />,
    cell: ({ row }) => <div className="max-w-xs truncate">{row.original.supplierName}</div>,
  },
  {
    accessorKey: "location",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
    cell: ({ row }) => <div className="w-32 truncate">{row.original.location}</div>,
  },
  {
    accessorKey: "entryDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Entry Date" />,
    cell: ({ row }) => <div className="w-28">{new Date(row.original.entryDate).toLocaleDateString()}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
            <EllipsisVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => onEdit(row.original)}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(row.original)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
  },
];
