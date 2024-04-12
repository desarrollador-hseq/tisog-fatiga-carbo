import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  try {
    const values = await req.json();

   if(!session) return new NextResponse("Unauthorized", {status: 401})

    const existingDriver = await db.driver.findFirst({
      where: { numDoc: values.numDoc, active: true },
    });

    if (existingDriver) {
      return new NextResponse("Número de documento ya registrado", {
        status: 400,
      });
    }

    const driver = await db.driver.create({
      data: {
        ...values,
      },
    });

    return NextResponse.json(driver);
  } catch (error) {
    console.log("[DRIVER-CREATE]", error);
    return new NextResponse("Internal Errorr" + error, { status: 500 });
  }
}
