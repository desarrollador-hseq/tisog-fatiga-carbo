

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { db } from "@/lib/db"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    try {
        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        const values = await req.json()

        console.log({ values })

        const date = new Date()

        const report = await db.fatigueSleepReport.create({
            data: {
                supervisorId: session.user.id,
                date,
                ...values
            }
        })

        return NextResponse.json(report)

    } catch (error) {
        console.log("[FATIGUE-SLEEP-REPORT-CREATE]", error)
        return new NextResponse("Internal Errorr " + error, { status: 500 })
    }

}
