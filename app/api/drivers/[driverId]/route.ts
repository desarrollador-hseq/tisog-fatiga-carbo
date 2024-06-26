import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { driverId: string } }) {
  const session = await getServerSession(authOptions);
  try {
    const values = await req.json();

    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    const existingDriver = await db.driver.findUnique({
      where: { id: params.driverId, active: true },
    });

    if (!existingDriver) {
      return new NextResponse("Conductor no encontrado", {
        status: 400,
      });
    }

    if (values.numDoc) {
      if (existingDriver.numDoc !== values.numDoc) {
        const result = await db.driver.findFirst({
          where: {
            numDoc: values.numDoc,
            active: true,
          }
        })
        if (result) return new NextResponse("Número de documento ya registrado en un conductor activo", { status: 400 })
      }
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
    console.log("[DRIVER-PATCH-ID]", error);
    return new NextResponse("Internal Errorr" + error, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { driverId: string } }) {

  try {
      const session = await getServerSession(authOptions)
      const { driverId } = params;

      if (!session) return new NextResponse("Unauthorized", { status: 401 })
      if (!driverId) return new NextResponse("Not Found", { status: 404 })

      const driverDeleted = await db.driver.update({
          where: {
              id: driverId,
          },
          data: {
              active: false
          }
      })

      return NextResponse.json(driverDeleted)

  } catch (error) {
      console.log("[DELETED_ID_DRIVER]", error)
      return new NextResponse("Internal Errorr " + error, { status: 500 })
  }
}
