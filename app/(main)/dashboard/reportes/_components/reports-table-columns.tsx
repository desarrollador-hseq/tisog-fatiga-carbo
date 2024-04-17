"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Driver, FatigueSleepReport } from "@prisma/client";
import { Button } from "@/components/ui/button";
// import { formatDateOf } from "@/lib/utils";
import { cn, formatDate } from "@/lib/utils";

const stateEsp = {
  PENDING: { text: "No enviado" },
  SEND: { text: "Enviado" },
  CANCELLED: { text: "Cancelado" },
};

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
          Fecha de envio
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original?.date;
      return <div className="">{date ? formatDate(date) : "no"}</div>;
    },
  },
  {
    accessorKey: "state",
    accessorFn: (value) => value.date && formatDate(value.date),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Estado
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const state = row.original?.state;
      const stateTr = state && stateEsp[state];
      return (
        <div>
          {stateTr ? (
            <span
              className={cn(
                " p-1 rounded-md w-full text-white px-3",
                stateTr.text === "No enviado"
                  ? "bg-red-500"
                  : stateTr.text === "Enviado"
                  ? "bg-emerald-500"
                  : "bg-slate-400"
              )}
            >
              {stateTr.text}
            </span>
          ) : (
            <span>{state}</span>
          )}
        </div>
      );
    },
  },
];
