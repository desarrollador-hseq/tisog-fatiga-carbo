import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { parameterId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { parameterId } = params;
    const values = await req.json();

    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const userUpdated = await db.parameter.update({
      where: {
        id: parameterId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(userUpdated);
  } catch (error) {
    console.log("[PARAMETER_PATCH_ID]", error);
    return new NextResponse("Internal Errorr" + error, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { parameterId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { parameterId } = params;

    if (!session) return new NextResponse("Unauthorized", { status: 401 });
    if (!parameterId) return new NextResponse("Not Found", { status: 404 });

    const parameterDeleted = await db.parameter.update({
      where: {
        id: parameterId,
      },
      data: {
        active: false,
      },
    });

    return NextResponse.json(parameterDeleted);
  } catch (error) {
    console.log("[DELETED_PARAMETER", error);
    return new NextResponse("Internal Errorr", { status: 500 });
  }
}
