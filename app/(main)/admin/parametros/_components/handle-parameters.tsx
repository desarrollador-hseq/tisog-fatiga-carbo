"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useLoading } from "@/components/providers/loading-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Parameter } from "@prisma/client";
import { ModalDeleteConfirm } from "@/components/modal-delete-confirm";
import { AddParametersForm } from "./add-parameters-form";
import { SimpleModal } from "@/components/simple-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FieldUpdateFormProps {
  disabled?: boolean;
  parameters: Parameter[];
}

export const HandleParameters = ({
  disabled,
  parameters,
}: FieldUpdateFormProps) => {
  const router = useRouter();
  const { setLoadingApp, loadingApp } = useLoading();

  const onConfirmDelete = async (parameterId: string) => {
    if (disabled) return;
    setLoadingApp(true);
    try {
      await axios.delete(`/api/parameters/${parameterId}`);
      toast.success("Item eliminado");
      router.refresh();
    } catch (error) {
      toast.error("ocurrió un error al momento de eliminar la ciudad");
    } finally {
      router.refresh();
      setLoadingApp(false);
    }
  };

  return (
    <div>
      <Card
        className={`mt-1 border ${
          disabled ? "bg-slate-50" : "bg-blue-50"
        } p-1  relative`}
      >
        <CardHeader className="p-1"></CardHeader>
        <CardContent className="p-1">
          {!disabled && <AddParametersForm />}
        </CardContent>
      </Card>
      <div className="h- flex justify-between items-center bg-slate-300 px-4">
        <Table className="m-5">
          <TableHeader>
            <TableRow>
              <TableHead>parametro</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parameters.map((par) => (
              <TableRow key={par.id}>
                <TableCell>{par.name}</TableCell>
                <TableCell>{par.desc}</TableCell>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <SimpleModal
                      title="Editar parametro"
                      large={false}
                      textBtn={<Edit className="w-5 h-5" />}
                    >
                      <AddParametersForm parameter={par} />
                    </SimpleModal>
                    <ModalDeleteConfirm
                      onConfirm={() => onConfirmDelete(par.id)}
                      title={par.desc || ""}
                    >
                      <Button
                        disabled={loadingApp}
                        variant="destructive"
                        className="bg-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </ModalDeleteConfirm>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
