

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { normalizeString } from "@/lib/utils";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    try {
        const values = await req.json();

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!values.realName) return new NextResponse("Bad request", { status: 400 })

        const existingCity = await db.city.findFirst({
            where: { realName: values.realName, active: true },
        });

        if (existingCity) {
            return new NextResponse("Nombre de ciudad ya registrada", {
                status: 400,
            });
        }

        const formatted = normalizeString(values.realName).trim().replace(" ", "-").toLowerCase();

        const company = await db.city.create({
            data: {
                formatted,
                ...values,
            },
        });

        return NextResponse.json(company);
    } catch (error) {
        console.log("[CITY-CREATE]", error);
        return new NextResponse("Internal Errorr" + error, { status: 500 });
    }
}
