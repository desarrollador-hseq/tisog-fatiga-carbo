import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/authOptions";


export async function PATCH(req: Request, { params }: { params: { leaderId: string } }) {
    try {
        const session = await getServerSession(authOptions)
        const { leaderId } = params;
        const values = await req.json()


        if (!session || session.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })

        const leaderSaved = await db.user.findUnique({
            where: {
                id: leaderId,
                role: "LEADER"
            }
        })

        if (!leaderSaved) return new NextResponse("Not found", { status: 404 })

        if (values.email) {
            if (values.email !== leaderSaved.email) {
                const result = await db.user.findFirst({
                    where: {
                        email: values.email,
                        active: true,
                    }
                })
                if (result) return new NextResponse("Email ya se encuentra registrado en un usuario activo", { status: 400 })
            }
        }
        if (values.numDoc) {
            if (values.numDoc !== leaderSaved.numDoc) {
                const result = await db.user.findFirst({
                    where: {
                        numDoc: values.numDoc,
                        active: true,
                    }
                })
                if (result) return new NextResponse("Número de documento ya registrado en un usuario activo", { status: 400 })
            }
        }


        const leaderUpdated = await db.user.update({
            where: {
                id: leaderId,
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(leaderUpdated)

    } catch (error) {
        console.log("[LEADER_PATCH_ID]", error)
        return new NextResponse("Internal Errorr" + error, { status: 500 })
    }
}