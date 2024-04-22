import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";


export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    try {
        const values = await req.json();

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!values.name) return new NextResponse("Bad request", { status: 400 })

        const existingCenter = await db.logisticsCenter.findFirst({
            where: { name: values.name, active: true },
        });

        if (existingCenter) {
            return new NextResponse("Nombre de centro logístico ya registrado", {
                status: 400,
            });
        }

        const center = await db.logisticsCenter.create({
            data: {
                ...values,
            },
        });

        return NextResponse.json(center);
    } catch (error) {
        console.log("[LOGISTICS-CENTER-CREATE]", error);
        return new NextResponse("Internal Errorr" + error, { status: 500 });
    }
}
