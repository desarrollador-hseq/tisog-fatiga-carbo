import React from "react";

import { db } from "@/lib/db";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { AddCentersForm } from "../_components/add-centers-form";

const bcrumb = [
  { label: "Centros", path: "/admin/centros" },
  { label: "Agregar", path: "/admin/agregar" },
];

const CreateCompanyPage = async () => {
  const companies = await db.company.findMany({
    where: {
      active: true,
    },
  });
  return (
    <CardPage
      pageHeader={<TitleOnPage text="Agregar centro logístico" bcrumb={bcrumb} />}
    >
      <AddCentersForm companies={companies} />
    </CardPage>
  );
};

export default CreateCompanyPage;
