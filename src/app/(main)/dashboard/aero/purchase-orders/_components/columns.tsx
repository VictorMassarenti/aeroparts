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
import type { PurchaseOrder } from "@/stores/aero/types";

import { StatusBadge } from "../../_components/status-badge";

export const createPOColumns = (
  onEdit: (po: PurchaseOrder) => void,
  onDelete: (po: PurchaseOrder) => void,
): ColumnDef<PurchaseOrder>[] => [
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
    accessorKey: "poNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="PO #" />,
    cell: ({ row }) => (
      <Button
        variant="link"
        className="w-fit px-0 text-left font-medium text-foreground"
        onClick={() => onEdit(row.original)}
      >
        {row.original.poNumber}
      </Button>
    ),
  },
  {
    accessorKey: "vendorName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Vendor" />,
    cell: ({ row }) => <div className="max-w-xs truncate">{row.original.vendorName}</div>,
  },
  {
    accessorKey: "items",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Items" className="text-right" />,
    cell: ({ row }) => <div className="w-16 text-right">{row.original.items.length}</div>,
  },
  {
    accessorKey: "totalLandedCost",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total Cost" className="text-right" />,
    cell: ({ row }) => (
      <div className="w-32 text-right font-medium">{formatCurrency(row.original.totalLandedCost)}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => <div className="w-28">{new Date(row.original.createdAt).toLocaleDateString()}</div>,
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
