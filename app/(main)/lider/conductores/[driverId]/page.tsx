import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { AddDriverForm } from "../_components/add-driver-form";
import { DeleteDriver } from "../_components/delete-driver";

const bcrumb = [
  { label: "Conductores", path: "/dashboard/conductores" },
  { label: "Editar", path: "/dashboard/conductores/editar" },
];

const EditDriverPage = async ({ params }: { params: { driverId: string } }) => {
  const driver = await db.driver.findUnique({
    where: {
      id: params.driverId,
      active: true,
    },
  });

  if (!driver) {
    return (
      <div className="w-full h-full min-h-[calc(100vh-60px)] flex justify-center items-center">
        <h2 className="text-3xl font-bold text-red-600">
          Usuario no encontrado
        </h2>
      </div>
    );
  }

  const cities = await db.city.findMany({
    where: {
      active: true,
    },
    orderBy: {
      realName: "desc",
    },
  });

  const companies = await db.company.findMany({
    where: {
      active: true,
    },
  });
  const positions = await db.position.findMany({
    where: {
      active: true,
    },
  });

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text={`Editar conductor`} bcrumb={bcrumb}>
          <DeleteDriver driver={driver} />
        </TitleOnPage>
      }
    >
      <AddDriverForm
        driver={driver}
        cities={cities}
        companies={companies}
        positions={positions}
      />
    </CardPage>
  );
};
export default EditDriverPage;
