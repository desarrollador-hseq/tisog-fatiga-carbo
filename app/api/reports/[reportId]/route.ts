import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
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



    const report = await db.fatigueSleepReport.findUnique({
      where: {
        id: params.reportId
      },
      include: {
        city: {
          select: {
            realName: true,
          }
        },
        logisticsCenter: {
          include: {
            company: true
          }
        },
        driver: {
          select: {
            fullname: true,
            position: {
              select: {
                name: true
              }
            },
          }
        },
      }
    })
    if (!report) return new NextResponse("Bad request", { status: 400 })

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


    const reportUpdated = await db.fatigueSleepReport.update({
      where: { id: params.reportId },
      data: { riskLevel: riskLevel, ...values },
    });

    if (session.user.role === "ADMIN" || session.user.role === "LEADER") {
      await db.fatigueReportEvent.create({
        data: {
          eventType: "UPDATED",
          userId: session.user.id!,
          fatigueReportId: report.id,
          reportData: JSON.stringify(reportUpdated),
        }
      })
    } else {
      await db.fatigueReportEvent.create({
        data: {
          eventType: "CREATED",
          userId: session.user.id!,
          fatigueReportId: report.id,
          reportData: JSON.stringify(reportUpdated)
        }
      })

    }



    return NextResponse.json(reportUpdated);


  } catch (error) {
    console.log("[FATIGUE-SLEEP-REPORT-EDIT]", error);
    return new NextResponse("Internal Errorr " + error, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { reportId: string } }) {

  try {
    const session = await getServerSession(authOptions)
    const { reportId } = params;

    if (!session) return new NextResponse("Unauthorized", { status: 401 })
    if (!reportId) return new NextResponse("Not Found", { status: 404 })

    const reportCanceled = await db.fatigueSleepReport.update({
      where: {
        id: reportId,
        active: true
      },
      data: {
        state: "CANCELLED"
      }
    })

    await db.fatigueReportEvent.create({
      data: {
        eventType: "DELETED",
        userId: session.user.id!,
        fatigueReportId: reportCanceled.id,
        reportData: JSON.stringify(reportCanceled)
      }
    })

    return NextResponse.json(reportCanceled)

  } catch (error) {
    console.log("[CANCEL_ID_REPORT]", error)
    return new NextResponse("Internal Errorr " + error, { status: 500 })
  }
}
