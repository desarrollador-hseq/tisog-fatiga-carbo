import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatDate } from "@/lib/utils";
import { FatigueSleepReport } from "@prisma/client";

interface ListCollaboratorsRequestProps {
  reports: FatigueSleepReport[];
}

export const ListCriticalReports = ({
  reports,
}: ListCollaboratorsRequestProps) => {
  const reportsCriticals = reports.filter(
    (report) => report.riskLevel === "HIGH"
  );
  return (
    <div className="bg-orange-600 p-3 mt-2 rounded-md">
      <h4 className="text-2xl font-bold text-center my-2 text-white">Alertas de reportes criticos</h4>
      <Table className="text-white border">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader className="text-white">
          <TableRow className="text-white bg-orange-700">
            <TableHead className="text-white ">Conductor</TableHead>
            <TableHead className="text-white">Supervisor</TableHead>
            <TableHead className="text-white">Ciudad</TableHead>
            <TableHead className="text-white">Empresa</TableHead>
            <TableHead className="text-white">Fecha</TableHead>
            <TableHead className="text-white">Nivel riesgo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="space-y-3">
          {reportsCriticals.map((report) => (
            <TableRow
              key={report.id}
              className="border-none my-4 bg-orange-400"
            >
              <TableCell className="font-medium mb-2 my-3">
                {report.driver?.fullname}
              </TableCell>
              <TableCell className="font-medium mb-2 my-3">
                {report.supervisor?.name}
              </TableCell>
              <TableCell className="font-medium ">
                {report.city?.realName}
              </TableCell>
              <TableCell className="font-medium ">
                {report.logisticsCenter?.company?.name}
              </TableCell>
              <TableCell className="font-medium ">
                {report.date ? formatDate(report.date) : "No registrado"}
              </TableCell>
              <TableCell className="font-medium ">
                {report.riskLevel === "HIGH" ? "Alto" : "no"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
