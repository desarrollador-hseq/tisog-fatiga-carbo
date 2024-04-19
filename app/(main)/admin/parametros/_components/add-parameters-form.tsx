import { InputForm } from "@/components/input-form";
import { useLoading } from "@/components/providers/loading-provider";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Parameter } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";


const formSchema = z.object({
  name: z.string().min(1, {
    message: `Nombre es requerido`,
  }),
  desc: z.string().min(1, {
    message: `Descripción es requerido`,
  }),
});

export const AddParametersForm = ({parameter}: {parameter?: Parameter}) => {
  const router = useRouter();
  const { setLoadingApp, loadingApp } = useLoading();

  const isEdit = useMemo(() => parameter, [parameter])


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: parameter?.name || "", desc: parameter?.desc || "" },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if(isEdit && !parameter?.id) return
    setLoadingApp(true);
    try {
      if(!isEdit) {
        await axios.post(`/api/parameters/`, values);
        toast.success(`Parametro creado correctamente`);
      }else {
        await axios.patch(`/api/parameters/${parameter?.id}`, values);
        toast.success(`Parametro actualizado correctamente`)
      }
 
      router.refresh();
    } catch {
      toast.error(
        "Ocurrió un error inesperado, por favor intentelo nuevamente"
      );
    } finally {
      setLoadingApp(false);
      form.reset();
    }
  };

  return (
    <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 mt-4"
    >
      <InputForm control={form.control} label="Campo bd" name={"name"} />
      <InputForm control={form.control} label="Nombre" name={"desc"} />

      <div className="flex items-center justify-end gap-x-2 w-full">
        <Button disabled={!isValid || isSubmitting} type="submit">
         {
          isEdit ? "Actualizar" : "Agregar"
         }
        </Button>
      </div>
    </form>
  </Form>
  )
}
