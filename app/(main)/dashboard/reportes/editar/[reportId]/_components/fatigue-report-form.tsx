"use client";


import { InputForm } from "@/components/input-form";
import { SubtitleSeparator } from "@/components/subtitle-separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValue, FatigueSleepReport } from "@prisma/client";
import axios from "axios";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ListSymptoms } from "./list-symptoms";

interface FatigueReportFormProps {
  fatigueSleepReport: FatigueSleepReport;
  defaultsSymptoms: DefaultValue[];
}

const formSchema = z.object({
  driverId: z.string().min(1, {
    message: "Nombre del curso es requerido",
  }),
  symptoms: z.string(),
  sleepingHours: z.coerce.number({
    invalid_type_error: "Por favor ingrese un número de horas válido",
  }),
});

export const FatigueReportForm = ({
  fatigueSleepReport,
  defaultsSymptoms,
}: FatigueReportFormProps) => {
  const router = useRouter();
  const [currentsSymptoms, setCurrentsSymptoms] = useState<string[]>(
    fatigueSleepReport?.symptoms ? fatigueSleepReport?.symptoms.split(",") : []
  );

  const isEdit = useMemo(
    () => !!fatigueSleepReport.sleepingHours || !!fatigueSleepReport.symptoms,
    [fatigueSleepReport]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      driverId: fatigueSleepReport?.driverId || "",
      symptoms: fatigueSleepReport?.symptoms || "",
      sleepingHours: fatigueSleepReport?.sleepingHours || 0,
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const { setValue } = form;

  useEffect(() => {
    setValue("symptoms", currentsSymptoms.join(","), { shouldValidate: true });
  }, [currentsSymptoms]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/reports/${fatigueSleepReport?.id}`, values);
      toast.success("Reporte enviado correctamente");

      router.push(`/dashboard/reportes`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado");
    }
  };

  return (
    <div className="max-w-[1500px] w-full h-full mx-auto bg-white rounded-md shadow-sm overflow-y-hidden p-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center mt-8 p-2"
        >
          <InputForm
            control={form.control}
            label=""
            name="driverId"
            className="hidden"
          />
          <InputForm
            control={form.control}
            label=""
            name="supervisorId"
            className="hidden"
          />

          <div className="grid grid-cols-1 gap-6 mt-1 mb-7 w-full max-w-[80%]">
            <SubtitleSeparator text="AUTOEVALUACIÓN DEL TRABAJADOR" />
            <div className="space-y-4">
              <div className="border border-slate-400 rounded-md p-2">
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Siente un cambio significativo en su comportamiento
                        habitual{" "}
                      </FormLabel>
                      <FormLabel>SINTOMAS</FormLabel>

                      <ListSymptoms
                        currentsSymptoms={currentsSymptoms}
                        setCurrentsSymptoms={setCurrentsSymptoms}
                        defaultsSymptoms={defaultsSymptoms}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="¿Cuantas horas ha dormido?"
                  name="sleepingHours"
                  type="number"
                  className="w-[100px] text-lg"
                />
              </div>
            </div>
          </div>

          <Button
            disabled={isSubmitting || !isValid}
            className="w-full max-w-[500px] gap-3"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Actualizar reporte" : "Enviar reporte"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
