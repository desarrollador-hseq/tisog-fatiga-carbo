import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { FatigueReportForm } from "../../../../_components/fatigue-report-form";
import { getArraySymptomsByIds } from "@/lib/utils";
import { ModalCancelReport } from "./_components/modal-cancel-report";
import { GenerateFatigueReportPdf } from "@/app/(main)/_components/generate-fatigue-report-pdf";

const bcrumb = [
  { label: "Reportes", path: "/dashboard/reportes" },
  { label: "Editar", path: "editar" },
];

const EditReportPage = async ({ params }: { params: { reportId: string } }) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.role) {
    return redirect("/dashboard");
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

  return (
    <CardPage
      pageHeader={
        <>
          <TitleOnPage text="Reporte de fatiga y sueño" bcrumb={bcrumb}>
            {report.state === "PENDING" && (
              <ModalCancelReport report={report} />
            )}
            {report.state === "SEND" && (
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
            )}
          </TitleOnPage>
          {/* <div className="p-5 mx-5 text-gray-700 font-normal bg-slate-300 rounded-md">
            Este formulario debe diligenciarlo el Supervisor del colaborador
            cuando sienta una condición de salud que impide desarrollar sus
            labores y lo expone a riesgos. El supervisor es el responsable de
            implementar las acciones inmediatas para reducir el riesgo de Fatiga
            en la operación.
          </div> */}
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
