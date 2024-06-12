import Link from "next/link";
import { CardPage } from "@/components/card-page";
import { TableDefault } from "@/components/table-default";
import { TitleOnPage } from "@/components/title-on-page";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { db } from "@/lib/db";
import { positionsTableColumns } from "./_components/positions-table-columns";

const bcrumb = [{ label: "Cargos", path: "/admin/cargos" }];

const PositionPage = async () => {
  const positions = await db.position.findMany({
    where: {
      active: true,
    },
  });

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Listado de Cargos" bcrumb={bcrumb}>
          <Link className={cn(buttonVariants())} href={`/admin/cargos/crear`}>
            Agregar
          </Link>
        </TitleOnPage>
      }
    >
      <TableDefault
        data={positions}
        columns={positionsTableColumns}
        editHref={{ btnText: "Editar", href: `/admin/cargos/editar` }}
      />
    </CardPage>
  );
};

export default PositionPage;
