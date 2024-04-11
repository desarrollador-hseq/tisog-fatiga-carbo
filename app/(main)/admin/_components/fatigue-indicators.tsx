"use client";
import React from "react";
import { Fade } from "react-awesome-reveal";
import { DefaultValue, FatigueSleepReport } from "@prisma/client";
import { TableDefault } from "@/components/table-default";
import { ReportSymptoms } from "./report-symptoms";
import { reportsTableColumns } from "./reports-table-columns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ReportSleepHours } from "./report-sleep-hours";

export const FatigueIndicators = ({
  reports,
  defaultsSymptoms
}: {
  reports: FatigueSleepReport[];
  defaultsSymptoms: DefaultValue[]
}) => {
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
          <ReportSymptoms reports={reports} defaultsSymptoms={defaultsSymptoms} />
        </Fade>
        <Fade delay={400} cascade triggerOnce>
          <ReportSleepHours reports={reports} />
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
            <TableDefault columns={reportsTableColumns} data={reports} />
          </CardContent>
        </Card>
      </Fade>
    </div>
  );
};
