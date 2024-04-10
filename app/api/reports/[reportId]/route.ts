import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { reportId: string } }
) {
  const session = await getServerSession(authOptions);
  try {
    // if (!session) return new NextResponse("Unauthorized", { status: 401 })
    const values = await req.json();

    const report = await db.fatigueSleepReport.update({
      where: {
        id: params.reportId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.log("[FATIGUE-SLEEP-REPORT-EDIT]", error);
    return new NextResponse("Internal Errorr " + error, { status: 500 });
  }
}
