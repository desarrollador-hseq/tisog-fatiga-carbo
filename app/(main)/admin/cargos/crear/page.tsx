

import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { AddPositionForm } from "../_components/add-position-form";

const bcrumb = [
  { label: "Cargos", path: "/admin/cargos" },
  { label: "Agregar", path: "/admin/agregar" },
];

const CreatePositionPage = async () => {

  return (
    <CardPage
      pageHeader={<TitleOnPage text="Agregar Cargo" bcrumb={bcrumb} />}
    >
      <AddPositionForm />
    </CardPage>
  );
};

export default CreatePositionPage;
