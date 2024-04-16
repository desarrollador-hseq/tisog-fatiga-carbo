"use client";
import React from "react";
import { Fade } from "react-awesome-reveal";
import { DefaultValue, FatigueSleepReport, Parameter } from "@prisma/client";
import { TableDefault } from "@/components/table-default";
import { ReportSymptoms } from "./report-symptoms";
import { reportsTableColumns } from "./reports-table-columns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ReportSleepHours } from "./report-sleep-hours";
import { useLoading } from "@/components/providers/loading-provider";
import { endOfDay } from "date-fns";

import { ReportBarFatigue } from "./report-bar-fatigue";

interface valuesWithParameter extends DefaultValue {
  parameters?: {name: string | null} | null;
}

export const FatigueIndicators = ({
  reports,
  defaultsValues,
}: {
  reports: FatigueSleepReport[];
  defaultsValues: valuesWithParameter[];
}) => {
  const { dateFilter, cityFilter } = useLoading();

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
          const startDate = report.createdAt;
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

  console.log({ defaultsSigns });

  return (
    <div
      className="w-full flex flex-col justify-center mb-6 "
      id="collaborator"
    >
      <div className="w-full grid grid-rows-3 grid-cols-1 md:grid-rows-1 md:grid-cols-3 my-1 h-max md:my-3  place-content-center px-3 ">
        <div />
        <h2 className="text-3xl font-bold text-center"></h2>
        <div className="place-content-center flex justify-center md:justify-end">
          {/* <ShowTableModal title="Reportes">
          </ShowTableModal> */}
        </div>
      </div>

      {/* <Separator className="mb-4 bg-primary" /> */}

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 p-2 mb-3 lg:grid-rows-1 ">
        {/* <Fade delay={200} cascade triggerOnce>
         <CollaboratorsKpi
          threshold={threshold}
          collaborators={filteredCollaborators}
        />
        </Fade>
        <div>
        <PercentagePie  collaborators={filteredCollaborators} />
      </div> */}
        <Fade delay={400} cascade triggerOnce>
          <ReportBarFatigue
            defaultsItems={defaultsSymptoms}
            field="symptoms"
            reports={filteredReports}
            title="Síntomas más frecuentes"
          />
        </Fade>
        <Fade delay={400} cascade triggerOnce>
          <ReportSleepHours reports={filteredReports} />
        </Fade>
        <Fade delay={400} cascade triggerOnce>
          <ReportBarFatigue
            defaultsItems={defaultsSigns}
            field="signs"
            reports={filteredReports}
            title="Signos más frecuentes"
          />
        </Fade>

        <Fade>
          <div className="flex flex-col ">
            <h3>Comportamiento</h3>
            <div className="grid md:grid-cols-2 md:grid-rows-2 gap-2 ">
              <ReportBarFatigue
                defaultsItems={defaultsAppearances}
                field="appearances"
                reports={filteredReports}
                title="appearances"
              />
              <ReportBarFatigue
                defaultsItems={defaultsPerformances}
                field="performances"
                reports={filteredReports}
                title="performances"
              />
              <ReportBarFatigue
                defaultsItems={defaultsMoods}
                field="moods"
                reports={filteredReports}
                title="moods"
              />
              <ReportBarFatigue
                defaultsItems={defaultsDrivingModes}
                field="drivingModes"
                reports={filteredReports}
                title="drivingModes"
              />
            </div>
          </div>
        </Fade>
        {/* <div className="lg:col-span-2">
          <Fade delay={600} cascade triggerOnce>
            <CollaboratorsCity collaborators={filteredCollaborators} />
          </Fade>
        </div>
        <div className="lg:col-span-2">
          <Fade delay={650} cascade triggerOnce>
            <CollaboratorsRegional
              collaborators={filteredCollaborators}
              regionalsFull={filteredRegionalFull}
            />
          </Fade>
        </div> */}
      </div>
      <Fade delay={500} cascade triggerOnce>
        <Card className="w-full h-fit">
          <CardHeader>
            <h2 className="font-semibold text-lg text-center">
              {" "}
              Últimos reportes
            </h2>
          </CardHeader>
          <CardContent>
            <TableDefault
              columns={reportsTableColumns}
              data={filteredReports}
            />
          </CardContent>
        </Card>
      </Fade>
    </div>
  );
};
