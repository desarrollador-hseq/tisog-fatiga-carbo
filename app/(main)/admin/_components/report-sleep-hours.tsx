"use client";

import { Chart } from "@/components/chart";
import {
  Driver,
  FatigueSleepReport,
  FatigueSleepReportStatus,
} from "@prisma/client";




export const ReportSleepHours = ({ reports }: {reports: FatigueSleepReport[]}) => {
  const processDataForPieChart = () => {
    const hoursData: { [key: number]: number } = {};

    // Contar las ocurrencias de cada número de horas de sueño
    reports.forEach((report) => {
      const hours = report.sleepingHours;
      if (!hours) return;
      hoursData[hours] = (hoursData[hours] || 0) + 1;
    });

    // Extraer los números de horas y sus recuentos del objeto hoursData
    const hours = Object.keys(hoursData);
    const counts = Object.values(hoursData);

    return { hours, counts };
  };

  const { hours, counts } = processDataForPieChart();

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
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
