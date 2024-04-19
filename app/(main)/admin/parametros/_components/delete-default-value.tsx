"use client"

import { ModalDeleteConfirm } from "@/components/modal-delete-confirm";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const DeleteDefaultParameter = ({
  parameterId,
  defaultValueId,
}: {
  parameterId?: string;
  defaultValueId: string;
}) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);

  const onConfirm = async () => {
    if(!parameterId) return
    setisLoading(true);
    try {
      await axios.delete(
        `/api/parameters/default-value/${parameterId}/${defaultValueId}`
      );
      toast.success("Item eliminado");
      router.refresh();
    } catch (error) {
      toast.error("ocurrió un error al momento de eliminar la ciudad");
    } finally {
      router.refresh();
      setisLoading(false);
    }
  };

  const title = (
    <p className="font-normal inline">
      la ciudad de nombre: <span className="font-bold ">{}</span>
    </p>
  );

  return (
    <div>
      <ModalDeleteConfirm onConfirm={onConfirm} title={title}>
        <Button
          disabled={isLoading}
          variant="destructive"
          className="bg-red-700"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </ModalDeleteConfirm>
    </div>
  );
};
