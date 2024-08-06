import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { reportId: string } }) {

    try {
        const session = await getServerSession(authOptions)
        const { reportId } = params;

        if (!session || session.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })
        if (!reportId) return new NextResponse("Not Found", { status: 404 })

        const reportCanceled = await db.fatigueSleepReport.update({
            where: {
                id: reportId,
                active: true
            },
            data: {
                active: false
            }
        })

        await db.fatigueReportEvent.create({
            data: {
                eventType: "DELETED",
                userId: session.user.id!,
                fatigueReportId: reportCanceled.id,
                reportData: JSON.stringify(reportCanceled) + "--deleted"
            }
        })

        return NextResponse.json(reportCanceled)

    } catch (error) {
        console.log("[DELETE_ID_REPORT]", error)
        return new NextResponse("Internal Errorr " + error, { status: 500 })
    }
}
