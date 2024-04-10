import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import React from "react";
import { AddDriverForm } from "../_components/add-driver-form";

const bcrumb = [
  { label: "Conductores", path: "/dashboard/conductores" },
  { label: "Editar", path: "/dashboard/conductores/editar" },
];

const EditDriverPage = async ({ params }: { params: { driverId: string } }) => {
  const driver = await db.driver.findUnique({
    where: {
      id: params.driverId,
    },
  });

  return (
    <CardPage pageHeader={<TitleOnPage text={`Editar conductor`} bcrumb={bcrumb} />}>
      <AddDriverForm driver={driver} />
    </CardPage>
  );
};
export default EditDriverPage;
