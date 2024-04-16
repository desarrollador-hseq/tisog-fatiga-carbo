"use client";

import { Chart } from "@/components/chart";
import { FatigueSleepReport } from "@prisma/client";

export const ReportSleepHours = ({
  reports,
}: {
  reports: FatigueSleepReport[];
}) => {
  const processDataForPieChart = () => {
    const hoursData: { [key: number]: number } = {};

    
    reports.forEach((report) => {
      const hours = report.sleepingHours;
      if (!hours) return;
      hoursData[hours] = (hoursData[hours] || 0) + 1;
    });

    
    const hours = Object.keys(hoursData);
    const counts = Object.values(hoursData);

    return { hours, counts };
  };

  const { hours, counts } = processDataForPieChart();

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "<strong>{b} Horas</strong> </br >{d}%: ({c})",
    },
    legend: {
      orient: "horizontal",
      left: "center",
      data: hours.map((hour, index) => ({ name: hour, icon: "circle" })),
    },
    series: [
      {
        name: "Horas de sueño ",
        type: "pie",
        radius: "55%",
        center: ["50%", "60%"],
        data: hours.map((hour, index) => ({
          value: counts[index],
          name: hour,
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return <Chart option={option} title="Horas de sueño más frecuentes" />;
};
