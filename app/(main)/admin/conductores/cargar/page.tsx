"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";
import { ButtonDownloadTemplateExcel } from "@/components/button-download-template-excel";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { SheetCollaboratorsLoadErrors } from "./_components/sheet-drivers-load-errors";
import { DriversTableExcel } from "./_components/drivers-table-excel";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/components/providers/loading-provider";
import { cn } from "@/lib/utils";

const bcrumbs = [
  { label: "conductores", path: "/admin/conductores" },
  { label: "Cargar", path: "/cargar" },
];

const UploadDrivers = () => {
  const [usersLoaded, setUsersLoaded] = useState<unknown[]>([]);
  const [listError, setListError] = useState([]);
  const [wasError, setWasError] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const { setLoadingApp } = useLoading();

  const onClick = async () => {
    setisSubmitting(true);
    setLoadingApp(true);
    const values = usersLoaded;
    try {
      const { data } = await axios.post(`/api/drivers/upload-list`, values);

      if (data.failedInserts) {
        setListError(data.failedInserts);
        setWasError(true);
      }

      if (data.successfulInserts.length >= 1) {
        toast.success(
          `Se han añadido: ${data.successfulInserts.length} empleados correctamente. (${data.successfulInserts.length}/${usersLoaded.length})`
        );
      }
    } catch (error) {
      console.log({ error: error });
    } finally {
      setisSubmitting(false);
      setLoadingApp(false);
      setUsersLoaded([]);
    }
  };

  const handleDownloadTemplate = () => {
    // URL de la plantilla en el servidor
    const templateUrl = "/plantilla_colaboradores.xlsx";

    // Crear un elemento 'a' para iniciar la descarga
    const link = document.createElement("a");
    link.href = templateUrl;
    link.download = "plantilla_colaboradores.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text={`Agregar conductor`} bcrumb={bcrumbs}>
          <ButtonDownloadTemplateExcel name="plantilla_colaboradores" />
        </TitleOnPage>
      }
    >
      <div>
        <h3></h3>
        <div className="min-h-fit">
          <div className="p-0 overflow-hidden rounded-md">
            {isSubmitting ? (
              <div className="w-full h-fit flex justify-center items-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : (
              <div className="w-full">
                <div className="w-full flex justify-center items-center my-3">
                  <Button
                    variant="secondary"
                    disabled={usersLoaded.length == 0}
                    onClick={onClick}
                    className={cn(
                      "gap-2 p-8 text-xl",
                      usersLoaded.length == 0 && "hidden"
                    )}
                  >
                    <UploadCloud /> Cargar
                  </Button>
                </div>

                <DriversTableExcel
                  setUsersLoaded={setUsersLoaded}
                  usersLoaded={usersLoaded}
                />

                {/* <AddEmployee /> */}

                {listError.length > 0 && (
                  <SheetCollaboratorsLoadErrors
                    failedInserts={listError}
                    wasError={wasError}
                    setWasError={setWasError}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </CardPage>
  );
};

export default UploadDrivers;
