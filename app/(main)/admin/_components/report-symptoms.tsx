"use client";

import { Chart } from "@/components/chart";
import { Driver, FatigueSleepReport } from "@prisma/client";

interface CollaboratorsReportsProps {
  reports: FatigueSleepReport & {driver: Driver | null}[];
}

export const ReportSymptoms = ({ reports }: CollaboratorsReportsProps) => {
  const processDataForBarChart = () => {
    const symptomsData: { [key: string]: number } = {};

    // Recorre todos los reportes y cuenta la ocurrencia de cada síntoma
    reports.forEach((report) => {
      report.symptoms?.split("|").forEach((symptom) => {
        symptomsData[symptom] = (symptomsData[symptom] || 0) + 1;
      });
    });

    // Extrae las ciudades (síntomas) y sus recuentos del objeto symptomsData
    const cities = Object.keys(symptomsData);
    const counts = Object.values(symptomsData);

    return { cities, counts };
  };

  const { cities, counts } = processDataForBarChart();

  const col = [
    "#1DACD6", "#6699CC", "#3B3B6D", "#4CB7A5", "#ACE5EE",
    "#00B9FB", "#551B8C", "#9966CC", "#33FFDD", "#841B2D",
    "#C46210", "#8833FF", "#FF3363", "#33FF70", "#FF5733",
    "#33FF57", "#5733FF", "#FF33A1", "#33B8FF", "#FFC733",
    "#6E33FF", "#FF3354", "#33FFDD", "#FF8E33", "#33FF8B",
    "#8833FF", "#FF3363", "#33FF70", "#FF5733", "#33FF57"
  ]

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: cities.length > 5 ? "6%" : "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: cities,
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        rotate: cities.length > 3 ? 20 : 0,
      },
    },
    yAxis: {
      type: "value",
      show: false,
      axisLabel: {
        formatter: (value: any) => Math.round(value),
      },
    },

    series: [
      {
        label: {
          show: false,
        },
        data: cities.map((city, index) => ({
          value: counts[index],
        itemStyle: { color: col[index] },
          name: city,
        })),
        barMaxWidth: cities.length > 3 ? "" : "40%",
        type: "bar",
        color: "#fff",
      },
    ],
    title: {
      show: counts.length === 0,
      textStyle: {
        color: "#808080",
        fontSize: 18,
      },
      text: "Sin datos",
      left: "center",
      top: "center",
    },
  };

  return <Chart option={option} title="Síntomas más frecuentes" />;
};
