import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { driverId: string } }) {
  const session = await getServerSession(authOptions);
  try {
    const values = await req.json();

    // if(!session) return new NextResponse("Unauthorized", {status: 401})

    const existingDriver = await db.driver.findUnique({
      where: { id: params.driverId, active: true },
    });

 
    if (!existingDriver) {
      return new NextResponse("Conductor no encontrado", {
        status: 400,
      });
    }

    const driver = await db.driver.update({
      where: {
        id: params.driverId
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(driver);
  } catch (error) {
    console.log("[DRIVER-CREATE]", error);
    return new NextResponse("Internal Errorr", { status: 500 });
  }
}