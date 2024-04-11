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
}: {
  symptom: DefaultValue;
  setCurrentsSymptoms: Dispatch<SetStateAction<string[]>>;
  currentsSymptoms: string[];
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
      className={cn(
        isSelected &&
          "data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground"
      )}
    >
      {symptom.name}
    </Toggle>
  );
};
