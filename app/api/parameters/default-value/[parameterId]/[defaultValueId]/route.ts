import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { defaultValueId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { defaultValueId } = params;

    if (!session) return new NextResponse("Unauthorized", { status: 401 });
    if (!defaultValueId) return new NextResponse("Not Found", { status: 404 });

    const defaultValueDeleted = await db.defaultValue.update({
      where: {
        id: defaultValueId,
      },
      data: {
        active: false,
      },
    });

    return NextResponse.json(defaultValueDeleted);
  } catch (error) {
    console.log("[DELETED_ID_COLABORATOR]", error);
    return new NextResponse("Internal Errorr", { status: 500 });
  }
}
