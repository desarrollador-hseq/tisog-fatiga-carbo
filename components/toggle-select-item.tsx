"use client";

import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { DefaultValue } from "@prisma/client";
import { Bold, Square, SquareAsterisk, SquareDot } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";

export const ToggleSelectItem = ({
  symptom,
  setCurrentsSymptoms,
  currentsSymptoms,
  disabled,
  isCheck,
}: {
  symptom: DefaultValue;
  setCurrentsSymptoms: Dispatch<SetStateAction<string[]>>;
  currentsSymptoms: string[];
  disabled?: boolean;
  isCheck?: boolean;
}) => {
  const isSelected = currentsSymptoms.includes(symptom.id);

  const handleToggle = () => {
    if (isSelected) {
      setCurrentsSymptoms((prev) => prev.filter((item) => item !== symptom.id));
    } else {
      setCurrentsSymptoms((prev) => [...prev, symptom.id]);
    }
  };

  return (
    <div className={cn("flex items-center")}>
      {isCheck && (
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleToggle}
          id="isCheck"
          disabled={disabled}
        />
      )}
      <Toggle
        pressed={isSelected}
        onPressedChange={handleToggle}
        aria-label="Toggle select item"
        disabled={disabled}
        className={cn(
          "border-2 border-slate-400 text-slate-600 text-left ",
          isSelected &&
            "data-[state=on]:bg-secondary/80 data-[state=on]:text-secondary-foreground data-[state=on]:border-primary data-[state=on]:font-semibold",
          isCheck &&
            "text-base border-none data-[state=on]:text-slate-600 data-[state=on]:border-none data-[state=on]:bg-inherit hover:bg-inherit"
        )}
      >
        <span className="leading-4 flex gap-1 items-center relative pl-3">
          {!isCheck && (
            <span className="absolute -left-2 top-0 bottom-0">
              {" "}
              {!isSelected ? (
                <Square className="w-4 h-4" />
              ) : (
                <SquareAsterisk className="w-4 h-4" />
              )}
            </span>
          )}
          {symptom.name}
        </span>
      </Toggle>
    </div>
  );
};
