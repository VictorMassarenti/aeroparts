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
import type { Invoice } from "@/stores/aero/types";

import { StatusBadge } from "../../_components/status-badge";

export const createInvoicesColumns = (
  onView: (invoice: Invoice) => void,
  onDelete: (invoice: Invoice) => void,
): ColumnDef<Invoice>[] => [
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
    accessorKey: "invoiceNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Invoice #" />,
    cell: ({ row }) => (
      <Button
        variant="link"
        className="w-fit px-0 text-left font-medium text-foreground"
        onClick={() => onView(row.original)}
      >
        {row.original.invoiceNumber}
      </Button>
    ),
  },
  {
    accessorKey: "customerName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => <div className="max-w-xs truncate">{row.original.customerName}</div>,
  },
  {
    accessorKey: "items",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Items" className="text-right" />,
    cell: ({ row }) => <div className="w-16 text-right">{row.original.items.length}</div>,
  },
  {
    accessorKey: "subtotal",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Subtotal" className="text-right" />,
    cell: ({ row }) => <div className="w-28 text-right">{formatCurrency(row.original.subtotal)}</div>,
  },
  {
    accessorKey: "tax",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tax" className="text-right" />,
    cell: ({ row }) => <div className="w-24 text-right">{formatCurrency(row.original.tax)}</div>,
  },
  {
    accessorKey: "total",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total" className="text-right" />,
    cell: ({ row }) => <div className="w-32 text-right font-bold">{formatCurrency(row.original.total)}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Due Date" />,
    cell: ({ row }) => <div className="w-28">{new Date(row.original.dueDate).toLocaleDateString()}</div>,
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
          <DropdownMenuItem onClick={() => onView(row.original)}>View</DropdownMenuItem>
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
