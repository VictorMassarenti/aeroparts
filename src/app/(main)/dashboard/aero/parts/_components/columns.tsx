import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, EllipsisVertical } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Part } from "@/stores/aero/types";

export const createPartsColumns = (onEdit: (part: Part) => void, onDelete: (part: Part) => void): ColumnDef<Part>[] => [
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
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    cell: ({ row }) => <div className="max-w-md truncate">{row.original.description}</div>,
  },
  {
    accessorKey: "ataChapter",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ATA Chapter" />,
    cell: ({ row }) => <div className="w-24">{row.original.ataChapter}</div>,
  },
  {
    accessorKey: "manufacturer",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Manufacturer" />,
    cell: ({ row }) => <div className="w-32 truncate">{row.original.manufacturer}</div>,
  },
  {
    accessorKey: "condition",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Condition" />,
    cell: ({ row }) => (
      <Badge variant="outline" className="px-1.5 text-muted-foreground">
        {row.original.condition}
      </Badge>
    ),
  },
  {
    accessorKey: "unitOfMeasure",
    header: ({ column }) => <DataTableColumnHeader column={column} title="UoM" />,
    cell: ({ row }) => (
      <Badge variant="secondary" className="px-1.5">
        {row.original.unitOfMeasure}
      </Badge>
    ),
  },
  {
    accessorKey: "hazardous",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Hazardous" />,
    cell: ({ row }) =>
      row.original.hazardous ? (
        <AlertTriangle className="size-4 text-destructive" />
      ) : (
        <span className="text-muted-foreground">-</span>
      ),
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
