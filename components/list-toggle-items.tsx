import { DefaultValue } from "@prisma/client";
import React, { Dispatch, SetStateAction } from "react";
import { ToggleSelectItem } from "@/components/toggle-select-item";
import { cn } from "@/lib/utils";

export const ListToggleItems = ({
  currents,
  setCurrents,
  defaults,
  disabled,
  isCheck
}: {
  currents: string[];
  defaults: DefaultValue[];
  setCurrents: Dispatch<SetStateAction<string[]>>;
  disabled?: boolean;
  isCheck?: boolean;
}) => {
  return (
    <div className={cn("flex gap-2 flex-wrap p-2" , isCheck && "flex-col")}>
      {defaults.map((symptom, index) => (
        <ToggleSelectItem
          key={symptom.id}
          symptom={symptom}
          setCurrentsSymptoms={setCurrents}
          currentsSymptoms={currents}
          disabled={disabled || false}
          isCheck={isCheck}
        />
      ))}
    </div>
  );
};
