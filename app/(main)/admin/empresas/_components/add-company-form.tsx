"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { City, Company } from "@prisma/client";
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
  company?: Company | null;
  cities: City[] | null;
}

const MAX_FILE_SIZE = 1024 * 1024 * 1;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Razón social es requerida",
  }),
  nit: z.string().min(1, {
    message: "NIT requerido",
  }),
  cityId: z.string().min(1, {
    message: "Número de documento requerido",
  }),
  logoImgUrl: z.string().optional(),
  file: z
    .any()
    .optional()
    .or(z.string().optional())
    .refine((file) => file?.length !== 0, "File is required")
    .refine((files) => {
      return files?.size <= MAX_FILE_SIZE;
    }, `El tamaño maximo del archivo es de 1MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.type),
      "Solo los formtatos de .jpg, .jpeg, .png, y .pdf son aceptados"
    )
    .optional(),
});

export const AddCompanyForm = ({ company, cities }: AddCompanyFormProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();
  const [imageUploadedUrl, setImageUploadedUrl] = useState();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const isEdit = useMemo(() => !!company, [company]);

  if (isEdit && !company) {
    toast.error("Ciudad no encontrada, redirigiendo...");
    router.replace("/admin/ciudades/");
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
      // Handle file upload logic here
    },
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".svg"],
    },
    // disabled: !canManagePermissions,
  });

  useEffect(() => {
    if (selectedFile) {
      setValue("file", selectedFile, { shouldValidate: true });
    }
  }, [selectedFile]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: company?.name || "",
      nit: company?.nit || "",
      cityId: company?.cityId || "",
      logoImgUrl: company?.logoImgUrl || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const { setValue, setError, getValues } = form;



  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let urlImage: string | null;
    if (values.file) {
      const formData = new FormData();
      formData.append("file", values.file);
      formData.append("ubiPath", "empresas/logo");

      try {
        const { data } = await axios.post(`/api/upload/file`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        urlImage = data.url;
      } catch (error) {
        setLoadingApp(false);
        return toast.error("Ocurrió un error al subir el archivo");
      }
    } else {
      urlImage = getValues("logoImgUrl") || null;
      if (!urlImage) {
        urlImage = null;
      }
    }

    if (!urlImage) {
      setLoadingApp(false);
      return toast.error("Sin imagen");
    }
    const { file, ...otherValues } = values;
    try {
      if (isEdit) {
        await axios.patch(`/api/companies/${company?.id}`, {
          ...otherValues,
          logoImgUrl: urlImage,
        });
        toast.success("Empresa actualizada");
      } else {
        const { data } = await axios.post(`/api/companies/`, {
          ...otherValues,
          imgSignatureUrl: urlImage,
        });
        router.push(`/admin/empresas/`);
        toast.success("Empresa agregada");
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
            errorMessage.includes("NIT ya registrado")
          ) {
            setError("nit", {
              type: "manual",
              message: "NIT ya registrado",
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
            label="Razón social"
            name="name"
            className="w-full"
          />
          <InputForm
            control={form.control}
            label="NIT"
            name="nit"
            className="w-full"
          />
          <div className="flex flex-col w-full gap-3">
            <FormLabel className="font-semibold text-primary ">
              Logo:
            </FormLabel>
            <div
              {...getRootProps()}
              className={"dropzone w-full"}
              style={{
                background: "#4e71b185",
                borderRadius: "7px",
                border: !selectedFile ? "3px dashed #4e71b1" : "none",
                color: "white",
                padding: "8px",
              }}
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center w-full"
                )}
              >
                {selectedFile ? (
                  <div className="flex w-full bg-secondary items-center justify-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200 p-4">
                    <div className="px-3 py-2 h-full flex flex-col items-center">
                      {/* <ImageIcon className="h-6 w-6 text-white" /> */}
                      <Image
                        src={URL.createObjectURL(selectedFile)}
                        alt=""
                        width={100}
                        height={100}
                      />
                      <span className="text-xs font-semibold text-slate-300 italic">
                        {" "}
                        Tipo: {selectedFile.type.split("/").pop()}
                      </span>
                    </div>
                    <p className="px-3 py-2 h-full text-sm truncate text-white font-semibold  text-ellipsis">
                      {selectedFile.name}
                    </p>
                  </div>
                ) : !selectedFile && company && company.logoImgUrl ? (
                  <div className="flex gap-3 items-center">
                    <Image
                      src={company.logoImgUrl}
                      alt="logo de la empresa"
                      width={100}
                      height={100}
                      style={{
                        width: "auto",
                        height: "auto",
                      }}
                      priority
                    />
                    <div className="flex flex-col items-center">
                      <p className="mb-2 text-sm text-white">
                        <span className="font-semibold text-base">
                          Click para cambiar
                        </span>{" "}
                        o arrastra la imagen aquí
                      </p>
                      <p className="text-sm text-zinc-200">
                        Formatos aceptados: jpg, jpeg y png
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Cloud className="h-10 w-10 text-white mb-2" />
                    <p className="mb-2 text-sm text-white">
                      <span className="font-semibold text-base">
                        Click para subir
                      </span>{" "}
                      o arrastra el archivo aquí
                    </p>
                    <p className="text-sm text-zinc-200">
                      Formatos aceptados: jpg, jpeg y png
                    </p>
                  </div>
                )}
              </div>
              <input
                {...getInputProps()}
                // disabled={!canManagePermissions}
              />
              {!selectedFile && isDragActive && (
                <p>Haga clic o arrastre un archivo para cargarlo</p>
              )}
            </div>
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
                      <CommandInput placeholder="Buscar Ciudad" />
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
