import { db } from "@/lib/db";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { DeletePosition } from "../../_components/delete-position";
import { AddPositionForm } from "../../_components/add-position-form";

const bcrumb = [
  { label: "Cargos", path: "/admin/cargos" },
  { label: "Editar", path: "/admin/editar" },
];

const EditPositionPage = async ({
  params,
}: {
  params: { positionId: string };
}) => {
  const position = await db.position.findUnique({
    where: {
      id: params.positionId,
      active: true,
    },
  });

  if (!position) {
    return <CardPage>Cargo no encontrado</CardPage>;
  }

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Editar Cargo" bcrumb={bcrumb}>
          <DeletePosition position={position} />
        </TitleOnPage>
      }
    >
      {position ? (
        <AddPositionForm position={position} />
      ) : (
        <div>Cargo no encontrado</div>
      )}
    </CardPage>
  );
};

export default EditPositionPage;
