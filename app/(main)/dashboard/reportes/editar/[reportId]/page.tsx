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
import { ModalDeleteConfirm } from "@/components/modal-delete-confirm";
import { ModalDeleteReport } from "./_components/modal-delete-report";

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
      supervisorId: session.user.id,
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
          company: {
            select: {
              logoImgUrl: true
            }
          }
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
          Reporte no encontrado o no cuenta con permisos para acceder
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
              <div className="flex gap-2">
                <GenerateFatigueReportPdf
                  report={report}
                  defaultsSymptoms={
                    defaults.find((def) => def.name === "symptoms")
                      ?.defaultValues || []
                  }
                  defaultsSigns={
                    defaults.find((def) => def.name === "signs")
                      ?.defaultValues || []
                  }
                  defaultsAppearances={
                    defaults.find((def) => def.name === "appearances")
                      ?.defaultValues || []
                  }
                  defaultsMoods={
                    defaults.find((def) => def.name === "moods")
                      ?.defaultValues || []
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
                <ModalDeleteReport report={report} />
              </div>
            )}
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
