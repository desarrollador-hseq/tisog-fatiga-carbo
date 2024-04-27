import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { AddSupervisorForm } from "../_components/add-supervisor-form";
import { db } from "@/lib/db";
import { ButtonDownloadTemplateExcel } from "@/components/button-download-template-excel";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
// import { ButtonDownloadTemplateExcel } from "@/components/button-download-template-excel";

const bcrumb = [
  { label: "Supervisores", path: "/admin/supervisores" },
  { label: "Agregar", path: "/admin/crear" },
];

const CreateSupervisorPage = async () => {
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
        <TitleOnPage text={`Agregar Supervisor`} bcrumb={bcrumb}>
          <Link
            className={cn(buttonVariants({variant: "secondary"}))}
            href={`/admin/supervisores/cargar`}
          >
            Cargar
          </Link>
        </TitleOnPage>
      }
    >
      <AddSupervisorForm cities={cities} companies={companies} />
    </CardPage>
  );
};

export default CreateSupervisorPage;
