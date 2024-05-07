import React from "react";
import Link from "next/link";
import { TableDefault } from "@/components/table-default";
import { db } from "@/lib/db";
import { reportsTableColumns } from "./_components/reports-table-columns";
import { buttonVariants } from "@/components/ui/button";
import { CardPage } from "@/components/card-page";
import { cn } from "@/lib/utils";
import { TitleOnPage } from "@/components/title-on-page";
import { Banner } from "@/components/banner";

const bcrumb = [{ label: "Reportes", path: "/dashboard/reportes" }];

const ReportsPage = async () => {
  const reports = await db.fatigueSleepReport.findMany({
    where: {
      active: true,
    },
    include: {
      driver: true,
      logisticsCenter: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const therePending = reports.some((report) => report.state === "PENDING");
  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Mis reportes" bcrumb={bcrumb}>
          <Link
            className={cn(buttonVariants({variant: "secondary", className: "text-xl"}))}
            href={`/dashboard/reportes/crear`}
          >
            Crear
          </Link>
        </TitleOnPage>
      }
    >
      {therePending && <Banner label="Tienes uno o más reportes sin enviar" />}

      <TableDefault
        data={reports}
        columns={reportsTableColumns}
        editHref={{ btnText: "Editar", href: `/dashboard/reportes/editar` }}
      />
    </CardPage>
  );
};

export default ReportsPage;
