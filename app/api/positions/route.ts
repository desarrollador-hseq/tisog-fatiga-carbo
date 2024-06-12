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

        const existingPosition = await db.position.findFirst({
            where: { name: values.name, active: true },
        });

        if (existingPosition) {
            return new NextResponse("Cargo ya se encuentra registrado", {
                status: 400,
            });
        }

        const position = await db.position.create({
            data: {
                ...values,
            },
        });

        return NextResponse.json(position);
    } catch (error) {
        console.log("[POSITION-CREATE]", error);
        return new NextResponse("Internal Errorr" + error, { status: 500 });
    }
}
