import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { AddLeaderForm } from "../_components/add-leader-form";

const bcrumb = [
  { label: "Conductores", path: "/dashboard/conductores" },
  { label: "Editar", path: "/dashboard/conductores/editar" },
];

const EditLeaderPage = async ({ params }: { params: { leaderId: string } }) => {
  const leader = await db.user.findUnique({
    where: {
      id: params.leaderId,
      role: "LEADER",
    },
  });

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

  console.log({leader})

  return (
    <CardPage
      pageHeader={<TitleOnPage text={`Editar líder`} bcrumb={bcrumb} />}
    >
      <AddLeaderForm leader={leader} cities={cities} companies={companies} />
    </CardPage>
  );
};
export default EditLeaderPage;
