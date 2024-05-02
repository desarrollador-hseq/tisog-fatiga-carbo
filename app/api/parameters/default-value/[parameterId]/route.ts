import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request,  { params }: { params: { parameterId: string } }) {
  const session = await getServerSession(authOptions);
  try {
    if (!session) return new NextResponse("Unauthorized", { status: 401 });
    const values = await req.json();


    const defaultValue = await db.defaultValue.create({
      data: {
        parameterId: params.parameterId,
        ...values,
      },
    });

    return NextResponse.json(defaultValue);
  } catch (error) {
    console.log("[CREATE-DEFAULT-VALUE]", error);
    return new NextResponse("Internal Errorr " + error, { status: 500 });
  }
}


