"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { formatDateOf } from "@/lib/utils";
import { Driver, FatigueSleepReport } from "@prisma/client";
import { formatDate } from "@/lib/utils";

export const reportsTableColumns: ColumnDef<
  FatigueSleepReport & { driver: Driver | null }
>[] = [
  {
    accessorKey: "driver",
    accessorFn: (value) => value.driver?.fullname,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          Conductor
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fullname = row.original?.driver?.fullname;
      return <div className="">{fullname}</div>;
    },
  },
  {
    accessorKey: "date",
    accessorFn: (value) => value.date && formatDate(value.date),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original?.date;
      return <div className="">{date ? formatDate(date) : "no"}</div>;
    },
  },
];
