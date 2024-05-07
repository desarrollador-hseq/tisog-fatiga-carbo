import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { AddSupervisorForm } from "../_components/add-supervisor-form";
import { DeleteSupervisor } from "../_components/delete-supervisor";

const bcrumb = [
  { label: "Supervisor", path: "/admin/supervisores" },
  { label: "Editar", path: "/admin/supervisores/editar" },
];

const EditSupervisorPage = async ({ params }: { params: { supervisorId: string } }) => {
  const supervisor = await db.user.findUnique({
    where: {
      id: params.supervisorId,
      role: "USER",
      active: true,
    },
  });

  if (!supervisor) {
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


  return (
    <CardPage pageHeader={<TitleOnPage text={`Editar supervisor`} bcrumb={bcrumb} >
      <DeleteSupervisor supervisor={supervisor} />
    </TitleOnPage>}>
      <AddSupervisorForm supervisor={supervisor} cities={cities} companies={companies} />
    </CardPage>
  );
};
export default EditSupervisorPage;
