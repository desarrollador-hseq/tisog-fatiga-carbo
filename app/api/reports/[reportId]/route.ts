import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { formatInTimeZone } from "date-fns-tz";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { reportId: string } }
) {
  const session = await getServerSession(authOptions);
  try {
    if (!session) return new NextResponse("Unauthorized", { status: 401 })
    if (!params.reportId) return new NextResponse("Bad request", { status: 400 })
    const values = await req.json();

    const date = new Date()
    const colombiaTime = formatInTimeZone(date, 'America/Bogota', 'yyyy-MM-dd HH:mm:ssXXX');
    const newDate = new Date(colombiaTime)

    const report = await db.fatigueSleepReport.findUnique({
      where: {
        id: params.reportId
      }
    })
    if (!report) return new NextResponse("Bad request", { status: 400 })

    // Calcula el nivel de riesgo de fatiga
    const { appearances, moods, performances, drivingModes } = values;
    let totalItems = 0;
    if (values.appearances && values.appearances.trim() !== "") totalItems += values.appearances.split(",").length;
    if (values.moods && values.moods.trim() !== "") totalItems += values.moods.split(",").length;
    if (values.performances && values.performances.trim() !== "") totalItems += values.performances.split(",").length;
    if (values.drivingModes && values.drivingModes.trim() !== "") totalItems += values.drivingModes.split(",").length;


    let riskLevel = "LOW";
    if (totalItems >= 5 && totalItems <= 10) {
      riskLevel = "MEDIUM";
    } else if (totalItems > 10) {
      riskLevel = "HIGH";
    }

    console.log({ totalItems, apa: appearances.split(",").length, moods: moods.split(",").length, per: performances.split(",").length, driving: drivingModes.split(",").length , appearances })

    if (report.state === "PENDING") {
      const reportUpdated = await db.fatigueSleepReport.update({
        where: { id: params.reportId },
        data: {
          date: newDate,
          riskLevel: riskLevel,
          ...values,
        },
      });
      return NextResponse.json(reportUpdated);
    } else {
      const reportUpdated = await db.fatigueSleepReport.update({
        where: { id: params.reportId },

        data: { riskLevel: riskLevel, ...values },
      });
      return NextResponse.json(reportUpdated);
    }

  } catch (error) {
    console.log("[FATIGUE-SLEEP-REPORT-EDIT]", error);
    return new NextResponse("Internal Errorr " + error, { status: 500 });
  }
}
