"use client";

import { formatDate } from "@/lib/utils";
import { FatigueSleepReport } from "@prisma/client";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  View,
  Image,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Roboto Condensed",
  fonts: [
    {
      src: "/font/RobotoCondensed-Bold.ttf",
      fontWeight: "bold",
    },
    {
      src: "/font/RobotoCondensed-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "/font/RobotoCondensed-SemiBold.ttf",
      fontWeight: "semibold",
    },
    {
      src: "/font/RobotoCondensed-SemiBoldItalic.ttf",
      fontWeight: "semibold",
      fontStyle: "italic",
    },
    {
      src: "/font/RobotoCondensed-Light.ttf",
      fontWeight: "light",
    },
    {
      src: "/font/RobotoCondensed-Medium.ttf",
      fontWeight: "medium",
    },
  ],
});

interface FatigueReportTemplateProps {
  report: FatigueSleepReport & {
    logisticsCenter: { company: { logoImgUrl: string | null } | null } | null;
    driver: { fullname: string | null; numDoc: string | null } | null;
    supervisor: { name: string | null; numDoc: string | null } | null;
    city: { realName: string } | null;
  };
  symptomsArray: string[];
  behaviorsArray: string[];
  appearancesArray: string[];
  moodsArray: string[];
  performancesArray: string[];
  drivingModesArray: string[];
}

export const FatigueReportTemplate = ({
  report,
  symptomsArray,
  behaviorsArray,
  appearancesArray,
  moodsArray,
  performancesArray,
  drivingModesArray,
}: FatigueReportTemplateProps) => {
  console.log({ report });
  const { logisticsCenter, date, driver, supervisor, city } = report;

  const dateFormat = date ? formatDate(date) : "";
  const medicines = report.medicine?.split("|") || [];

  return (
    <Document style={{ height: "100%", width: "100%", margin: "auto" }}>
      <Page size="A4" style={styles.page}>
        <View
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <View style={{ ...styles.table }}>
            {/* TableHeader */}
            {/* Logo */}
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <View
                  style={{
                    ...styles.tableCell,
                    maxHeight: "50px",
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    src={`${logisticsCenter?.company?.logoImgUrl}`}
                    style={{ width: "130px", height: "auto" }}
                  />
                </View>{" "}
              </View>
              {/* titulo: reporte de fatiga */}
              <View style={{ ...styles.tableCol }}>
                <View
                  style={{
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    borderTopWidth: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 28,
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 13 }}>
                    REPORTE DE FATIGA Y SUEÑO
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.tableCell,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <Text style={{ fontWeight: "semibold" }}>Nivel:</Text>
                  <Text style={{ fontWeight: "normal" }}>
                    {report.riskLevel === "HIGH" ? (
                      <Text style={{ color: "red", fontWeight: "semibold" }}>
                        ALTO
                      </Text>
                    ) : report.riskLevel === "MEDIUM" ? (
                      <Text style={{ color: "orange", fontWeight: "semibold" }}>
                        MEDIO
                      </Text>
                    ) : (
                      <Text style={{ color: "gray", fontWeight: "semibold" }}>
                        BAJO
                      </Text>
                    )}
                  </Text>
                </View>
              </View>
              <View style={{ ...styles.tableCol }}>
                <View
                  style={{
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    borderTopWidth: 0,
                    height: 28,
                  }}
                >
                  <View
                    style={{
                      ...styles.tableCell,
                      display: "flex",
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <Text style={{ fontWeight: "semibold" }}>Fecha:</Text>
                    <Text style={{ fontWeight: "normal" }}>{dateFormat}</Text>
                  </View>
                </View>
                <View
                  style={{
                    ...styles.tableCell,
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={{ fontWeight: "semibold" }}>Ciudad:</Text>
                  <Text style={{ fontWeight: "normal" }}>{city?.realName}</Text>
                </View>
              </View>
            </View>
            {/* TableContent */}
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCol, width: "66.6%" }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: "semibold" }}>
                    CONDUCTOR:
                  </Text>
                  <Text style={{ fontSize: 12 }}>{driver?.fullname}</Text>
                </View>
              </View>
              <View style={{ ...styles.tableCol, width: "33.3%" }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: "semibold" }}>
                    DOCUMENTO:
                  </Text>
                  <Text style={{ fontSize: 12 }}>{driver?.numDoc}</Text>
                </View>
              </View>
            </View>
            {/* ==================================== */}
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCol, width: "66.6%" }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: "semibold" }}>
                    SUPERVISOR:
                  </Text>
                  <Text style={{ fontSize: 12 }}>{supervisor?.name}</Text>
                </View>
              </View>
              <View style={{ ...styles.tableCol, width: "33.3%" }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: "semibold" }}>
                    DOCUMENTO:
                  </Text>
                  <Text style={{ fontSize: 12 }}>{supervisor?.numDoc}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* =================================================== */}
          <View
            style={{
              display: "flex",
              width: "100%",
              height: "auto",
              padding: 10,
              marginTop: 2,
            }}
          >
            {/* Symptoms */}
            <View style={{ marginTop: 2 }}>
              <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                1. SINTOMAS:
              </Text>

              <View
                style={{
                  backgroundColor: "#dbe5ec",
                  border: "1px solid #99abbd",
                  margin: "5px",
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 6,
                  padding: 8,
                }}
              >
                {symptomsArray.map((item, index) => {
                  if (!item || item === "") return;
                  return <Text key={item + index} style={styles.itemRow}>{item}</Text>;
                })}
              </View>
            </View>

            {/* Medicines */}
            <View style={{ marginTop: 7 }}>
              <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                2. MEDICAMENTOS:
              </Text>

              <View
                style={{
                  backgroundColor: "#dbe5ec",
                  border: "1px solid #99abbd",
                  margin: "5px",
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 6,
                  padding: 8,
                }}
              >
                {medicines.map((item, index) => {
                  if (!item || item === "") return;
                  return <Text key={item + index} style={styles.itemRow}>{item}</Text>;
                })}
              </View>
            </View>
            {/* HOURS */}
            <View style={{ marginTop: 7 }}>
              <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                3. HORAS DE SUEÑO:
              </Text>

              <View
                style={{
                  backgroundColor: "#dbe5ec",
                  border: "1px solid #99abbd",
                  margin: "5px",
                  display: "flex",
                  flexDirection: "row",
                  gap: 6,
                  padding: 8,
                }}
              >
                <View
                  style={{ width: "50%", borderRight: "2px solid #9db2c1" }}
                >
                  <Text style={{ fontSize: 11, fontWeight: "semibold" }}>
                    ¿Cuántas horas ha dormido en las últimas 24 horas?
                  </Text>
                  <Text style={{ fontSize: 11 }}>{report.sleepingHours}</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={{ fontSize: 11, fontWeight: "semibold" }}>
                    ¿Cuántas horas ha dormido en las últimas 48 horas?
                  </Text>
                  <Text style={{ fontSize: 11 }}>{report.sleepingHours48}</Text>
                </View>
              </View>
            </View>

            {/* behaviors */}
            <View style={{ marginTop: 7 }}>
              <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                4. COMPORTAMIENTO:
              </Text>

              <View
                style={{
                  backgroundColor: "#dbe5ec",
                  border: "1px solid #99abbd",
                  margin: "5px",
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 6,
                  padding: 8,
                }}
              >
                {behaviorsArray.map((item, index) => {
                  if (!item || item === "") return;
                  return <Text key={item + index} style={styles.itemRow}>{item}</Text>;
                })}
              </View>
            </View>

            {/* Signs */}
            <View style={{ marginTop: 7 }}>
              <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                5. SIGNOS:
              </Text>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  backgroundColor: "#e8f0f4",
                  border: "1px solid #99abbd",
                  flexWrap: "wrap",
                }}
              >
                {/* Appareances */}
                <View style={styles.tableSignsContent}>
                  <Text
                    style={{
                      backgroundColor: "#c8d5df",
                      padding: 4,
                      fontSize: 12,
                    }}
                  >
                    Apariencia:
                  </Text>
                  {Array.from({
                    length: Math.max(6, appearancesArray.length),
                  }).map((_, index) => (
                    <Text key={index} style={styles.rowSign}>
                      {appearancesArray[index] || ""}{" "}
                    </Text>
                  ))}
                </View>
                {/* Moods */}
                <View style={styles.tableSignsContent}>
                  <Text
                    style={{
                      backgroundColor: "#c8d5df",
                      padding: 4,
                      fontSize: 12,
                    }}
                  >
                    Ánimo:
                  </Text>

                  {Array.from({
                    length: Math.max(6, moodsArray.length),
                  }).map((_, index) => (
                    <Text key={index} style={styles.rowSign}>
                      {moodsArray[index] || ""}{" "}
                    </Text>
                  ))}
                </View>
                {/* Performances */}
                <View style={styles.tableSignsContent}>
                  <Text
                    style={{
                      backgroundColor: "#c8d5df",
                      padding: 2,
                      fontSize: 12,
                    }}
                  >
                    Desempeño:
                  </Text>

                  {Array.from({
                    length: Math.max(6, performancesArray.length),
                  }).map((_, index) => (
                    <Text key={index} style={styles.rowSign}>
                      {performancesArray[index] || ""}{" "}
                    </Text>
                  ))}
                </View>
                {/* DrivingModes */}
                <View style={styles.tableSignsContent}>
                  <Text
                    style={{
                      backgroundColor: "#c8d5df",
                      padding: 2,
                      fontSize: 12,
                    }}
                  >
                    Conducción:
                  </Text>

                  {Array.from({
                    length: Math.max(6, drivingModesArray.length),
                  }).map((_, index) => (
                    <Text key={index} style={styles.rowSign}>
                      {drivingModesArray[index] || ""}{" "}
                    </Text>
                  ))}
                </View>
              </View>

              {/* DESCRIPTION */}
              <View style={{ marginTop: 7 }}>
                <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                  6. DESCRIPCIÓN:
                </Text>

                <View
                  style={{
                    backgroundColor: "#dbe5ec",
                    border: "1px solid #99abbd",
                    margin: "5px",
                    display: "flex",
                    flexDirection: "row",
                    gap: 6,
                    padding: 8,
                  }}
                >
                  <Text style={{ fontSize: 10 }}>
                    {report.fatigueCauseDescription}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto Condensed",
    backgroundColor: "#fff",
    padding: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  table: {
    fontFamily: "Roboto Condensed",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    fontFamily: "Roboto Condensed",
  },
  tableCol: {
    width: "33.3%",
    height: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: { margin: "auto", marginTop: 5, fontSize: 12 },
  itemRow: {
    padding: "4px",
    fontSize: 11,
    borderRadius: 3,
    backgroundColor: "#87afd4",
    color: "white",
  },
  rowSign: {
    margin: 0,
    padding: "0px",
    fontSize: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#99abbd",
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    paddingLeft: 5,
  },
  tableSignsContent: {
    width: "48%",
    backgroundColor: "#dbe5ec",
    border: "1px solid #99abbd",
    margin: "5px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
});
