import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { TableDefault } from "@/components/table-default";
import { db } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { CardPage } from "@/components/card-page";
import { cn } from "@/lib/utils";
import { leaderTableColumns } from "./_components/leader-table-columns";
import { TitleOnPage } from "@/components/title-on-page";
import { authOptions } from "@/lib/authOptions";
import { NotAuthorized } from "@/components/not-authorized";

const bcrumb = [{ label: "Líderes", path: "/admin/lideres" }];

const DriversPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session?.user?.role) {
    return <NotAuthorized />;
  }

  const leaders = await db.user.findMany({
    where: {
      active: true,
      role: "LEADER",
    },
    include: {
      company: true
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Listado de líderes" bcrumb={bcrumb}>
          <Link
            className={cn(buttonVariants({variant: "secondary"}))}
            href={`/admin/lideres/crear`}
          >
            Agregar
          </Link>
        </TitleOnPage>
      }
    >
      <TableDefault
        data={leaders}
        columns={leaderTableColumns}
        editHref={{ btnText: "editar", href: `/admin/lideres` }}
      />
    </CardPage>
  );
};

export default DriversPage;
