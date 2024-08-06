"use client";
import React, { useRef } from "react";
import {
  City,
  Company,
  DefaultValue,
  Driver,
  FatigueSleepReport,
  LogisticsCenter,
  User,
} from "@prisma/client";
import { endOfDay } from "date-fns";
import { useReactToPrint } from "react-to-print";
import { TableDefault } from "@/components/table-default";
import { reportsTableColumns } from "./reports-table-columns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ReportSleepHours } from "./report-sleep-hours";
import { useLoading } from "@/components/providers/loading-provider";

import { ReportBarFatigue } from "./report-bar-fatigue";
import { ListCriticalReports } from "./list-critical-reports";
import { Button } from "@/components/ui/button";

interface valuesWithParameter extends DefaultValue {
  parameters?: { name: string | null } | null;
}
interface reportWithDriverSupervisor extends FatigueSleepReport {
  driver: Driver & { company: { name: string | null } | null } | null;
  supervisor: { name: string | null } | null;
  logisticsCenter:
    | ({ name: string | null; companyId: string | null } & {
        company: { name: string | null } | null;
      })
    | null;
  city: { realName: string | null } | null;
}

export const FatigueIndicators = ({
  reports,
  defaultsValues,
}: {
  reports: reportWithDriverSupervisor[];
  defaultsValues: valuesWithParameter[];
}) => {
  const { userRole, dateFilter, cityFilter, companyFilter, levelFilter } =
    useLoading();
  const componentRef = useRef<HTMLInputElement>(null);
  const defaultsSymptoms = defaultsValues.filter(
    (def) => def?.parameters?.name === "symptoms"
  );
  const defaultsSigns = defaultsValues.filter(
    (def) => def?.parameters?.name === "signs"
  );
  const defaultsDrivingModes = defaultsValues.filter(
    (def) => def?.parameters?.name === "drivingModes"
  );
  const defaultsAppearances = defaultsValues.filter(
    (def) => def?.parameters?.name === "appearances"
  );
  const defaultsPerformances = defaultsValues.filter(
    (def) => def?.parameters?.name === "performances"
  );
  const defaultsMoods = defaultsValues.filter(
    (def) => def?.parameters?.name === "moods"
  );

  let filteredReports =
    !dateFilter || (!dateFilter.from && !dateFilter.to)
      ? reports
      : reports.filter((report) => {
          const startDate = report.date;
          if (!startDate) return null;
          return (
            (!dateFilter.from || startDate >= dateFilter.from) &&
            (!dateFilter.to || startDate <= endOfDay(dateFilter.to))
          );
        });

  if (cityFilter) {
    filteredReports = filteredReports.filter(
      (report) => report.cityId === cityFilter
    );
  }
  if (companyFilter) {
    filteredReports = filteredReports.filter(
      (report) => report.logisticsCenter?.companyId === companyFilter
    );
  }

  if (levelFilter) {
    filteredReports = filteredReports.filter(
      (report) => report.riskLevel === levelFilter
    );
  }

  // print function
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div
      className="w-full flex flex-col justify-center mb-6 gap-2 min-w-full"
      id="panel"
      ref={componentRef}
    >
      {/* TODO: MOSTRAR CIUDAD Y FECHA EN EL PRINT */}
      {/* <div className="info-filter hidden">
        Ciudad: {cityFilter} {dateFilter?.from?.toString()}
      </div> */}
      <ListCriticalReports reports={filteredReports} />

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 mb-3 lg:grid-rows-1 mt-2 w-full min-w-full">
        <ReportBarFatigue
          defaultsItems={defaultsSymptoms}
          field="symptoms"
          reports={filteredReports}
          title="Síntomas más frecuentes"
        />

        <ReportSleepHours reports={filteredReports} />

        <ReportBarFatigue
          defaultsItems={defaultsSigns}
          field="signs"
          reports={filteredReports}
          title="Comportamientos más frecuentes"
        />

        <div className="flex flex-col bg-primary/30 p-3 w-full overflow-hidden">
          <h3 className="text-center text-3xl font-semibold my-3">Signos</h3>
          <div className="grid md:grid-cols-2 md:grid-rows- gap-2 w-full">
            <ReportBarFatigue
              defaultsItems={defaultsAppearances}
              field="appearances"
              reports={filteredReports}
              title="Apariencia"
            />
            <ReportBarFatigue
              defaultsItems={defaultsMoods}
              field="moods"
              reports={filteredReports}
              title="Ánimo"
            />
            <ReportBarFatigue
              defaultsItems={defaultsPerformances}
              field="performances"
              reports={filteredReports}
              title="Desempeño"
            />
            <ReportBarFatigue
              defaultsItems={defaultsDrivingModes}
              field="drivingModes"
              reports={filteredReports}
              title="Conducción"
            />
          </div>
        </div>
      </div>

      <Card className="w-full h-fit">
        <CardHeader>
          <h2 className="font-semibold text-lg text-center">
            Últimos reportes
          </h2>
        </CardHeader>
        <CardContent>
          <TableDefault
            columns={reportsTableColumns}
            data={filteredReports}
            editHref={{
              btnText: "Editar",
              href: `/${
                userRole === "ADMIN" ? "admin" : "lider"
              }/reportes/editar`,
            }}
            nameDocument="reportes-fatiga"
          />
        </CardContent>
      </Card>
      <Button onClick={handlePrint}>Imprimir reporte</Button>
    </div>
  );
};
