"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLoading } from "@/components/providers/loading-provider";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { cn } from "@/lib/utils";

const formSchema = z.object({
  level: z.enum(["LOW", "MEDIUM", "HIGH"]).optional().nullable(),
});

export const SelectLevelFilter = () => {
  const { setLevelFilter, levelFilter } = useLoading();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: levelFilter || undefined,
    },
  });
  const { watch, setValue } = form;

  const handleClearInput = () => {
    setValue("level", null, { shouldValidate: true });
  };

  useEffect(() => {
    setLevelFilter(watch("level") !== null ? watch("level") : undefined);
  }, [watch("level")]);

  return (
    <Form {...form}>
      <form className="max-w-[200px] w-full mx-auto relative">
        <Button
          onClick={handleClearInput}
          variant="default"
          type="button"
          className={cn(
            `absolute top-3 right-1 w-4 h-4 p-0 rounded-sm bg-red-700 hover:bg-red-800`,
            !!!levelFilter && "hidden"
          )}
        >
          <X className="w-3 h-3" />
        </Button>
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <Select onValueChange={field.onChange} value={field.value!}>
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      "justify-between font-bold text-base pr-7 w-[180px]",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <SelectValue placeholder="Nivel" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="pr-3">
                  <SelectGroup>
                    <SelectItem value="LOW">Bajo</SelectItem>
                    <SelectItem value="MEDIUM">Medio</SelectItem>
                    <SelectItem value="HIGH">Alto</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
