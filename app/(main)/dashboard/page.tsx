import Link from "next/link";
import { getServerSession } from "next-auth";
import { TableDefault } from "@/components/table-default";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { reportsTableColumns } from "../dashboard/reportes/_components/reports-table-columns";
import { CardPage } from "@/components/card-page";
import { Banner } from "@/components/banner";
import { TitleOnPage } from "@/components/title-on-page";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const bcrumb = [{ label: "Reportes", path: "/admin/reportes", click: false }];

const DashboardHomePage = async () => {
  const session = await getServerSession(authOptions);

  const reports = await db.fatigueSleepReport.findMany({
    where: {
      active: true,
      supervisorId: session?.user?.id,
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
    <>
      <CardPage
        className=""
        pageHeader={
          <TitleOnPage text="Listado de reportes" bcrumb={bcrumb}>
            <Link
              className={cn(buttonVariants({variant: "secondary"}))}
              href={`/dashboard/reportes/crear`}
            >
              Crear
            </Link>
          </TitleOnPage>
        }
      >
        {therePending && (
          <Banner label="Tienes uno o más reportes sin enviar" />
        )}
        <div className="flex w-full">
          <TableDefault
            data={reports}
            columns={reportsTableColumns}
            editHref={{ btnText: `Editar`, href: `/dashboard/reportes/editar` }}
          />
        </div>
      </CardPage>
    </>
  );
};

export default DashboardHomePage;
