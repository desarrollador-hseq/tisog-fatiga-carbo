"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { formatDateOf } from "@/lib/utils";
import { Driver } from "@prisma/client";
import { formatDate } from "@/lib/utils";

export const driverTableColumns: ColumnDef<
  Driver & {
    company: { name: string | null } | null;
    city: { realName: string | null } | null;
    position: { name: string | null } | null;
  }
>[] = [
  {
    accessorKey: "fullname",
    accessorFn: (value) => value.fullname,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Nombre completo
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original?.fullname;
      return <div className="capitalize">{name}</div>;
    },
  },
  {
    accessorKey: "numDoc",
    accessorFn: (value) => value.numDoc,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          N° documento
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const numDoc = row.original?.numDoc;
      return <div className="">{numDoc}</div>;
    },
  },
  {
    accessorKey: "company",
    accessorFn: (value) => value.company?.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Empresa
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.company?.name;
      return <div className="">{name}</div>;
    },
  },
  {
    accessorKey: "city",
    accessorFn: (value) => value.city?.realName,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Ciudad
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.city?.realName;
      return <div className="">{name}</div>;
    },
  },
  {
    accessorKey: "position",
    accessorFn: (value) => value.position?.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Cargo
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.position?.name;
      return <div className="">{name}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    accessorFn: (value) => value.createdAt && formatDate(value.createdAt),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Creado
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original?.createdAt;
      return (
        <div className="">
          {date ? formatDate(date) : "sin datos"}
        </div>
      );
    },
  },
];
