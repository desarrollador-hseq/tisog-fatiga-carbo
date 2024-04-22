import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    try {
      const values = await req.json();
  
     if(!session || session.user.role !== "ADMIN") return new NextResponse("Unauthorized", {status: 401})
  
      const existingLeader= await db.user.findFirst({
        where: { email: values.email, active: true },
      });

      const existingLeader2 = await db.user.findFirst({
        where: { numDoc: values.numDoc, active: true },
      });
  
      if (existingLeader) {
        return new NextResponse("Correo electrónico ya registrado", {
          status: 400,
        });
      }
      if (existingLeader2) {
        return new NextResponse("Número de documento ya registrado", {
          status: 400,
        });
      }
  
      const leader = await db.user.create({
        data: {
          role: "LEADER",
          ...values,
        },
      });
  
      return NextResponse.json(leader);
    } catch (error) {
      console.log("[LEADER-CREATE]", error);
      return new NextResponse("Internal Errorr" + error, { status: 500 });
    }
  }