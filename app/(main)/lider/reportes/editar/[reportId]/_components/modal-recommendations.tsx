"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { Info, Loader2 } from "lucide-react";
import { DefaultValue } from "@prisma/client";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TooltipInfo } from "@/components/tooltip-info";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListToggleItems } from "@/components/list-toggle-items";

interface ModalRecommendationsProps {
  open: boolean;
  fatigueLevel: "HIGH" | "MEDIUM" | "LOW" | "";
  strategy: string;
  fatigueSleepReportId: string;
  defaultsStrategies: DefaultValue[];
}

const formSchema = z.object({
  strategy: z.string(),
});

export const ModalRecommendations = ({
  open,
  fatigueLevel,
  strategy,
  fatigueSleepReportId,
  defaultsStrategies,
}: ModalRecommendationsProps) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const openModal = useMemo(() => open, [open]);

  const [currentStrategy, setCurrentStrategy] = useState<string[]>(
    strategy ? strategy.split(",") : []
  );

  useEffect(() => {
    setIsClient(true);
  }, []);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      strategy: strategy || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const { setValue, watch } = form;

  useEffect(() => {
    setValue("strategy", currentStrategy.join(","), {
      shouldValidate: true,
    });
  }, [currentStrategy]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/reports/${fatigueSleepReportId}`, {
        state: "SEND",
        ...values,
      });
      toast.success("Reporte enviado correctamente");

      // router.push(`/dashboard/reportes`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado");
    }
  };

  return (
    <div>
      {isClient && (
        <AlertDialog open={openModal}>
          <AlertDialogContent className="w-full max-w-[700px]">
            <AlertDialogHeader>
              <AlertDialogTitle>
                <h2 className="text-2xl text-bold">Nivel Riesgo de Fatiga</h2>
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-5 text-slate-700 text-lg flex flex-col gap-2 ">
                <div className="flex flex-col p-4">
                  <span></span>
                  <div className="grid grid-cols-3">
                    <div
                      className={cn(
                        "w-full h-11 flex justify-center items-center  border-2 border-slate-600 rounded-l-lg",
                        fatigueLevel !== "" &&
                          "bg-gray-400 text-white font-semibold"
                      )}
                    >
                      {fatigueLevel === "LOW" && "Bajo"}
                    </div>
                    <div
                      className={cn(
                        "w-full h-11 flex justify-center items-center border-2 border-slate-600",
                        (fatigueLevel === "MEDIUM" ||
                          fatigueLevel === "HIGH") &&
                          "bg-yellow-500 text-white font-semibold"
                      )}
                    >
                      {fatigueLevel === "MEDIUM" && "MEDIO"}
                    </div>
                    <div
                      className={cn(
                        "w-full h-11 flex justify-center items-center border-2 border-slate-600 rounded-r-lg",
                        fatigueLevel === "HIGH" &&
                          "bg-red-600 text-white font-semibold"
                      )}
                    >
                      {fatigueLevel === "HIGH" && "ALTO"}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-secondary my-2">
                  
                </span>
             
              </AlertDialogDescription>
              <div className="flex items-center justify-center mt-5 bg-accent text-white gap-4 p-2 rounded-md border ">
              <div>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col items-center mt-2 p-2 justify-center"
                    >
                      <FormField
                        control={form.control}
                        name="strategy"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <div className="flex justify-between">
                              <div className="flex flex-col gap-2">
                                <FormLabel className="text-slate-700">Estrategias a tomar:</FormLabel>
                              </div>
                              <TooltipInfo text="Seleccione todos los síntomas que presenta el colaborador">
                                <Info className="text-blue-600" />
                              </TooltipInfo>
                            </div>
                            <ListToggleItems
                              currents={currentStrategy}
                              setCurrents={setCurrentStrategy}
                              defaults={defaultsStrategies}
                              //   disabled={disabled}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        disabled={isSubmitting || !isValid}
                        className="w-full max-w-[500px] gap-3"
                      >
                        {isSubmitting && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        { "Enviar"}
                      </Button>
                    </form>
                  </Form>
                </div>
               
              </div>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
