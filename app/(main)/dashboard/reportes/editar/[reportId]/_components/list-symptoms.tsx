import { DefaultValue } from "@prisma/client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { ToggleSelectItem } from "./toggle-select-item";

export const ListSymptoms = ({
  currentsSymptoms,
  setCurrentsSymptoms,
  defaultsSymptoms,
  disabled
}: {
  currentsSymptoms: string[];
  defaultsSymptoms: DefaultValue[];
  setCurrentsSymptoms: Dispatch<SetStateAction<string[]>>;
  disabled: boolean
}) => {
  // const handleDeleteItem = (del: string) => {
  //   setCurrentsSymptoms((prev) => prev.filter((item) => item !== del));
  // };
  return (
    <div className="flex gap-2 flex-wrap">
      {defaultsSymptoms.map((symptom, index) => (
        <ToggleSelectItem
          key={symptom.id}
          symptom={symptom}
          setCurrentsSymptoms={setCurrentsSymptoms}
          currentsSymptoms={currentsSymptoms}
          disabled={disabled}
        />
      ))}
    </div>
  );
};
