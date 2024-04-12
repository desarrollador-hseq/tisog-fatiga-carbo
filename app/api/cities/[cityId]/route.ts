

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { normalizeString } from "@/lib/utils";

export async function PATCH(req: Request, { params }: { params: { cityId: string } }) {
    const session = await getServerSession(authOptions);
    try {
        const values = await req.json();

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!values.realName) return new NextResponse("Bad request", { status: 400 })

        const existingCity = await db.city.findFirst({
            where: { id: params.cityId, active: true },
        });

        if (!existingCity) {
            return new NextResponse("Ciudad no encontrada", {
                status: 400,
            });
        }

        const formatted = normalizeString(values.realName).trim().replace(" ", "-").toLowerCase();

        const company = await db.city.update({
            where: {
                id: params.cityId
            },
            data: {
                formatted,
                ...values,
            },
        });

        return NextResponse.json(company);
    } catch (error) {
        console.log("[CITY-UPDATED]", error);
        return new NextResponse("Internal Errorr" + error, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { cityId: string } }) {

    try {
        const session = await getServerSession(authOptions)
        const { cityId } = params;

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!cityId) return new NextResponse("Not Found", { status: 404 })

        const cityDeleted = await db.city.update({
            where: {
                id: cityId,
            },
            data: {
                active: false
            }

        })

        return NextResponse.json(cityDeleted)

    } catch (error) {
        console.log("[DELETED_ID_CITY]", error)
        return new NextResponse("Internal Errorr " + error, { status: 500 })
    }
}
