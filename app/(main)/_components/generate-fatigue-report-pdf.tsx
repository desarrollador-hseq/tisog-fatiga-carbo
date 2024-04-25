"use client";

import React, { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { DefaultValue, FatigueSleepReport } from "@prisma/client";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { FatigueReportTemplate } from "@/app/(main)/_components/fatigue-report-template";

export const GenerateFatigueReportPdf = ({
  report,
  defaultsSymptoms,
  defaultsSigns,
  defaultsAppearances,
  defaultsMoods,
  defaultsPerformances,
  defaultsDrivingModes,
}: {
  report: FatigueSleepReport & {
    logisticsCenter: { company: { logoImgUrl: string | null } | null } | null;
    driver: { fullname: string | null; numDoc: string | null } | null;
    supervisor: { name: string | null; numDoc: string | null } | null;
    city: { realName: string } | null;
  };
  defaultsSymptoms: DefaultValue[];
  defaultsSigns: DefaultValue[];
  defaultsAppearances: DefaultValue[];
  defaultsMoods: DefaultValue[];
  defaultsPerformances: DefaultValue[];
  defaultsDrivingModes: DefaultValue[];
}) => {
  const [isClient, setIsClient] = useState(false);

  const nameandNumFormated = `REP-FATIGA-${report.driver?.numDoc}-${report.driver?.fullname}`;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getNamesDefaultValues = ({
    defaults,
    items,
  }: {
    defaults: DefaultValue[];
    items: string;
  }) => {
    const selectedItems = defaults.filter((symptom) =>
      items.split(",").includes(symptom.id)
    );
    const arrayString =
      selectedItems.map((symptom) => symptom.name.trim()) || [];
    return arrayString;
  };

  const symptomNames = getNamesDefaultValues({
    defaults: defaultsSymptoms,
    items: report.symptoms || "",
  });
  const behaviorNames = getNamesDefaultValues({
    defaults: defaultsSigns,
    items: report.signs || "",
  });
  const appearancesNames = getNamesDefaultValues({
    defaults: defaultsAppearances,
    items: report.appearances || "",
  });
  const moodsNames = getNamesDefaultValues({
    defaults: defaultsMoods,
    items: report.moods || "",
  });
  const performancesArray = getNamesDefaultValues({
    defaults: defaultsPerformances,
    items: report.performances || "",
  });
  const drivingModesNames = getNamesDefaultValues({
    defaults: defaultsDrivingModes,
    items: report.drivingModes || "",
  });

  return (
    <div className="w-full h-full">
      <div>
        {isClient && (
          <PDFDownloadLink
            document={
              <FatigueReportTemplate
                report={report}
                symptomsArray={symptomNames}
                behaviorsArray={behaviorNames}
                appearancesArray={appearancesNames}
                moodsArray={moodsNames}
                performancesArray={performancesArray}
                drivingModesArray={drivingModesNames}
              />
            }
            onClick={() => {
              toast.success("¡Archivo descargado correctamente!");
            }}
            fileName={`${nameandNumFormated}`}
          >
            {({ blob, url, loading, error }) => {
              return (
                <div className="">
                  {loading ? (
                    <div className="flex self-center justify-self-center">
                      <Loader2 className="text-secondary w-12 h-12 animate-spin" />
                    </div>
                  ) : (
                    <div
                      className={cn(
                        buttonVariants({
                          variant: "secondary",
                        }),
                        "px-10 py-7 text-lg"
                      )}
                    >
                      <Download className="mr-3" />
                      Descargar
                    </div>
                  )}
                </div>
              );
            }}
          </PDFDownloadLink>
        )}
      </div>
    </div>
  );
};
