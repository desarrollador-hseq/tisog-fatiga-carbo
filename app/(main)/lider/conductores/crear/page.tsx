import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { AddDriverForm } from "../_components/add-driver-form";
import { db } from "@/lib/db";

const bcrumb = [
  { label: "Conductores", path: "/lider/conductores" },
  { label: "Agregar", path: "/lider/crear" },
];

const CreateDriver = async () => {
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
      pageHeader={<TitleOnPage text={`Agregar conductor`} bcrumb={bcrumb} />}
    >
      <AddDriverForm
        cities={cities}
        companies={companies}
        positions={positions}
      />
    </CardPage>
  );
};

export default CreateDriver;
