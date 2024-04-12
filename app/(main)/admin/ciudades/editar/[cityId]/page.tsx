import { db } from "@/lib/db";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { AddCityForm } from "../../_components/add-city-form";
import { DeleteCity } from "../../_components/delete-city";

const bcrumb = [
  { label: "Ciudades", path: "/admin/ciudades" },
  { label: "Editar", path: "/admin/editar" },
];

const EditCityPage = async ({ params }: { params: { cityId: string } }) => {
  const city = await db.city.findUnique({
    where: {
      id: params.cityId,
      active: true,
    },
  });

  if(!city) {
   return <CardPage>Ciudad no encontrada</CardPage>
  }

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Editar ciudad" bcrumb={bcrumb}>
          <DeleteCity city={city} />
        </TitleOnPage>
      }
    >
      {
        city ? (
          <AddCityForm city={city} />
        ): (
          <div>Ciudad no encontrada</div>
        )
      }
    </CardPage>
  );
};

export default EditCityPage;
