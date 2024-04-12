"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DefaultValue, FatigueSleepReport } from "@prisma/client";
import axios from "axios";
import { Info, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
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
import { ListSymptoms } from "./list-symptoms";
import { formatDate } from "@/lib/utils";
import { TooltipInfo } from "@/components/tooltip-info";
import AutocompleteInput from "@/components/autocomplete-input";

interface FatigueReportFormProps {
  fatigueSleepReport: FatigueSleepReport & {
    logisticsCenter: {
      company: { logoImgUrl: string | null } | null;
    } | null;
    driver: { fullname: string | null } | null;
  };
  defaultsSymptoms: DefaultValue[];
  isAdmin: boolean;
}

const formSchema = z.object({
  symptoms: z.string(),
  medicine: z.string(),
  sleepingHours: z.coerce.number({
    invalid_type_error: "Por favor ingrese un número de horas válido",
  }),
});

export const FatigueReportForm = ({
  fatigueSleepReport,
  defaultsSymptoms,
  isAdmin,
}: FatigueReportFormProps) => {
  const router = useRouter();
  const [currentsSymptoms, setCurrentsSymptoms] = useState<string[]>(
    fatigueSleepReport?.symptoms ? fatigueSleepReport?.symptoms.split(",") : []
  );
  const [currentsMedicineItems, setCurrentsMedicineItems] = useState<string[]>(
    fatigueSleepReport?.medicine ? fatigueSleepReport?.medicine.split("|") : []
  );
  const [inputMedicineValue, setInputMedicineValue] = useState("");

  const logo = useMemo(
    () =>
      fatigueSleepReport.logisticsCenter?.company?.logoImgUrl ||
      "/tisog-logo.png",
    [fatigueSleepReport]
  );

  const isEdit = useMemo(
    () => fatigueSleepReport.state === "PENDING",
    [fatigueSleepReport]
  );

  const disabled = useMemo(
    () => fatigueSleepReport.state !== "PENDING" && !isAdmin,
    [isEdit, isAdmin]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: fatigueSleepReport?.symptoms || "",
      sleepingHours: fatigueSleepReport?.sleepingHours || 0,
      medicine: fatigueSleepReport?.medicine || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const { setValue, watch } = form;

  useEffect(() => {
    setValue("symptoms", currentsSymptoms.join(","), { shouldValidate: true });
  }, [currentsSymptoms]);

  useEffect(() => {
    setValue("medicine", currentsMedicineItems.join("|"), {
      shouldValidate: true,
    });
  }, [currentsMedicineItems]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/reports/${fatigueSleepReport?.id}`, {
        state: "SEND",
        ...values,
      });
      toast.success("Reporte enviado correctamente");

      router.push(`/dashboard/reportes`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado");
    }
  };

  const handleAddMedicineItem = (item: string) => {
    if (item !== "") {
      setCurrentsMedicineItems([...currentsMedicineItems, item]);
      setInputMedicineValue("");
    }
  };

  const handleDeleteMedicineItem = (del: string) => {
    setCurrentsMedicineItems((prev) => prev.filter((item) => item !== del));
  };

  return (
    <div className="max-w-[1500px] w-full h-full mx-auto bg-slate-50 rounded-md shadow-sm overflow-y-hidden p-0 border ">
      <div className="grid grid-cols-3 bg-slate-200 border-b-4 border-slate-500 p-2 place-items-center">
        <div>
          <Image
            src={logo}
            alt="logo de la empresa"
            width={200}
            height={200}
            style={{
              width: 200,
              height: "auto",
            }}
            priority
          />
        </div>
        <span className="flex flex-col">
          <span className="font-bold text-lg">Conductor:</span>
          {fatigueSleepReport.driver?.fullname}
        </span>
        <div className="flex flex-col">
          <span className="font-bold text-lg">Creado el:</span>
          {fatigueSleepReport.createdAt
            ? formatDate(fatigueSleepReport.createdAt)
            : "No registra"}
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center mt-2 p-2"
        >
          <div className="grid grid-cols-1 gap-6 mt-1 mb-7 w-full max-w-[100%] border-4 border-primary">
            <SubtitleSeparator
              text="AUTOEVALUACIÓN DEL TRABAJADOR"
              sub={`Siente un cambio significativo en su comportamiento habitual `}
            />
            <div className="space-y-4 p-2">
              <div className="border border-slate-400 rounded-md p-2">
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex justify-between">
                        <div className="flex flex-col gap-2">
                          <FormLabel>SINTOMAS</FormLabel>
                        </div>
                        <TooltipInfo text="Seleccione todos los síntomas que presenta el colaborador">
                          <Info className="text-blue-600" />
                        </TooltipInfo>
                      </div>
                      <ListSymptoms
                        currentsSymptoms={currentsSymptoms}
                        setCurrentsSymptoms={setCurrentsSymptoms}
                        defaultsSymptoms={defaultsSymptoms}
                        disabled={disabled}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <div className="border border-slate-400 rounded-md p-2">
                  <FormField
                    control={form.control}
                    name="medicine"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>
                          En caso de tomar medicamentos, mencione el nombre del
                          medicamento:
                        </FormLabel>
                        <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
                          <div className="w-1/2 h-fit p-4 flex flex-col gap-4 bg-slate-200 border border-slate-400">
                            <AutocompleteInput
                              inputValue={inputMedicineValue}
                              setInputValue={setInputMedicineValue}
                              placeholder="Nombre del medicamento"
                            />
                            <Button
                              type="button"
                              onClick={() =>
                                handleAddMedicineItem(inputMedicineValue)
                              }
                            >
                              Agregar
                            </Button>
                          </div>
                          <div className="flex flex-col  w-1/2  bg-slate-300 self-start">
                            <span className="w-full h-fit p-1 bg-slate-400 text-white">
                              Medicamentos:{" "}
                            </span>
                            <div className="max-h-[200px] flex flex-col flex-wrap gap-1  p-3  ">
                              {currentsMedicineItems.map((item, index) => (
                                <div
                                  className="w-fit h-fit bg-blue-500 text-white p-1 rounded-sm flex gap-3 items-center"
                                  key={index}
                                >
                                  {item}
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteMedicineItem(item)
                                    }
                                    className="p-1 rounded-sm bg-red-500 hover:bg-red-700 w-5 h-5 flex items-center justify-center"
                                  >
                                    <X className="w-6 h-6 text-white" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="¿Cuantas horas ha dormido?"
                  name="sleepingHours"
                  type="number"
                  className="w-[100px] text-lg"
                  // disabled={disabled}
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
