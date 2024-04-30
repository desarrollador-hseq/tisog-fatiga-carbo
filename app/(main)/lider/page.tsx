import React from "react";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { FatigueIndicators } from "../_components/indicators/fatigue-indicators";
import { HeaderDateFilter } from "../_components/header-date-filter";
import { authOptions } from "@/lib/authOptions";
import { NotAuthorized } from "@/components/not-authorized";

const LeaderHomePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session?.user?.role) {
    return <NotAuthorized />;
  }

  const reports = await db.fatigueSleepReport.findMany({
    where: {
      active: true,
      state: "SEND",
      logisticsCenter: {
        companyId: session.user.companyId,
      },
    },
    include: {
      driver: true,
      supervisor: {
        select: {
          name: true,
        },
      },
      city: {
        select: {
          realName: true,
        },
      },
      logisticsCenter: {
        select: {
          name: true,
          companyId: true,
          company: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const defaultsValues = await db.defaultValue.findMany({
    where: {
      active: true,
    },
    include: {
      parameters: {
        select: {
          name: true,
        },
      },
    },
  });

  const cities = await db.city.findMany({
    where: {
      active: true,
    },
  });

  const companies = await db.company.findMany({
    where: {
      active: true,
    },
  });

  return (
    <div className="">
      <HeaderDateFilter companies={companies} cities={cities} />
      <FatigueIndicators reports={reports} defaultsValues={defaultsValues} />
    </div>
  );
};

export default LeaderHomePage;
