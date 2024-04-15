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
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatDate } from "@/lib/utils";
import { TooltipInfo } from "@/components/tooltip-info";
import AutocompleteInput from "@/components/autocomplete-input";
import { ListToggleItems } from "@/components/list-toggle-items";
import { ModalRecommendations } from "./modal-recommendations";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface FatigueReportFormProps {
  fatigueSleepReport: FatigueSleepReport & {
    logisticsCenter: {
      company: { logoImgUrl: string | null } | null;
    } | null;
    driver: { fullname: string | null } | null;
  };
  defaultsSymptoms: DefaultValue[];
  defaultsSigns: DefaultValue[];
  defaultsAppearances: DefaultValue[];
  defaultsMoods: DefaultValue[];
  defaultsPerformances: DefaultValue[];
  defaultsDrivingModes: DefaultValue[];
  defaultsStrategies: DefaultValue[];
  isAdmin: boolean;
}

const formSchema = z.object({
  symptoms: z.string(),
  medicine: z.string(),
  sleepingHours: z.coerce.number({
    invalid_type_error: "Por favor ingrese un número de horas válido",
  }),
  sleepingHours48: z.coerce.number({
    invalid_type_error: "Por favor ingrese un número de horas válido",
  }),
  signs: z.string(),
  appearances: z.string(),
  moods: z.string(),
  performances: z.string(),
  drivingModes: z.string(),
  fatigueCauseDescription: z.string().optional(),
});

export const FatigueReportForm = ({
  fatigueSleepReport,
  defaultsSymptoms,
  defaultsSigns,
  defaultsAppearances,
  defaultsMoods,
  defaultsPerformances,
  defaultsDrivingModes,
  defaultsStrategies,
  isAdmin,
}: FatigueReportFormProps) => {
  const router = useRouter();
  const [currentsSymptoms, setCurrentsSymptoms] = useState<string[]>(
    fatigueSleepReport?.symptoms ? fatigueSleepReport?.symptoms.split(",") : []
  );
  const [currentsSigns, setCurrentsSigns] = useState<string[]>(
    fatigueSleepReport?.signs ? fatigueSleepReport?.signs.split(",") : []
  );

  const [currentsAppearances, setCurrentsAppearances] = useState<string[]>(
    fatigueSleepReport?.appearances
      ? fatigueSleepReport?.appearances.split(",")
      : []
  );
  const [currentsMoods, setCurrentsMoods] = useState<string[]>(
    fatigueSleepReport?.moods ? fatigueSleepReport?.moods.split(",") : []
  );
  const [currentsPerformances, setCurrentsPerformances] = useState<string[]>(
    fatigueSleepReport?.performances
      ? fatigueSleepReport?.performances.split(",")
      : []
  );
  const [currentsDrivingModes, setCurrentsDrivingModes] = useState<string[]>(
    fatigueSleepReport?.drivingModes
      ? fatigueSleepReport?.drivingModes.split(",")
      : []
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

  const [openRecommendations, setOpenRecommendations] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: fatigueSleepReport?.symptoms || "",
      signs: fatigueSleepReport?.signs || "",
      appearances: fatigueSleepReport?.appearances || "",
      moods: fatigueSleepReport?.moods || "",
      drivingModes: fatigueSleepReport?.drivingModes || "",
      sleepingHours: fatigueSleepReport?.sleepingHours || 0,
      sleepingHours48: fatigueSleepReport?.sleepingHours48 || 0,
      medicine: fatigueSleepReport?.medicine || "",
      fatigueCauseDescription:
        fatigueSleepReport?.fatigueCauseDescription || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const { setValue, watch } = form;

  useEffect(() => {
    setValue("symptoms", currentsSymptoms.join(","), { shouldValidate: true });
  }, [currentsSymptoms]);

  useEffect(() => {
    setValue("signs", currentsSigns.join(","), { shouldValidate: true });
  }, [currentsSigns]);

  useEffect(() => {
    setValue("appearances", currentsAppearances.join(","), {
      shouldValidate: true,
    });
  }, [currentsAppearances]);

  useEffect(() => {
    setValue("moods", currentsMoods.join(","), {
      shouldValidate: true,
    });
  }, [currentsMoods]);

  useEffect(() => {
    setValue("performances", currentsPerformances.join(","), {
      shouldValidate: true,
    });
  }, [currentsPerformances]);

  useEffect(() => {
    setValue("drivingModes", currentsDrivingModes.join(","), {
      shouldValidate: true,
    });
  }, [currentsDrivingModes]);

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

      // router.push(`/dashboard/reportes`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado");
    } finally {
      setOpenRecommendations(true);
    }
  };

  const handleAddMedicineItem = (item: string) => {
    const exist = currentsMedicineItems.some(
      (current) => current.toLowerCase() == item.toLowerCase()
    );

    if (exist) return toast.error("Ya existe ese medicamento");
    if (item !== "") {
      setCurrentsMedicineItems([...currentsMedicineItems, item]);
      setInputMedicineValue("");
    }
  };

  const handleDeleteMedicineItem = (del: string) => {
    setCurrentsMedicineItems((prev) => prev.filter((item) => item !== del));
  };

  return (
    <div className="max-w-[1500px] w-full h-full mx-auto bg-slate-100 rounded-none overflow-y-hidden p-0  ">
      <div className="grid grid-cols-3 bg-slate-200 border-b-4 border-slate-500 p-2 place-items-center">
        <div className="max-h-[150px] overflow-hidden">
          <Image
            src={logo}
            alt="logo de la empresa"
            width={200}
            height={200}
            style={{
              width: 200,
              height: "auto",
            }}
       
            object-fit="cover"
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
          className="flex flex-col items-center mt-2 p-2 "
        >
          <div className="grid grid-cols-1 gap-6 mt-1 mb-7 w-full max-w-[100%]">
            {/* <SubtitleSeparator
              text="AUTOEVALUACIÓN DEL TRABAJADOR"
              sub={`Siente un cambio significativo en el comportamiento habitual del colaborador `}
            /> */}
            <div className="space-y-4 p-2">
              <div className="">
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <div className="flex justify-between w-full">
                        <div className="flex flex-col gap-0">
                          <FormLabel className="font-semibold text-lg">
                            1. SINTOMAS:
                            <p className="font-normal text-slate-500 text-sm">
                              Siente un cambio significativo en su
                              comportamiento habitual{" "}
                            </p>
                          </FormLabel>
                        </div>
                        <TooltipInfo text="Seleccione todos los síntomas que presenta el colaborador">
                          <Info className="text-blue-600" />
                        </TooltipInfo>
                      </div>
                      <div className="border bg-slate-200 border-slate-400 w-full">
                        <ListToggleItems
                          currents={currentsSymptoms}
                          setCurrents={setCurrentsSymptoms}
                          defaults={defaultsSymptoms}
                          disabled={disabled}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <div className="">
                  <FormField
                    control={form.control}
                    name="medicine"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-semibold text-lg">
                          2. MEDICAMENTOS:
                          <p className="font-normal text-slate-500 text-sm p-0 m-0">
                            En caso de tomar medicamentos, mencione el nombre de
                            los medicamentos
                          </p>
                        </FormLabel>
                        <div className="flex flex-col md:flex-row gap-2 justify-center border bg-slate-200 border-slate-400">
                          <div className="w-1/2 h-fit p-4 flex flex-col gap-4 bg-slate-200 border ">
                            <AutocompleteInput
                              inputValue={inputMedicineValue}
                              setInputValue={setInputMedicineValue}
                              placeholder="Nombre del medicamento"
                              className="bg-slate-100 border border-primary"
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
                            <div className="max-h-[200px] min-h-max flex flex-col flex-wrap gap-1  p-3  ">
                              {currentsMedicineItems.length > 0 ? (
                                currentsMedicineItems.map((item, index) => (
                                  <div
                                    className="w-fit h-fit bg-slate-500 text-white p-1 rounded-sm flex gap-3 items-center"
                                    key={index}
                                  >
                                    {item}
                                    <Button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteMedicineItem(item)
                                      }
                                      className="p-0.5 rounded-sm bg-red-500 hover:bg-red-700 w-5 h-5 flex items-center justify-center"
                                    >
                                      <X className="w-4 h-4 text-white" />
                                    </Button>
                                  </div>
                                ))
                              ) : (
                                <span className="text-sm text-slate-500">
                                  Sin medicamentos
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <h4 className="font-semibold text-lg uppercase">
                  3. Horas de sueño
                </h4>
                <div className="flex border bg-slate-200 border-slate-400  p-2">
                  <InputForm
                    control={form.control}
                    label="¿Cuántas horas ha dormido en las últimas 24 horas?"
                    name="sleepingHours"
                    type="number"
                    className="w-[100px] text-lg bg-slate-100 border border-primary"
                    // disabled={disabled}
                  />
                  <InputForm
                    control={form.control}
                    label="¿Cuántas Horas ha dormido en las últimas 48 horas?"
                    name="sleepingHours48"
                    type="number"
                    className="w-[100px] text-lg bg-slate-100 border border-primary"
                    // disabled={disabled}
                  />
                </div>
              </div>

              <div className="space-y-4 ">
                <div className="">
                  <FormField
                    control={form.control}
                    name="signs"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-2">
                            <FormLabel className="font-semibold text-lg">
                              4. SIGNOS:
                              <p className="font-normal text-slate-500 text-sm p-0 m-0">
                                Selecciona los signos que observa en el
                                comportamiento del colaborador
                              </p>
                            </FormLabel>
                          </div>
                          <TooltipInfo text="Seleccione signos de comportamiento que observa en el colaborador">
                            <Info className="text-blue-600" />
                          </TooltipInfo>
                        </div>
                        <div className="border bg-slate-200 border-slate-400">
                          <ListToggleItems
                            currents={currentsSigns}
                            setCurrents={setCurrentsSigns}
                            defaults={defaultsSigns}
                            // disabled={disabled}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <h4 className="font-semibold text-lg uppercase">
                  5. Comportamiento
                </h4>

                <div className="border-4 border-slate-400">
                  <SubtitleSeparator
                    className="bg-slate-400"
                    text="¿Muestra la persona algunos de los siguientes signos de fatiga?"
                  />
                  <div className="flex flex-col md:flex-row ">
                    <div className="space-y-4 p-2 md:w-1/2">
                      <div className="border border-slate-400 overflow-hidden p-0 bg-slate-200">
                        <FormField
                          control={form.control}
                          name="appearances"
                          render={({ field }) => (
                            <FormItem className="flex flex-col ">
                              <div className="flex justify-between bg-slate-300 p-2">
                                <div className="flex flex-col gap-2">
                                  <FormLabel className="text-lg">
                                    Apariencia:
                                  </FormLabel>
                                </div>
                                <TooltipInfo text="Seleccione signos de comportamiento que observa en el colaborador">
                                  <Info className="text-blue-600" />
                                </TooltipInfo>
                              </div>
                              <ListToggleItems
                                currents={currentsAppearances}
                                setCurrents={setCurrentsAppearances}
                                defaults={defaultsAppearances}
                                // disabled={disabled}
                                isCheck={true}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="space-y-4 p-2 md:w-1/2">
                      <div className="border bg-slate-200 border-slate-400 overflow-hidden  p-0">
                        <FormField
                          control={form.control}
                          name="moods"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <div className="flex justify-between bg-slate-300 p-2">
                                <div className="flex flex-col gap-2">
                                  <FormLabel className="text-lg">
                                    Ánimo:
                                  </FormLabel>
                                </div>
                                <TooltipInfo text="Seleccione signos de comportamiento que observa en el colaborador">
                                  <Info className="text-blue-600" />
                                </TooltipInfo>
                              </div>
                              <ListToggleItems
                                currents={currentsMoods}
                                setCurrents={setCurrentsMoods}
                                defaults={defaultsMoods}
                                // disabled={disabled}
                                isCheck={true}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row">
                    <div className="space-y-4 p-2 md:w-1/2">
                      <div className="border bg-slate-200 border-slate-400 overflow-hidden p-0">
                        <FormField
                          control={form.control}
                          name="performances"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <div className="flex justify-between bg-slate-300 p-2">
                                <div className="flex flex-col gap-2 self-center">
                                  <FormLabel className="text-lg">
                                    Desempeño:
                                  </FormLabel>
                                </div>
                                <TooltipInfo text="Seleccione signos de comportamiento que observa en el colaborador">
                                  <Info className="text-blue-600" />
                                </TooltipInfo>
                              </div>
                              <ListToggleItems
                                currents={currentsPerformances}
                                setCurrents={setCurrentsPerformances}
                                defaults={defaultsPerformances}
                                // disabled={disabled}
                                isCheck={true}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="space-y-4 p-2 md:w-1/2">
                      <div className="border bg-slate-200 overflow-hidden  border-slate-400  p-0">
                        <FormField
                          control={form.control}
                          name="drivingModes"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <div className="flex justify-between bg-slate-300 p-2">
                                <div className="flex flex-col gap-2">
                                  <FormLabel className="text-lg">
                                    Conducción:
                                  </FormLabel>
                                </div>
                                <TooltipInfo text="Seleccione signos de comportamiento que observa en el colaborador">
                                  <Info className="text-blue-600" />
                                </TooltipInfo>
                              </div>
                              <ListToggleItems
                                currents={currentsDrivingModes}
                                setCurrents={setCurrentsDrivingModes}
                                defaults={defaultsDrivingModes}
                                // disabled={disabled}
                                isCheck={true}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="">
                <FormField
                  control={form.control}
                  name="fatigueCauseDescription"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col">
                        <FormLabel className="font-semibold text-lg">
                          6. Descripción
                          <p className="font-normal text-slate-500 text-sm p-0 m-0">
                            {" "}
                            Describa la posible causa del reporte de fatiga
                            mencionada por el Colaborador
                          </p>
                        </FormLabel>
                      </div>

                      <FormControl className="border bg-slate-200 border-slate-400 p-2">
                        <Textarea
                          placeholder="Escriba aquí"
                          className="bg-slate-50 border border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        (Mencione también si existe alguna otra situación que
                        pueda hacer este escenario peor)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <ModalRecommendations
            open={openRecommendations}
            defaultsStrategies={defaultsStrategies}
            fatigueLevel={"HIGH"}
            fatigueSleepReportId={fatigueSleepReport.id}
            strategy={fatigueSleepReport.strategy || ""}
          />

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
