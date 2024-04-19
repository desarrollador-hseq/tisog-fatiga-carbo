import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { CardPage } from "@/components/card-page";
import { HandleParameters } from "./_components/handle-parameters";
import { DeleteDefaultParameter } from "./_components/delete-default-value";
import { AddDefaultValueForm } from './_components/add-default-value-form';

const ParametersPage = async () => {
  const parametersDefaults = await db.parameter.findMany({
    where: {
      active: true,
    },
    include: {
      defaultValues: {
        where: {
          active: true,
        },
      },
    },
  });

  return (
    <CardPage>
      <Card className="p-2 w-full h-full border border-slate-400 flex flex-col rounded-sm gap-3 bg-slate-300">
        <h3 className="text-2xl text-center font-bold mb-2">
          Parametros
        </h3>

        <HandleParameters
          disabled={false}
          parameters={parametersDefaults}
        />

      </Card>
      <div className="grid md:grid-cols-2 gap-2">
        {parametersDefaults.map((parameter) => (
          <Card key={parameter.id} className="p-2 w-full h-full border border-slate-400 flex flex-col rounded-sm gap-3 bg-slate-300">
            <h3 className="text-2xl text-center font-bold mb-2">
              {parameter.desc}
            </h3>

            <AddDefaultValueForm
              disabled={false}
              label={parameter.desc || ""}
              id={parameter.id}
            />

            {parameter.defaultValues.map((def) => (
              <div key={def.id} className="h-12 flex justify-between items-center bg-slate-300 px-4">
                {def.name}
                <DeleteDefaultParameter
                  defaultValueId={def.id}
                  parameterId={parameter.id}
                />
              </div>
            ))}
          </Card>
        ))}
      </div>
    </CardPage>
  );
};

export default ParametersPage;
