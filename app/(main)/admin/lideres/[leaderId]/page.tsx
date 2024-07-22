import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { AddLeaderForm } from "../_components/add-leader-form";
import { DeleteLeader } from "../_components/delete-leader";

const bcrumb = [
  { label: "Líderes", path: "/admin/lideres" },
  { label: "Editar", path: "/admin/lideres/editar" },
];

const EditLeaderPage = async ({ params }: { params: { leaderId: string } }) => {
  const leader = await db.user.findUnique({
    where: {
      id: params.leaderId,
      role: "LEADER",
    },
  });

  if (!leader) {
    return (
      <div className="w-full h-full min-h-[calc(100vh-60px)] flex justify-center items-center ">
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

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text={`Editar líder`} bcrumb={bcrumb}>
          <DeleteLeader leader={leader} />
        </TitleOnPage>
      }
    >
      <AddLeaderForm leader={leader} cities={cities} companies={companies} />
    </CardPage>
  );
};
export default EditLeaderPage;
