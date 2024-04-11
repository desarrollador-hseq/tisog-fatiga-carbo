import { DefaultValue } from "@prisma/client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { ToggleSelectItem } from "./toggle-select-item";

export const ListSymptoms = ({
  currentsSymptoms,
  setCurrentsSymptoms,
  defaultsSymptoms,
}: {
  currentsSymptoms: string[];
  defaultsSymptoms: DefaultValue[];
  setCurrentsSymptoms: Dispatch<SetStateAction<string[]>>;
}) => {
  // const handleDeleteItem = (del: string) => {
  //   setCurrentsSymptoms((prev) => prev.filter((item) => item !== del));
  // };
  return (
    <div className="flex gap-2 flex-wrap">
      {defaultsSymptoms.map((symptom, index) => (
        <ToggleSelectItem
          symptom={symptom}
          setCurrentsSymptoms={setCurrentsSymptoms}
          currentsSymptoms={currentsSymptoms}
        />
      ))}
    </div>
  );
};
