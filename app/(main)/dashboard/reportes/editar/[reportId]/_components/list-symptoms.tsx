import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

export const ListSymptoms = ({
  currentsItems,
  setCurrentsItems
}: {
  currentsItems: string[];
  setCurrentsItems: Dispatch<SetStateAction<string[]>>;
}) => {
  const handleDeleteItem = (del: string) => {
    setCurrentsItems((prev) => prev.filter((item) => item !== del));
  };
  return (
    <div className="flex gap-2">
      {currentsItems.map((item, index) => (
        <div
          className=" w-fit bg-slate-100 border border-slate-300 p-1 rounded-sm flex gap-3 items-center"
          key={index}
        >
          {item}
          <Button
            type="button"
            onClick={() => handleDeleteItem(item)}
            className="p-1 rounded-sm bg-red-500 hover:bg-red-700 w-5 h-5 flex items-center justify-center"
          >
            <X className="w-6 h-6 text-white" />
          </Button>
        </div>
      ))}
    </div>
  );
};
