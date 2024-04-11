


"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { formatDateOf } from "@/lib/utils";
import { City, Driver } from "@prisma/client";



export const cityTableColumns: ColumnDef<City>[] =
  [
    {
      accessorKey: "realName",
      accessorFn: (value) => value.realName,
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
        const name = row.original?.realName;
        return <div className="capitalize">{name}</div>;
      },
    },
    // {
    //   accessorKey: "numDoc",
    //   accessorFn: (value) => value.numDoc,
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //         className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
    //       >
    //         N° documento
    //         <ArrowUpDown className="ml-2 h-3 w-3" />
    //       </Button>
    //     );
    //   },
    //   cell: ({ row }) => {
    //     const numDoc = row.original?.numDoc;
    //     return <div className="">{numDoc}</div>;
    //   },
    // },
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

