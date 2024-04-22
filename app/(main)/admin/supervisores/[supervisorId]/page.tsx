import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { AddSupervisorForm } from "../_components/add-supervisor-form";

const bcrumb = [
  { label: "Conductores", path: "/dashboard/conductores" },
  { label: "Editar", path: "/dashboard/conductores/editar" },
];

const EditSupervisorPage = async ({ params }: { params: { supervisorId: string } }) => {
  const supervisor = await db.user.findUnique({
    where: {
      id: params.supervisorId,
      role: "USER",
      active: true,
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

  console.log({supervisor})

  return (
    <CardPage pageHeader={<TitleOnPage text={`Editar supervisor`} bcrumb={bcrumb} />}>
      <AddSupervisorForm supervisor={supervisor} cities={cities} companies={companies} />
    </CardPage>
  );
};
export default EditSupervisorPage;
