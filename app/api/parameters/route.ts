import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";



export async function POST(req: Request, { params }: { params: { parameterId: string } }) {
  const session = await getServerSession(authOptions);
  try {
    if (!session) return new NextResponse("Unauthorized", { status: 401 });
    const values = await req.json();


    const parameter = await db.parameter.create({
      data: {
        ...values,
      },
    });

    return NextResponse.json(parameter);
  } catch (error) {
    console.log("[CREATE-PARAMETER]", error);
    return new NextResponse("Internal Errorr " + error, { status: 500 });
  }
}
