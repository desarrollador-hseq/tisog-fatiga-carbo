"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { City, Company, Driver, LogisticsCenter } from "@prisma/client";
import axios from "axios";
import { CommandList } from "cmdk";
import { Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface AdminCreateTrainingFormProps {
  drivers: Driver[];
  logisticsCenters: LogisticsCenter[];
  cities: City[];
}

const formSchema = z.object({
  driverId: z.string().min(1, {
    message: "Conductor es requerido",
  }),
  // logisticsCenterId: z.string().min(1, {
  //   message: "Curso es requerido",
  // }),
  cityId: z.string().min(1, {
    message: "Curso es requerido",
  }),
});

export const CreateReportForm = ({
  drivers,
  logisticsCenters,
  cities,
}: AdminCreateTrainingFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      driverId: "",
      // logisticsCenterId: "",
      cityId: "",
      // todo
      // supervisorId in api
    },
  });

  const { isSubmitting, isValid } = form.formState;

  useEffect(() => {
    if (!drivers || drivers.length === 0) {
      toast.error("Error al obtener los cursos, por favor recargue la página");
    }
  }, [drivers]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log({ values });
    try {
      const { data } = await axios.post("/api/reports", values);
      router.push(`/admin/reportes/editar/${data.id}`);

      toast.success("Reporte creado, listo para ser diligenciado");
    } catch {
      console.log(
        "Ocurrió un error inesperado, por favor intentelo nuevamente"
      );
      toast.error(
        "Ocurrió un error inesperado, por favor intentelo nuevamente"
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-start h-full p-6">
      <div className="w-full">
        {/* <p className="text-sm text-slate-600">
          El primer paso es elegir el tipo de entrenamiento, posteriormente
          deberá seleccionar los colaboradores y adjuntar sus documentos
        </p> */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8 max-w-[600px] w-full mx-auto"
          >
            <div>
              <FormField
                control={form.control}
                name="driverId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Conductor</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? drivers?.find(
                                  (driver) => driver.id === field.value
                                )?.fullname
                              : "Selecciona "}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command className="w-full">
                          <CommandInput placeholder="Buscar conductor" />
                          <CommandEmpty>Conductor no encontrado</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {drivers?.map((driver) => (
                                <CommandItem
                                  value={`${driver.fullname}`}
                                  key={driver.id}
                                  onSelect={() => {
                                    form.setValue("driverId", driver.id, {
                                      shouldValidate: true,
                                    });
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      driver.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {driver.fullname}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cityId"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Ciudad:</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? cities?.find((city) => city.id === field.value)
                                ?.realName
                            : "Selecciona una ciudad"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command className="w-full">
                        <CommandInput placeholder="Buscar ciudad" />
                        <CommandEmpty>Ciudad no encontrada</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {cities?.map((city) => (
                              <CommandItem
                                value={`${city.realName}`}
                                key={city.id}
                                onSelect={() => {
                                  form.setValue("cityId", city.id, {
                                    shouldValidate: true,
                                  });
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    city.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {city.realName}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <div>
              <FormField
                control={form.control}
                name="logisticsCenterId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Centro logístico</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-100 border-slate-300">
                          <SelectValue
                            className="text-red-500"
                            placeholder="Selecciona el centro logístico"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {logisticsCenters?.map((center) => (
                          <SelectItem key={center.id} value={center.id}>
                            {center.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="ml-6 text-[0.8rem] text-red-500 font-medium" />
                  </FormItem>
                )}
              />
            </div> */}

            <div className="flex items-center gap-x-2 w-full">
              <Link href="/admin/">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continuar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
