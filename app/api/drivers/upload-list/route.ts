import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Driver } from "@prisma/client";
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

        const successfulInserts: Driver[] = [];
        const failedInserts: { data: Driver; error: Error | unknown }[] = [];

        for (const driver of values) {
            try {
                // Verifica si ya existe un empleado con el nombre y documento.
                if (!driver.fullname) {
                    throw new Error(`El nombre completo es obligatorio`);
                }

                if (!driver.numDoc) {
                    throw new Error(`El numero de documento es obligatorio`);
                }

                let companydb;
                if (driver.company) {
                    companydb = await db.company.findFirst({
                        where: {
                            name: driver.company,
                            active: true
                        }
                    })
                    if (!companydb) {
                        throw new Error(`Empresa no encontrada`);

                    }
                }
                let citydb;
                if (driver.city) {
                    citydb = await db.city.findFirst({
                        where: {
                            realName: driver.city,
                            active: true
                        }
                    })
                    if (!citydb) {
                        throw new Error(`Ciudad no encontrada`);

                    }
                }
                let positiondb;
                if (driver.position) {
                    positiondb = await db.position.findFirst({
                        where: {
                            name: driver.position,
                            active: true
                        }
                    })
                    if (!positiondb) {
                        throw new Error(`Cargo no encontrado`);

                    }
                }

                const existingEmployee = await db.driver.findFirst({
                    where: {
                        numDoc: driver.numDoc,
                        // companyId: session.user.id,
                        active: true,
                    },
                });


                // Si ya existe, lanza un error indicando que el correo electrónico ya está en uso.
                if (existingEmployee) {
                    throw new Error(`Ya existe un colaborador con el numero de cédula: ${existingEmployee.numDoc} `);
                }

                // Agrega el companyId al objeto de cada empleado antes de insertarlo.
                const employeeData = {
                    fullname: driver.fullname,
                    numDoc: driver.numDoc,
                    companyId: companydb?.id,
                    cityId: citydb?.id,
                    positionId: positiondb?.id,
                };

                // Inserta el empleado con el companyId.
                const insertedEmployee = await db.driver.create({ data: employeeData });
                successfulInserts.push(insertedEmployee);
            } catch (error: any) {
                // Captura objetos que generaron errores.
                failedInserts.push({ data: driver, error: error?.message || error });
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
