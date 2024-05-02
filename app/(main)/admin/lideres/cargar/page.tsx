"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";
import { ButtonDownloadTemplateExcel } from "@/components/button-download-template-excel";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { SheetSupervisorsLoadErrors } from "./_components/sheet-supervisors-load-errors";
import { SupervisorsTableExcel } from "./_components/supervisors-table-excel";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/components/providers/loading-provider";
import { cn } from "@/lib/utils";
import { Banner } from "@/components/banner";

const bcrumbs = [
  { label: "lideres", path: "/admin/lideres" },
  { label: "Cargar", path: "/cargar" },
];

const UploadSupervisors = () => {
  const [usersLoaded, setUsersLoaded] = useState<unknown[]>([]);
  const [listErrors, setListErrors] = useState<unknown[]>([]);
  const [wasError, setWasError] = useState(false);
  const { setLoadingApp } = useLoading();

  const onClick = async () => {
    setLoadingApp(true);
    const values = usersLoaded;

    try {
      const { data } = await axios.post(
        `/api/user/upload-leaders-list`,
        values
      );

      if (data && data.failedInserts && data.failedInserts.length > 0) {
        console.log({
          failedInserts: data.failedInserts.map((item: any) => ({
            data: item.data,
            error: item.error,
          })),
        });
        setListErrors(
          data.failedInserts.map((item: any) => ({
            data: item.data,
            error: item.error,
          }))
        );

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
      setLoadingApp(false);
      setUsersLoaded([]);
    }
  };

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text={`Cargar líderes`} bcrumb={bcrumbs}>
          <ButtonDownloadTemplateExcel name="plantilla_colaboradores" />
        </TitleOnPage>
      }
    >
        <Banner
          variant="info"
          label="El proceso puede llevar varios minutos según la cantidad de colaboradores que se estén registrando. Por favor, evite recargar la página o cerrarla mientras se lleva a cabo el proceso"
          className="mb-5"
        />
      <div>
        <div className="min-h-fit">
          <div className="p-0 overflow-hidden rounded-md">
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

              <SupervisorsTableExcel
                setUsersLoaded={setUsersLoaded}
                usersLoaded={usersLoaded}
              />

              {/* <AddEmployee /> */}

              {listErrors && listErrors.length > 0 && (
                <SheetSupervisorsLoadErrors
                  failedInserts={listErrors}
                  wasError={wasError}
                  setWasError={setWasError}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </CardPage>
  );
};

export default UploadSupervisors;
