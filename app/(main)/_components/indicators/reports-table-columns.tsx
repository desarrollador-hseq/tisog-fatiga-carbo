"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
// import { formatDateOf } from "@/lib/utils";
import { Driver, FatigueSleepReport, User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface fatigueWithDriver extends FatigueSleepReport {
  driver?: (Driver & { company: { name: string | null } | null }) | null;
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
    accessorKey: "company",
    accessorFn: (value) => value.driver?.company?.name || "No Registrado",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground p-0"
        >
          Empresa
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original?.driver?.company?.name || "No Registrado";
      return <div className="">{name}</div>;
    },
  },
  {
    accessorKey: "level",
    accessorFn: (value) =>
      value.riskLevel === "HIGH"
        ? "ALTO"
        : value.riskLevel === "MEDIUM"
        ? "MEDIO"
        : "BAJO",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground p-0"
        >
          Nivel
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fullname =
        row.original.riskLevel === "HIGH"
          ? "ALTO"
          : row.original.riskLevel === "MEDIUM"
          ? "MEDIO"
          : "BAJO";
      return (
        <div
          className={`${
            row.original.riskLevel === "HIGH"
              ? "bg-red-600 text-white"
              : row.original.riskLevel === "MEDIUM"
              ? "bg-yellow-600 text-white"
              : "bg-slate-300"
          } text-center rounded-sm`}
        >
          {fullname}
        </div>
      );
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
      return <div className="">{date ? formatDate(date) : "--"}</div>;
    },
  },
];
