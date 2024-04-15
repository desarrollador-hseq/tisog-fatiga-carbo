import { getServerSession } from "next-auth";
import { TableDefault } from "@/components/table-default";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { reportsTableColumns } from "../admin/_components/reports-table-columns";
import { CardPage } from "@/components/card-page";


const DashboardHomePage = async () => {
 
  const session = await getServerSession(authOptions)

  const reports = await db.fatigueSleepReport.findMany({
    where: {
      active: true,
      supervisorId: session?.user?.id
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

  return (
    <CardPage className="">
      <div className="flex w-full">
        <TableDefault 
          data={reports}
          columns={reportsTableColumns}
        />
      </div>
    </CardPage>
  );
};

export default DashboardHomePage;
