"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogisticsCenter } from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalDeleteConfirm } from "@/components/modal-delete-confirm";

interface DeleteCenterProps {
  center: LogisticsCenter;
}

export const DeleteCenter = ({ center }: DeleteCenterProps) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);

  const onConfirm = async () => {
    setisLoading(true);
    try {
      await axios.delete(`/api/centers/${center.id}`);
      toast.success("Centro logístio eliminado");
      router.push("/admin/centros/");
      // router.refresh()
    } catch (error) {
      toast.error(
        "ocurrió un error al momento de eliminar el centro logístico"
      );
    } finally {
      router.refresh();
      setisLoading(false);
    }
  };

  const title = (
    <p className="font-normal inline">
      el centro logístico de nombre:{" "}
      <span className="font-bold ">{center?.name}</span>
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
