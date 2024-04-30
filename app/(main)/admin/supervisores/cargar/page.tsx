"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";
import { ButtonDownloadTemplateExcel } from "@/components/button-download-template-excel";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { SheetSupervisorsLoadErrors } from "./_components/sheet-drivers-load-errors";
import { SupervisorsTableExcel } from "./_components/supervisors-table-excel";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/components/providers/loading-provider";
import { cn } from "@/lib/utils";

const bcrumbs = [
  { label: "supervisores", path: "/admin/supervisores" },
  { label: "Cargar", path: "/cargar" },
];

const UploadSupervisors = () => {
  const [usersLoaded, setUsersLoaded] = useState<unknown[]>([]);
  const [listErrors, setListErrors] = useState<unknown[]>([]);
  const [wasError, setWasError] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const { setLoadingApp } = useLoading();

  const onClick = async () => {
    setisSubmitting(true);
    setLoadingApp(true);
    const values = usersLoaded;
    console.log({ usersLoaded });
    console.log({ values });

    try {
      const { data } = await axios.post(
        `/api/user/upload-supervisor-list`,
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
      setisSubmitting(false);
      setLoadingApp(false);
      setUsersLoaded([]);
    }
  };

  useEffect(() => {
    console.log({ listErrors });
  }, [listErrors]);

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text={`Cargar supervisores`} bcrumb={bcrumbs}>
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
            )}
          </div>
        </div>
      </div>
    </CardPage>
  );
};

export default UploadSupervisors;
