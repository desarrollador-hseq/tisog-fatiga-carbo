"use client";

import React, { useState } from "react";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Edit2, FilePlus2, Trash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import { FatigueReportEvent, FatigueSleepReport, User } from "@prisma/client";

interface CertificateItemTimelineProps {
  event: FatigueReportEvent & { user: User | null | undefined };
}

export const FatigueReportTimelineItem = ({
  event,
}: CertificateItemTimelineProps) => {
  const [certificateData] = useState<FatigueSleepReport | null | undefined>(
    event?.reportData && JSON.parse(event.reportData)
  );

  return (
    <li className="mb-10 ms-6">
      <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white ">
        {event.eventType === "CREATED" ? (
          <FilePlus2 />
        ) : event.eventType === "UPDATED" ? (
          <Edit2 />
        ) : (
          <Trash />
        )}
      </span>

      <div className="flex flex-col justify-between p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex justify-between w-full">
          <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
            {format(event.createdAt, "Pp", { locale: es })}
          </time>
          <div className="flex items-center gap-3">
            {event.user?.name}
            <div
              className={cn(
                "self-start text-base font-normal text-gray-500 mt-2"
              )}
            >
              <span
                className={cn(
                  " text-white text-xs font-semibold me-2 px-2.5 py-0.5 rounded ",
                  event.eventType === "CREATED"
                    ? "bg-emerald-600"
                    : event.eventType === "UPDATED"
                    ? "bg-slate-500"
                    : "bg-red-600"
                )}
              >
                {event.eventType === "CREATED"
                  ? "Creado"
                  : event.eventType === "UPDATED"
                  ? "Actualizado"
                  : "Eliminado"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-xs">
          <div className="grid grid-cols-7 place-content-center place-items-center h-full font-bold my-2 text-xs">
            <span>Colaborador</span>
            <span>documento</span>
            <span>Arl</span>
            <span>Curso</span>
            <span>Nivel</span>
            <span>Reentrenamiento</span>
            <span>Creado</span>
          </div>
          {!certificateData ? (
            <div className="w-full flex justify-center mt-6">
              <h4 className="italic text-slate-400">Sin datos</h4>
            </div>
          ) : (
            <Card
              key={certificateData?.id}
              className="overflow-hidden bg-blue-100 text-primary"
            >
              <CardContent className={cn("p-2")}>
                <div
                  className={cn(
                    "grid grid-cols-7 place-content-center place-items-center h-full relative text-xs font-medium text-[10px]"
                  )}
                >
                  <span className="leading-4">
                    {certificateData?.medicine}
                  </span>
                  <span className="leading-4">
                    {certificateData?.moods}{" "}
                 
                  </span>
                  
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </li>
  );
};
