import { getServerSession } from "next-auth";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

import { redirect } from "next/navigation";
import { FatigueReportForm } from "@/app/(main)/_components/fatigue-report-form";
import { GenerateFatigueReportPdf } from "@/app/(main)/_components/generate-fatigue-report-pdf";
import { SimpleModal } from "@/components/simple-modal";
import { GanttChartSquare } from "lucide-react";
import { FatigueReportTimelineItem } from "@/app/(main)/_components/fatigue-report-timeline-item";

const bcrumb = [
  { label: "Reportes", path: "/admin/reportes" },
  { label: "Editar", path: "editar" },
];

const EditReportPage = async ({ params }: { params: { reportId: string } }) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.role) {
    return redirect("/admin");
  }

  const isAdmin = session.user?.role === "ADMIN";

  const report = await db.fatigueSleepReport.findUnique({
    where: {
      id: params.reportId,
      active: true,
    },
    include: {
      logisticsCenter: {
        select: {
          company: {
            select: {
              logoImgUrl: true,
            },
          },
        },
      },
      driver: {
        select: {
          fullname: true,
          numDoc: true,
        },
      },
      supervisor: {
        select: {
          name: true,
          numDoc: true,
        },
      },
      city: {
        select: {
          realName: true,
        },
      },
    },
  });

  if (!report) {
    return (
      <div className="w-full h-full min-h-[calc(100vh-60px)] flex justify-center items-center ">
        <h2 className="text-3xl font-bold text-red-600">
          Reporte no encontrado!
        </h2>
      </div>
    );
  }

  const defaults = await db.parameter.findMany({
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


  const fatigueReportEvents = await db.fatigueReportEvent.findMany({
    where: {
      fatigueReportId: report.id,
    },
    include: {
      fatiqueReport: true,
      user: true
    }
  });

  return (
    <CardPage
      pageHeader={
        <>
          <TitleOnPage text="Reporte de fatiga y sueño" bcrumb={bcrumb}>
           <div className="flex gap-2">
           <GenerateFatigueReportPdf
              report={report}
              defaultsSymptoms={
                defaults.find((def) => def.name === "symptoms")
                  ?.defaultValues || []
              }
              defaultsSigns={
                defaults.find((def) => def.name === "signs")?.defaultValues ||
                []
              }
              defaultsAppearances={
                defaults.find((def) => def.name === "appearances")
                  ?.defaultValues || []
              }
              defaultsMoods={
                defaults.find((def) => def.name === "moods")?.defaultValues ||
                []
              }
              defaultsPerformances={
                defaults.find((def) => def.name === "performances")
                  ?.defaultValues || []
              }
              defaultsDrivingModes={
                defaults.find((def) => def.name === "drivingModes")
                  ?.defaultValues || []
              }
            />

            {/* <SimpleModal
              textBtn={<GanttChartSquare />}
              btnClass={`bg-accent text-white`}
              title="Linea de tiempo"
            >
              <div className="mx-5 w-fit">
                <ol className="relative border-s border-primary ">
                  {fatigueReportEvents.map((event) => (
                    <FatigueReportTimelineItem key={event.id} event={event} />
                  ))}
                </ol>
              </div>
            </SimpleModal> */}
           </div>
          </TitleOnPage>
        </>
      }
    >
      <FatigueReportForm
        isAdmin={isAdmin}
        fatigueSleepReport={report}
        defaultsSymptoms={
          defaults.find((def) => def.name === "symptoms")?.defaultValues || []
        }
        defaultsSigns={
          defaults.find((def) => def.name === "signs")?.defaultValues || []
        }
        defaultsAppearances={
          defaults.find((def) => def.name === "appearances")?.defaultValues ||
          []
        }
        defaultsMoods={
          defaults.find((def) => def.name === "moods")?.defaultValues || []
        }
        defaultsPerformances={
          defaults.find((def) => def.name === "performances")?.defaultValues ||
          []
        }
        defaultsDrivingModes={
          defaults.find((def) => def.name === "drivingModes")?.defaultValues ||
          []
        }
        defaultsStrategies={
          defaults.find((def) => def.name === "strategies")?.defaultValues || []
        }
      />
    </CardPage>
  );
};

export default EditReportPage;
