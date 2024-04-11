


"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { formatDateOf } from "@/lib/utils";
import { Company } from "@prisma/client";



export const companyTableColumns: ColumnDef<Company>[] =
  [
    {
      accessorKey: "name",
      accessorFn: (value) => value.name,
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
        const name = row.original?.name;
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

