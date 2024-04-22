"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { City, Company, User } from "@prisma/client";
import axios from "axios";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { InputForm } from "@/components/input-form";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
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
import { cn } from "@/lib/utils";

interface AddSupervisorFormProps {
  supervisor?: User | null;
  cities: City[] | null;
  companies: Company[] | null;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nombre requerido",
  }),
  numDoc: z.string().min(1, {
    message: "Número de documento requerido",
  }),
  email: z.string().email({
    message: "Ingrese un correo electrónico válido"
  }),
  companyId: z.string().min(1, {
    message: "Empresa es requerida",
  }),
  // cityId: z.string().min(1, {
  //   message: "Ciudad es requerida",
  // }),
});

export const AddSupervisorForm = ({
  supervisor,
  cities,
  companies,
}: AddSupervisorFormProps) => {
  const router = useRouter();
  const isEdit = useMemo(() => !!supervisor, [supervisor]);

  if (isEdit && !supervisor) {
    router.replace("/admin/supervisores/");
    toast.error("Supervisor no encontrado, redirigiendo...");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: supervisor?.name || "",
      numDoc: supervisor?.numDoc || "",
      companyId: supervisor?.companyId || "",
      email: supervisor?.email || ""
      // cityId: driver?.cityId || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const { setValue, setError } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEdit) {
        await axios.patch(`/api/user/${supervisor?.id}`, values);
        toast.success("Supervisor actualizado");
      } else {
        const { data } = await axios.post(`/api/user/`, values);
        router.push(`/admin/supervisores/`);
        toast.success("Supervisor creado correctamente");
      }
      // router.push(`/admin/colaboradores`);
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverResponse = error.response;
        if (serverResponse && serverResponse.status === 400) {
          const errorMessage = serverResponse.data;
          if (
            typeof errorMessage === "string" &&
            errorMessage.includes("Número de documento ya registrado")
          ) {
            setError("numDoc", {
              type: "manual",
              message: "Número de documento ya registrado",
            });
          } else {
            toast.error(errorMessage);
          }
        } else {
          toast.error("Ocurrió un error inesperado");
        }
      } else {
        console.error(error);
        toast.error("Ocurrió un error inesperado");
      }
    }
  };
  return (
    <div className="max-w-[1500px] w-[50%] h-full mx-auto bg-white  overflow-y-hidden p-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center mt-8 p-2 w-full gap-4"
        >
          <InputForm
            control={form.control}
            label="Nombre completo"
            name="name"
            className="w-full"
          />

          <InputForm
            control={form.control}
            label="Número de documento"
            name="numDoc"
            className="w-full"
          />
          <InputForm
            control={form.control}
            label="Correo electrónico"
            name="email"
            className="w-full"
          />
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Empresa:</FormLabel>
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
                          ? companies?.find(
                              (company) => company.id === field.value
                            )?.name
                          : "Selecciona una empresa"}
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
                          {companies?.map((company) => (
                            <CommandItem
                              value={`${company.name}`}
                              key={company.id}
                              onSelect={() => {
                                form.setValue("companyId", company.id, {
                                  shouldValidate: true,
                                });
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  company.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {company.name}
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
          {/* <FormField
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
          /> */}
          {/* <FormField
            control={form.control}
            name="positionId"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Cargo:</FormLabel>
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
                          ? positions?.find((position) => position.id === field.value)
                              ?.name
                          : "Selecciona un cargo"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command className="w-full">
                      <CommandInput placeholder="Buscar Cargo" />
                      <CommandEmpty>Cargo no encontrada</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {positions?.map((position) => (
                            <CommandItem
                              value={`${position.name}`}
                              key={position.id}
                              onSelect={() => {
                                form.setValue("positionId", position.id, {
                                  shouldValidate: true,
                                });
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  position.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {position.name}
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
          /> */}

          <Button
            disabled={isSubmitting || !isValid}
            className="w-full max-w-[500px] gap-3"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Actualizar" : "Agregar"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
