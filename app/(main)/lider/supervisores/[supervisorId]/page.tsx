import { getServerSession } from "next-auth";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { AddSupervisorForm } from "../_components/add-supervisor-form";
import { authOptions } from "@/lib/authOptions";

const bcrumb = [
  { label: "Supervisor", path: "/lider/supervisores" },
  { label: "Editar", path: "/lider/supervisores/editar" },
];

const EditSupervisorPage = async ({
  params,
}: {
  params: { supervisorId: string };
}) => {
  const session = await getServerSession(authOptions);
  const supervisor = await db.user.findUnique({
    where: {
      id: params.supervisorId,
      role: "USER",
      // companyId: session?.user.companyId,
      active: true,
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

  console.log({ compaId: session?.user.companyId });

  return (
    <CardPage
      pageHeader={<TitleOnPage text={`Editar supervisor`} bcrumb={bcrumb} />}
    >
      <AddSupervisorForm
        supervisor={supervisor}
        cities={cities}
        companies={companies}
        companyId={session?.user.companyId || undefined}
      />
    </CardPage>
  );
};
export default EditSupervisorPage;
