import React from "react";
import { AddCompanyForm } from "../_components/add-company-form";
import { db } from "@/lib/db";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";

const bcrumb = [
  { label: "Empresas", path: "/admin/empresas" },
  { label: "Agregar", path: "/admin/agregar" },
];

const CreateCompanyPage = async () => {
  const cities = await db.city.findMany({
    where: {
      active: true,
    },
  });
  return (
    <CardPage
      pageHeader={<TitleOnPage text="Agregar empresa" bcrumb={bcrumb} />}
    >
      <AddCompanyForm cities={cities} />
    </CardPage>
  );
};

export default CreateCompanyPage;
