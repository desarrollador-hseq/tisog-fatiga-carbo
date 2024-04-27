import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { AddDriverForm } from "../_components/add-driver-form";
import { db } from "@/lib/db";
import { ButtonDownloadTemplateExcel } from "@/components/button-download-template-excel";
// import { ButtonDownloadTemplateExcel } from "@/components/button-download-template-excel";

const bcrumb = [
  { label: "Conductores", path: "/admin/conductores" },
  { label: "Agregar", path: "/admin/crear" },
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
      pageHeader={
        <TitleOnPage text={`Agregar conductor`} bcrumb={bcrumb}>
          <ButtonDownloadTemplateExcel name="plantilla_colaboradores" />
        </TitleOnPage>
      }
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
