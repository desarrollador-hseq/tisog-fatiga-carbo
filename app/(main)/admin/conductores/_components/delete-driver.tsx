"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Driver } from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalDeleteConfirm } from "@/components/modal-delete-confirm";

interface DeleteDriverProps {
  driver: Driver;
}

export const DeleteDriver = ({ driver }: DeleteDriverProps) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);

  const onConfirm = async () => {
    setisLoading(true);
    try {
      await axios.delete(`/api/drivers/${driver.id}`);
      toast.success("Conductor eliminado");
      router.push("/admin/conductores/");
      router.refresh();
    } catch (error) {
      toast.error(
        "Ocurrió un error al momento de eliminar conductor"
      );
    } finally {
      router.refresh();
      setisLoading(false);
    }
  };

  const title = (
    <p className="font-normal inline">
      el conductor con número de documento:{" "}
      <span className="font-bold ">{driver?.numDoc}</span>
    </p>
  );

  return (
    <ModalDeleteConfirm onConfirm={onConfirm} title={title}>
      <Button disabled={isLoading} variant="destructive" className="bg-red-700">
        <Trash2 className="w-5 h-5" />
      </Button>
    </ModalDeleteConfirm>
  );
};
