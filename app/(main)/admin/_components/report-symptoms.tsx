"use client";

import { Chart } from "@/components/chart";
import { DefaultValue, Driver, FatigueSleepReport } from "@prisma/client";

interface CollaboratorsReportsProps {
  reports: FatigueSleepReport & {driver: Driver | null}[];
  defaultsSymptoms: DefaultValue[]
}

export const ReportSymptoms = ({ reports, defaultsSymptoms }: CollaboratorsReportsProps) => {
  const processDataForBarChart = () => {
    const symptomsData: { [key: string]: number } = {};

    // Recorre todos los reportes
    reports.forEach((report) => {
      // Recorre todos los síntomas del reporte
      report.symptoms.split(",")?.forEach((symptomId) => {
        // Encuentra el síntoma correspondiente al ID en los defaultsSymptoms
        const symptom = defaultsSymptoms.find((item) => item.id === symptomId);
        if (symptom) {
          // Incrementa el contador del síntoma en el objeto symptomsData
          symptomsData[symptom.name] = (symptomsData[symptom.name] || 0) + 1;
        }
      });
    });

    // Extrae los nombres de los síntomas y sus recuentos del objeto symptomsData
    const nameSymptoms = Object.keys(symptomsData);
    const counts = Object.values(symptomsData);

    return { nameSymptoms, counts };
  };

  const { nameSymptoms, counts } = processDataForBarChart();

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

