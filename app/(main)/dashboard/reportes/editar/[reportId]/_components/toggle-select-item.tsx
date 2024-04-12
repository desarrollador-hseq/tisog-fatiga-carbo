"use client";

import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { DefaultValue } from "@prisma/client";
import { Bold } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

export const ToggleSelectItem = ({
  symptom,
  setCurrentsSymptoms,
  currentsSymptoms,
  disabled
}: {
  symptom: DefaultValue;
  setCurrentsSymptoms: Dispatch<SetStateAction<string[]>>;
  currentsSymptoms: string[];
  disabled: boolean
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
    <Toggle
      pressed={isSelected}
      onPressedChange={handleToggle}
      aria-label="Toggle symptom"
      disabled={disabled}
      className={cn(
        "border-2 border-slate-700",
        isSelected &&
          "data-[state=on]:bg-secondary/80 data-[state=on]:text-secondary-foreground data-[state=on]:border-secondary"
      )}
    >
      {symptom.name}
    </Toggle>
  );
};
