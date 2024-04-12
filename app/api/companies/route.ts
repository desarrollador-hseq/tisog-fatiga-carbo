import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    try {
      const values = await req.json();
  
     if(!session) return new NextResponse("Unauthorized", {status: 401})
  
      const existingCompany= await db.company.findFirst({
        where: { nit: values.nit, active: true },
      });
  
      if (existingCompany) {
        return new NextResponse("NIT ya registrado", {
          status: 400,
        });
      }
  
      const company = await db.company.create({
        data: {
          ...values,
        },
      });
  
      return NextResponse.json(company);
    } catch (error) {
      console.log("[COMPANY-CREATE]", error);
      return new NextResponse("Internal Errorr" + error, { status: 500 });
    }
  }
  