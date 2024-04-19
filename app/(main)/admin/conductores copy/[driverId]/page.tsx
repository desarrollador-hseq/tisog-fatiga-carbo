import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { AddDriverForm } from "../_components/add-driver-form";

const bcrumb = [
  { label: "Conductores", path: "/dashboard/conductores" },
  { label: "Editar", path: "/dashboard/conductores/editar" },
];

const EditDriverPage = async ({ params }: { params: { driverId: string } }) => {
  const driver = await db.driver.findUnique({
    where: {
      id: params.driverId,
    },
  });

  const cities = await db.city.findMany({
    where: {
      active: true
    },
    orderBy: {
      realName: "desc"
    }
  })

  const companies = await db.company.findMany({
    where: {
      active: true
    }
  })
  const positions = await db.position.findMany({
    where: {
      active: true
    }
  })

  return (
    <CardPage pageHeader={<TitleOnPage text={`Editar conductor`} bcrumb={bcrumb} />}>
      <AddDriverForm driver={driver} cities={cities} companies={companies} positions={positions} />
    </CardPage>
  );
};
export default EditDriverPage;
