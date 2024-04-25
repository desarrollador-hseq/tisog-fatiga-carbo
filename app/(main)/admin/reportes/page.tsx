import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { TableDefault } from "@/components/table-default";
import { db } from "@/lib/db";

import { buttonVariants } from "@/components/ui/button";
import { CardPage } from "@/components/card-page";
import { cn } from "@/lib/utils";
import { TitleOnPage } from "@/components/title-on-page";
import { authOptions } from "@/lib/authOptions";
import { NotAuthorized } from "@/components/not-authorized";
import { reportsTableColumns } from "../../_components/indicators/reports-table-columns";

const bcrumb = [{ label: "Reportes", path: "/dashboard/reportes" }];

const ReportsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session?.user?.role) {
    return <NotAuthorized />;
  }

  const reports = await db.fatigueSleepReport.findMany({
    where: {
      active: true,
      driver: {
        companyId: session.user.companyId,
      },
    },
    include: {
      driver: true,
      logisticsCenter: {
        select: {
          name: true,
        },
      },
      city: {
        select: {
          realName: true,
        }
      },
      supervisor: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Listado de reportes" bcrumb={bcrumb}>
          <Link
            className={cn(buttonVariants({variant: "secondary"}))}
            href={`/lider/reportes/crear`}
          >
            Crear
          </Link>
        </TitleOnPage>
      }
    >
      <TableDefault
        data={reports}
        columns={reportsTableColumns}
        editHref={{ btnText: "Editar", href: `/lider/reportes/editar` }}
      />
    </CardPage>
  );
};

export default ReportsPage;
