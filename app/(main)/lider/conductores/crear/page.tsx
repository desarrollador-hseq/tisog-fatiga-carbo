import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { AddDriverForm } from "../_components/add-driver-form";
import { db } from "@/lib/db";
import { ButtonDownloadTemplateExcel } from "@/components/button-download-template-excel";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// import { ButtonDownloadTemplateExcel } from "@/components/button-download-template-excel";

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
      pageHeader={
        <TitleOnPage text={`Agregar conductor`} bcrumb={bcrumb}>
          {/* <ButtonDownloadTemplateExcel name="plantilla-subir-conductores" /> */}
          <Link
            className={cn(buttonVariants({variant: "secondary"}))}
            href={`/lider/conductores/cargar`}
          >
            Cargar
          </Link>
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
