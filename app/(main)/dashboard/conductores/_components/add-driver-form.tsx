"use client"

import { InputForm } from "@/components/input-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Driver } from "@prisma/client";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface AddDriverFormProps {
  driver?: Driver | null;
}

const formSchema = z.object({
  fullname: z.string().min(1, {
    message: "Nombre requerido",
  }),
  numDoc: z.string().min(1, {
    message: "Número de documento requerido",
  }),
});

export const AddDriverForm = ({ driver }: AddDriverFormProps) => {
  const router = useRouter();
  const isEdit = useMemo(() => !!driver, [driver]);

  if (isEdit && !driver) {
    router.replace("/dashboard/conductores/");
    toast.error("Colaborador no encontrado, redirigiendo...");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: driver?.fullname || "",
      numDoc: driver?.numDoc || "",

    },
  });
  const { isSubmitting, isValid } = form.formState;
  const { setValue, setError } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEdit) {
        await axios.patch(`/api/drivers/${driver?.id}`, values);
        toast.success("Conductor actualizado");
      } else {
        const { data } = await axios.post(`/api/drivers/`, values);
        router.push(`/dashboard/conductores/`);
        toast.success("Conductor creado");
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
      <Form {...form} >
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center mt-8 p-2 w-full gap-4"
        >
          <InputForm
            control={form.control}
            label="Nombre completo"
            name="fullname"
            className="w-full"
          />
          <InputForm
            control={form.control}
            label="Número de documento"
            name="numDoc"
            className="w-full"

          />

          <Button
            disabled={isSubmitting || !isValid}
            className="w-full max-w-[500px] gap-3"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Actualizar" :"Agregar"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
