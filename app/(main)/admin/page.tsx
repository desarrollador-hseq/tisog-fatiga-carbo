import React from "react";
import { FatigueIndicators } from "./_components/fatigue-indicators";
import { db } from "@/lib/db";

const AdminHomePage = async () => {
  const reports = await db.fatigueSleepReport.findMany({
    where: {
      active: true,
    },
    include: {
      driver: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const defaultsSymptoms = await db.defaultValue.findMany({
    where: {
      active: true,
      parameters: {
        name: "symptoms",
      },
    },
  });

  return (
    <div>
      <FatigueIndicators
        reports={reports}
        defaultsSymptoms={defaultsSymptoms}
      />
    </div>
  );
};

export default AdminHomePage;
