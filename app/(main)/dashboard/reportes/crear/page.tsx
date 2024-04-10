import { getServerSession } from "next-auth";
import { db } from "@/lib/db";

import { Card } from "@/components/ui/card";
import { TitleOnPage } from "@/components/title-on-page";

import { authOptions } from "@/lib/authOptions";
import { CreateReportForm } from "./_components/create-report-form";
import { CardPage } from "@/components/card-page";

const bcrumb = [
  { label: "Reportes", path: "/dashboard/reportes" },
  { label: "Crear", path: "crear" },
];

const CreateReportPage = async () => {
  const session = await getServerSession(authOptions);
  const drivers = await db.driver.findMany({
    where: { active: true },
  });
  const logisticsCenters = await db.logisticsCenter.findMany({
    where: { active: true },
  });


  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Crear Reporte de fatiga y sueño" bcrumb={bcrumb} />
      }
    >
      <CreateReportForm drivers={drivers} logisticsCenters={logisticsCenters} />
    </CardPage>
  );
};

export default CreateReportPage;
