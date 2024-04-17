"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
// import { formatDateOf } from "@/lib/utils";
import { Driver, FatigueSleepReport, User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface fatigueWithDriver extends FatigueSleepReport {
  driver?: Driver | null;
  logisticsCenter?: { name: string | null | undefined } | null;
  supervisor?: { name: string | null | undefined } | null;
  city?: { realName: string | null | undefined } | null;
}

export const reportsTableColumns: ColumnDef<fatigueWithDriver>[] = [
  {
    accessorKey: "driver",
    accessorFn: (value) => value.driver?.fullname,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground p-0"
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
    accessorKey: "supervisor",
    accessorFn: (value) => value.supervisor?.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground p-0"
        >
          Supervisor
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fullname = row.original?.supervisor?.name;
      return <div className="">{fullname}</div>;
    },
  },
  {
    accessorKey: "city",
    accessorFn: (value) => value.city?.realName || "No Registrado",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground p-0"
        >
          Ciudad
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fullname = row.original?.city?.realName || "No Registrado";
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
          className="font-semibold p-0"
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
