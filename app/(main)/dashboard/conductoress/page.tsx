import React from "react";
import Link from "next/link";
import { TableDefault } from "@/components/table-default";
import { db } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { CardPage } from "@/components/card-page";
import { cn } from "@/lib/utils";
import { driverTableColumns } from "./_components/driver-table-columns";
import { TitleOnPage } from "@/components/title-on-page";


const bcrumb = [
  { label: "Conductores", path: "/dashboard/conductores" },
];
const DriversPage = async () => {
  const reports = await db.driver.findMany({
    where: {
      active: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <CardPage
    pageHeader={
      <TitleOnPage
        text="Listado de conductores"
        bcrumb={bcrumb}
      />
    }
    >
      <Link className={cn(buttonVariants())} href={`/dashboard/conductores/crear`}>
        Crear
      </Link>

      <TableDefault data={reports} columns={driverTableColumns} editHref={{btnText: "editar", href: `/dashboard/conductores`}} />
    </CardPage>
  );
};

export default DriversPage;