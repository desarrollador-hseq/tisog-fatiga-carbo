import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";



export async function PATCH(req: Request, { params }: { params: { centerId: string } }) {
    const session = await getServerSession(authOptions);
    try {
        const values = await req.json();

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!params.centerId) return new NextResponse("Bad request", { status: 400 })
        if (!values.name || !values.companyId) return new NextResponse("Bad request", { status: 400 })


        const centerdb = await db.logisticsCenter.findUnique({
            where: {
                id: params.centerId
            }
        })

        if (!centerdb) return new NextResponse("Bad request", { status: 400 })
        
        if (centerdb.name !== values.name) {
            const centerExist = await db.logisticsCenter.findFirst({
                where: {
                    name: values.name,
                    active: true,
                }
            })
            
            if (centerExist) return new NextResponse("Ya existe un centro logístico con ese nombre", { status: 400 })
        }

        const center = await db.logisticsCenter.update({
            where: {
                id: params.centerId
            },
            data: {
                ...values,
            },
        });

        return NextResponse.json(center);
    } catch (error) {
        console.log("[LOGISTICS-CENTER-UPDATED]", error);
        return new NextResponse("Internal Errorr" + error, { status: 500 });
    }
}


export async function DELETE(req: Request, { params }: { params: { centerId: string } }) {

    try {
        const session = await getServerSession(authOptions)
        const { centerId } = params;

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!centerId) return new NextResponse("Not Found", { status: 404 })

        const centerDeleted = await db.logisticsCenter.update({
            where: {
                id: centerId,
            },
            data: {
                active: false
            }

        })

        return NextResponse.json(centerDeleted)

    } catch (error) {
        console.log("[DELETED_ID_LOGISTICS-CENTER]", error)
        return new NextResponse("Internal Errorr " + error, { status: 500 })
    }
}
