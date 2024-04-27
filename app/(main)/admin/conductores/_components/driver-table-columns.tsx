
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { formatDateOf } from "@/lib/utils";
import { Driver } from "@prisma/client";



export const driverTableColumns: ColumnDef<Driver>[] =
  [
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

