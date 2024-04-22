import Link from "next/link";
import { CardPage } from "@/components/card-page";
import { TableDefault } from "@/components/table-default";
import { TitleOnPage } from "@/components/title-on-page";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { db } from "@/lib/db";
import { centersTableColumns } from "./_components/centers-table-columns";

const bcrumb = [{ label: "Centros", path: "/admin/centros" }];

const CompanyPage = async () => {
  const centers = await db.logisticsCenter.findMany({
    where: {
      active: true,
    },
    include: {
      company: true,
    },
  });

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Listado de centros logísticos" bcrumb={bcrumb}>
          <Link className={cn(buttonVariants())} href={`/admin/centros/crear`}>
            Agregar
          </Link>
        </TitleOnPage>
      }
    >
      <TableDefault
        data={centers}
        columns={centersTableColumns}
        editHref={{ btnText: "Editar", href: `/admin/centros/editar` }}
      />
    </CardPage>
  );
};

export default CompanyPage;
