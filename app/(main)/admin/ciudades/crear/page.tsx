

import React from "react";

import { db } from "@/lib/db";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { AddCityForm } from "../_components/add-city-form";

const bcrumb = [
  { label: "Ciudades", path: "/admin/ciudades" },
  { label: "Agregar", path: "/admin/ciudad" },
];

const CreateCityPage = async () => {
  
  return (
    <CardPage
      pageHeader={<TitleOnPage text="Agregar ciudad" bcrumb={bcrumb} />}
    >
      <AddCityForm  />
    </CardPage>
  );
};

export default CreateCityPage;
