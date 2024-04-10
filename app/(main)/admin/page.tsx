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
  return (
    <div>
      <FatigueIndicators reports={reports} />
    </div>
  );
};

export default AdminHomePage;
