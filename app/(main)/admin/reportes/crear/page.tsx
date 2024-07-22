import { getServerSession } from "next-auth";
import { db } from "@/lib/db";

import { Card } from "@/components/ui/card";
import { TitleOnPage } from "@/components/title-on-page";

import { authOptions } from "@/lib/authOptions";
import { CreateReportForm } from "./_components/create-report-form";
import { CardPage } from "@/components/card-page";
import { NotAuthorized } from "@/components/not-authorized";

const bcrumb = [
  { label: "Reportes", path: "/lider/reportes" },
  { label: "Crear", path: "crear" },
];

const CreateReportPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || session?.user?.role !== "ADMIN") {
    return <NotAuthorized />;
  }

  const drivers = await db.driver.findMany({
    where: { active: true, companyId: session.user.companyId },
  });

  const logisticsCenters = await db.logisticsCenter.findMany({
    where: { active: true, companyId: session.user.companyId },
  });
  const cities = await db.city.findMany({
    where: { active: true },
  });

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Crear Reporte de fatiga y sueño" bcrumb={bcrumb} />
      }
    >
      <CreateReportForm
        drivers={drivers}
        logisticsCenters={logisticsCenters}
        cities={cities}
      />
    </CardPage>
  );
};

export default CreateReportPage;
