import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Driver, User } from "@prisma/client";
import { authOptions } from "@/lib/authOptions";

import { db } from "@/lib/db";

export async function POST(
    req: Request,
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const values = await req.json();

        if (!session.user.id) return new NextResponse("Unauthorized", { status: 401 });

        const successfulInserts: User[] = [];
        const failedInserts: { data: User; error: Error | unknown }[] = [];

        for (const user of values) {
            try {
                // Verifica si ya existe un empleado con el nombre y documento.
                if (!user.name) {
                    throw new Error(`El nombre completo es obligatorio`);
                }

                if (!user.numDoc) {
                    throw new Error(`El numero de documento es obligatorio`);
                }

                let companydb;
                if (user.company) {
                    companydb = await db.company.findFirst({
                        where: {
                            name: user.company,
                            active: true
                        },
                        select:
                            { id: true }
                    })
                    if (!companydb) {
                        throw new Error(`Empresa no encontrada`);
                    }
                }

                const existingEmail = await db.user.findFirst({
                    where: {
                        email: user.email,
                        active: true,
                    },
                    select: {
                        email: true
                    }
                });
                if (existingEmail) {
                    throw new Error(`Ya existe un usuario con correo electrónico: ${existingEmail.email} `);
                }
                const existingNumDoc = await db.user.findFirst({
                    where: {
                        numDoc: user.numDoc,
                        active: true,
                    },
                    select: {
                        numDoc: true
                    }
                });
                if (existingNumDoc) {
                    throw new Error(`Ya existe un colaborador con el numero de cédula: ${existingNumDoc.numDoc} `);
                }

                // Agrega el companyId al objeto de cada empleado antes de insertarlo.
                const userData = {
                    name: user.name,
                    numDoc: user.numDoc,
                    email: user.email,
                    companyId: companydb?.id,
                    role: "USER"
                };

                // Inserta el empleado con el companyId.
                const insertedUser = await db.user.create({ data: userData });
                successfulInserts.push(insertedUser);
            } catch (error: any) {
                // Captura objetos que generaron errores.
                failedInserts.push({ data: user, error: error?.message || error });
                console.error(error);
            }
        }

        // Devuelve los resultados al componente.
        return NextResponse.json({ successfulInserts, failedInserts }, { status: 200 });
        // return res.status(200).json({ successfulInserts, failedInserts });
    } catch (error) {
        console.log("[DRIVERS_CREATE_MANY]", error);
        return new NextResponse("Internal Errorr" + error, { status: 500 });
    }
}
