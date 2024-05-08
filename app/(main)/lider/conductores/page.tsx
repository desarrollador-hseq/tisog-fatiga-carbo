import Link from "next/link";
import { getServerSession } from "next-auth";
import { TableDefault } from "@/components/table-default";
import { db } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { CardPage } from "@/components/card-page";
import { cn } from "@/lib/utils";
import { driverTableColumns } from "./_components/driver-table-columns";
import { TitleOnPage } from "@/components/title-on-page";
import { authOptions } from "@/lib/authOptions";
import { NotAuthorized } from "@/components/not-authorized";

const bcrumb = [{ label: "Conductores", path: "/admin/conductores" }];

const DriversPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session?.user?.role) {
    return <NotAuthorized />;
  }

  const drivers = await db.driver.findMany({
    where: {
      active: true,
    },
    include: {
      company: {
        select: {
          name: true
        }
      },
      city: {
        select: {
          realName: true
        }
      },
      position: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Listado de conductores" bcrumb={bcrumb}>
          <Link
            className={cn(buttonVariants({variant: "secondary"}))}
            href={`/lider/conductores/crear`}
          >
            Agregar
          </Link>
        </TitleOnPage>
      }
    >
      <TableDefault
        data={drivers}
        columns={driverTableColumns}
        editHref={{ btnText: "editar", href: `/lider/conductores` }}
      />
    </CardPage>
  );
};

export default DriversPage;
