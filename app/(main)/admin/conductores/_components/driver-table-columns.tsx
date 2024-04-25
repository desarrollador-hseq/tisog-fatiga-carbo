"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { formatDateOf } from "@/lib/utils";
import { City, Company, Driver, Position } from "@prisma/client";

export const driverTableColumns: ColumnDef<
  Driver & {
    city: City | null;
    company: Company | null;
    position: Position | null;
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
      return <div className="">{name}</div>;
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
    accessorKey: "position",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cargo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (value) => `${value.position?.name ? value.position?.name : "Desconocida"}`,
    cell: ({ row }) => {
      const position = row.original.position;
      const positionName = position?.name || "Desconocida";
      return <span className="">{positionName}</span>;
    },
  },
  {
    accessorKey: "city",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ciudad
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (value) => `${value.city?.realName ? value.city?.realName : "Desconocida"}`,
    cell: ({ row }) => {
      const city = row.original.city;
      const cityName = city?.realName || "Desconocida";
      return <span className="">{cityName}</span>;
    },
  },
  {
    accessorKey: "company",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Empresa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (value) => `${value.company?.name ? value.company?.name : "Desconocida"}`,
    cell: ({ row }) => {
      const company = row.original.company;
      const companyName = company?.name || "Desconocida";
      return <span className="">{companyName}</span>;
    },
  },

  // {
  //   accessorKey: "date",
  //   accessorFn: (value) =>
  //     value.created && formatDate(value.date),
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         className="font-semibold"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Fecha
  //         <ArrowUpDown className="ml-2 h-3 w-3" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const date = row.original?.date;
  //     return (
  //       <div className="capitalize">
  //         {date ? formatDate(date) : "sin datos"}
  //       </div>
  //     );
  //   },
  // },
];
