"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { InputForm } from "@/components/input-form";
import { useLoading } from "@/components/providers/loading-provider";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface FieldUpdateFormProps {
  value?: string | null;
  label: string;
  id?: string;
  disabled?: boolean;
}

export const AddDefaultValueForm = ({
  value,
  id,
  label,
  disabled,
}: FieldUpdateFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { setLoadingApp } = useLoading();

  const toggleEdit = () => setIsEditing((current) => !current);

  const formSchema = z.object({
    name: z.string().min(1, {
      message: `${label} es requerido`,
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log({ values });
    if (!id || disabled) return;
    setLoadingApp(true);
    try {
      await axios.post(`/api/parameters/default-value/${id}`, values);
      toast.success(`${label} creado correctamente`);

      toggleEdit();
      router.refresh();
      //   router.push(pathname);
    } catch {
      toast.error(
        "Ocurrió un error inesperado, por favor intentelo nuevamente"
      );
    } finally {
      setLoadingApp(false);
      form.reset()
    }
  };

  return (
    <Card
      className={`mt-1 border ${
        disabled ? "bg-slate-50" : "bg-blue-50"
      } p-1  relative`}
    >
      <CardHeader className="p-1">
    
      </CardHeader>
      <CardContent className="p-1">
        {!isEditing && <p className="text-sm mt-2 text-center">{value}</p>}
        { !disabled && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <InputForm control={form.control} label="" name={"name"} />

              <div className="flex items-center justify-end gap-x-2 w-full">
                <Button disabled={!isValid || isSubmitting} type="submit">
                  Agregar
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};
