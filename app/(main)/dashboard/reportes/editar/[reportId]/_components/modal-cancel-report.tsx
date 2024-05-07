"use client"

import {  buttonVariants } from "@/components/ui/button";
import { FatigueSleepReport } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export const ModalCancelReport = ({
  report,
}: {
  report: FatigueSleepReport;
}) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);

  const onConfirm = async () => {
    setisLoading(true);
    try {
      await axios.delete(`/api/reports/${report.id}`);
      toast.success("Reporte cancelado");
      router.push("/dashboard/reportes/");
      router.refresh();
    } catch (error) {
      toast.error(
        "Ocurrió un error al momento de cancelar el reporte"
      );
    } finally {
      router.refresh();
      setisLoading(false);
    }
  };
  const title = (
    <p className="font-normal inline">
      el presente reporte
    </p>
  );
  return (
    <AlertDialog>
    <AlertDialogTrigger >
      <div className={cn(buttonVariants({className: "bg-red-500 hover:bg-red-600"}))}>
      Cancelar reporte
      </div>
    </AlertDialogTrigger>
    <AlertDialogContent className="max-w-[600px] w-full">
      <AlertDialogHeader>
        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
        <AlertDialogDescription asChild  className="inline flex-col">
         <span className="inline">Esta seguro que desea cancelar el presente reporte</span>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cerrar</AlertDialogCancel>
        <AlertDialogAction className={cn(buttonVariants({className: "bg-red-500 hover:bg-red-600"}))} onClick={onConfirm}>Sí</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  );
};
