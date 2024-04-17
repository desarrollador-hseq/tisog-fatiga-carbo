"use client";

import { Chart } from "@/components/chart";
import { DefaultValue, Driver, FatigueSleepReport } from "@prisma/client";


interface CollaboratorsReportsProps {
  reports: FatigueSleepReport[];
  defaultsSymptoms: DefaultValue[];
}

export const ReportSymptoms = ({
  reports,
  defaultsSymptoms,
}: CollaboratorsReportsProps) => {
  const processDataForBarChart = () => {
    const symptomsData: { [key: string]: number } = {};

    reports.forEach((report) => {
      report?.symptoms &&
        report?.symptoms?.split(",")?.forEach((symptomId) => {
          const symptom = defaultsSymptoms.find(
            (item) => item.id === symptomId
          );
          if (symptom) {
            symptomsData[symptom.name] = (symptomsData[symptom.name] || 0) + 1;
          }
        });
    });

    const nameSymptoms = Object.keys(symptomsData);
    const counts = Object.values(symptomsData);

    return { nameSymptoms, counts };
  };

  const { nameSymptoms, counts } = processDataForBarChart();

  const col = [
    "#1DACD6",
    "#6699CC",
    "#3B3B6D",
    "#4CB7A5",
    "#ACE5EE",
    "#00B9FB",
    "#551B8C",
    "#9966CC",
    "#33FFDD",
    "#841B2D",
    "#C46210",
    "#8833FF",
    "#FF3363",
    "#33FF70",
    "#FF5733",
    "#33FF57",
    "#5733FF",
    "#FF33A1",
    "#33B8FF",
    "#FFC733",
    "#6E33FF",
    "#FF3354",
    "#33FFDD",
    "#FF8E33",
    "#33FF8B",
    "#8833FF",
    "#FF3363",
    "#33FF70",
    "#FF5733",
    "#33FF57",
  ];

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
      bottom: nameSymptoms.length > 5 ? "6%" : "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: nameSymptoms,
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        rotate: nameSymptoms.length > 3 ? 20 : 0,
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
        data: nameSymptoms.map((city, index) => ({
          value: counts[index],
          itemStyle: { color: col[index] },
          name: city,
        })),
        barMaxWidth: nameSymptoms.length > 3 ? "" : "40%",
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
