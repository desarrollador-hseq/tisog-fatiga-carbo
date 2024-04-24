import { getServerSession } from "next-auth";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { FatigueReportForm } from "./_components/fatigue-report-form";
import { redirect } from "next/navigation";
import { getArraySymptomsByIds } from "@/lib/utils";

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
        }
      },
      city: {
        select: {
          realName: true
        }
      }
    },
  });

  const defaultsSymptoms = await db.parameter.findUnique({
    where: {
      active: true,
      name: "symptoms",
    },
    include: {
      defaultValues: {
        where: {
          active: true,
        },
      },
    },
  });
  const defaultsSigns = await db.parameter.findUnique({
    where: {
      active: true,
      name: "signs",
    },
    include: {
      defaultValues: {
        where: {
          active: true,
        },
      },
    },
  });
  const defaultsAppearance = await db.parameter.findUnique({
    where: {
      active: true,
      name: "appearances",
    },
    include: {
      defaultValues: {
        where: {
          active: true,
        },
      },
    },
  });
  const defaultsMoods = await db.parameter.findUnique({
    where: {
      active: true,
      name: "moods",
    },
    include: {
      defaultValues: {
        where: {
          active: true,
        },
      },
    },
  });
  const defaultsPerformances = await db.parameter.findUnique({
    where: {
      active: true,
      name: "performances",
    },
    include: {
      defaultValues: {
        where: {
          active: true,
        },
      },
    },
  });
  const defaultsDrivingModes = await db.parameter.findUnique({
    where: {
      active: true,
      name: "drivingModes",
    },
    include: {
      defaultValues: {
        where: {
          active: true,
        },
      },
    },
  });
  const defaultsStrategies = await db.parameter.findUnique({
    where: {
      active: true,
      name: "strategies",
    },
    include: {
      defaultValues: {
        where: {
          active: true,
        },
      },
    },
  });

  if (!report) {
    return <div>Sin datos</div>;
  }

  const symptomsArray = await getArraySymptomsByIds(report.symptoms?.split(",") || []);
  console.log({symptomsArray})

  return (
    <CardPage
      pageHeader={
        <>
          <TitleOnPage text="Reporte de fatiga y sueño" bcrumb={bcrumb} />
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
        defaultsSymptoms={defaultsSymptoms?.defaultValues || []}
        defaultsSigns={defaultsSigns?.defaultValues || []}
        defaultsAppearances={defaultsAppearance?.defaultValues || []}
        defaultsMoods={defaultsMoods?.defaultValues || []}
        defaultsPerformances={defaultsPerformances?.defaultValues || []}
        defaultsDrivingModes={defaultsDrivingModes?.defaultValues || []}
        defaultsStrategies={defaultsStrategies?.defaultValues || []}
      />
    </CardPage>
  );
};

export default EditReportPage;
