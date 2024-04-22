import { db } from "@/lib/db";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { AddCentersForm } from "../../_components/add-centers-form";
import { DeleteCenter } from "../../_components/delete-center";

const bcrumb = [
  { label: "Centros", path: "/admin/centros" },
  { label: "Editar", path: "/admin/editar" },
];

const EditCenterPage = async ({ params }: { params: { centerId: string } }) => {
  const center = await db.logisticsCenter.findUnique({
    where: {
      id: params.centerId,
      active: true,
    },
  });

  const companies = await db.company.findMany({
    where: {
      active: true,
    },
  });

  if (!center) {
    return <CardPage>Centro logístico no encontrado</CardPage>;
  }

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Editar ciudad" bcrumb={bcrumb}>
          <DeleteCenter center={center} />
        </TitleOnPage>
      }
    >
      {center ? (
        <AddCentersForm companies={companies} center={center} />
      ) : (
        <div>Ciudad no encontrada</div>
      )}
    </CardPage>
  );
};

export default EditCenterPage;
