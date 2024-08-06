import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { TableDefault } from "@/components/table-default";
import { db } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { CardPage } from "@/components/card-page";
import { cn } from "@/lib/utils";
import { supervisorTableColumns } from "./_components/supervisor-table-columns";
import { TitleOnPage } from "@/components/title-on-page";
import { authOptions } from "@/lib/authOptions";
import { NotAuthorized } from "@/components/not-authorized";

const bcrumb = [{ label: "Supervisores", path: "/lider/supervisores" }];

const DriversPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session?.user?.role) {
    return <NotAuthorized />;
  }

  const supervisors = await db.user.findMany({
    where: {
      active: true,
      role: "USER",
      companyId: session.user.companyId
    },
    orderBy: {
      createdAt: "desc",
    },
  });


  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Listado de supervisores" bcrumb={bcrumb}>
          <Link
            className={cn(buttonVariants({ variant: "secondary" }))}
            href={`/lider/supervisores/crear`}
          >
            Agregar
          </Link>
        </TitleOnPage>
      }
    >
      <TableDefault
        data={supervisors}
        columns={supervisorTableColumns}
        editHref={{ btnText: "editar", href: `/lider/supervisores` }}
        nameDocument="supervisores"
      />
    </CardPage>
  );
};

export default DriversPage;
