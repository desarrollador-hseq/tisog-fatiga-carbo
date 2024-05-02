import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { AddLeaderForm } from "../_components/add-leader-form";
import { db } from "@/lib/db";
import { ButtonDownloadTemplateExcel } from "@/components/button-download-template-excel";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
// import { ButtonDownloadTemplateExcel } from "@/components/button-download-template-excel";

const bcrumb = [
  { label: "Líderes", path: "/admin/lideres" },
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
        <TitleOnPage text={`Agregar Líder`} bcrumb={bcrumb}>
         <Link
            className={cn(buttonVariants({variant: "secondary"}))}
            href={`/admin/lideres/cargar`}
          >
            Cargar
          </Link>
        </TitleOnPage>
      }
    >
      <AddLeaderForm cities={cities} companies={companies} />
    </CardPage>
  );
};

export default CreateSupervisorPage;
