import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";



export async function PATCH(req: Request, { params }: { params: { positionId: string } }) {
    const session = await getServerSession(authOptions);
    try {
        const values = await req.json();

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!params.positionId) return new NextResponse("Bad request", { status: 400 })
        if (!values.name) return new NextResponse("Bad request", { status: 400 })


        const positiondb = await db.position.findUnique({
            where: {
                id: params.positionId
            }
        })

        if (!positiondb) return new NextResponse("Bad request", { status: 400 })

        if (positiondb.name !== values.name) {
            const positonExist = await db.position.findFirst({
                where: {
                    name: values.name,
                    active: true,
                }
            })

            if (positonExist) return new NextResponse("Cargo ya se encuentra registrado", { status: 400 })
        }

        const positon = await db.position.update({
            where: {
                id: params.positionId
            },
            data: {
                ...values,
            },
        });

        return NextResponse.json(positon);
    } catch (error) {
        console.log("[POSITION-UPDATED]", error);
        return new NextResponse("Internal Errorr" + error, { status: 500 });
    }
}


export async function DELETE(req: Request, { params }: { params: { positionId: string } }) {

    try {
        const session = await getServerSession(authOptions)
        const { positionId } = params;

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!positionId) return new NextResponse("Not Found", { status: 404 })

        const positionDeleted = await db.position.update({
            where: {
                id: positionId,
            },
            data: {
                active: false
            }

        })

        return NextResponse.json(positionDeleted)

    } catch (error) {
        console.log("[DELETED_ID_POSITION]", error)
        return new NextResponse("Internal Errorr " + error, { status: 500 })
    }
}
