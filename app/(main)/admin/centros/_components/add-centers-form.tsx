"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company, LogisticsCenter } from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { Check, ChevronsUpDown, Cloud, Loader2 } from "lucide-react";
import { InputForm } from "@/components/input-form";
import { Button } from "@/components/ui/button";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useLoading } from "@/components/providers/loading-provider";


interface AddCompanyFormProps {
  center?: LogisticsCenter | null;
  companies: Company[] | null;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nombre es requerido",
  }),
  companyId: z.string().min(1, {
    message: "Empresa es requerida",
  }),
});

export const AddCentersForm = ({ center, companies }: AddCompanyFormProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();

  const isEdit = useMemo(() => !!center, [center]);

  if (isEdit && !center) {
    toast.error("centro no encontrada, redirigiendo...");
    router.replace("/admin/centros/");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: center?.name || "",
      companyId: center?.companyId || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const { setValue, setError, getValues } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEdit) {
        await axios.patch(`/api/centers/${center?.id}`, values);
        toast.success("Centro logístico actualizado");
      } else {
        const { data } = await axios.post(`/api/centers/`, values);
        router.push(`/admin/centros/`);
        toast.success("Centro logístico agregado correctamente");
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
            errorMessage.includes("Nombre de centro logístico ya registrado")
          ) {
            setError("name", {
              type: "manual",
              message: "Nombre de centro logístico ya registrado",
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
            label="Nombre"
            name="name"
            className="w-full"
          />

          <FormField
            control={form.control}
            name="companyId"
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
                          ? companies?.find(
                              (company) => company.id === field.value
                            )?.name
                          : "Selecciona una ciudad"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command className="w-full">
                      <CommandInput placeholder="Buscar Ciudad" />
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
