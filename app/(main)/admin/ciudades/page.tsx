import { CardPage } from "@/components/card-page";
import { TableDefault } from "@/components/table-default";
import { TitleOnPage } from "@/components/title-on-page";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { cityTableColumns } from "./_components/city-table-columns";
import { db } from "@/lib/db";

const bcrumb = [{ label: "Empresas", path: "/admin/empresas" }];

const CitiesPage = async () => {

  const cities = await db.city.findMany({
    where: {
      active: true,
    },
  });
    
  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Listado de Ciudades" bcrumb={bcrumb}>
          <Link
            className={cn(buttonVariants())}
            href={`/admin/ciudades/crear`}
          >
            Agregar
          </Link>
        </TitleOnPage>
      }
    >
      <TableDefault
        data={cities}
        columns={cityTableColumns}
        editHref={{ btnText: "Editar", href: `/admin/ciudades/editar` }}
      />
    </CardPage>
  );
};

export default CitiesPage;
