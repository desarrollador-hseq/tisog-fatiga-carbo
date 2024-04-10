import AutocompleteInput from "@/components/autocomplete-input";
import { SimpleModal } from "@/components/simple-modal";
import { Button } from "@/components/ui/button";
import { DefaultValue } from "@prisma/client";
import { X } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import { ListSymptoms } from "./list-symptoms";

interface ModalAddSymptomsProps {
  defaultsSymptoms: DefaultValue[];
  inputSymptomsValue: string;
  setInputSymptomsValue: Dispatch<SetStateAction<string>>;
  currentsItems: string[];
  setCurrentsItems: Dispatch<SetStateAction<string[]>>;
}

export const ModalAddSymptoms = ({
  defaultsSymptoms,
  inputSymptomsValue,
  setInputSymptomsValue,
  currentsItems,
  setCurrentsItems
}: ModalAddSymptomsProps) => {
  const handleAddItem = (item: string) => {
    setCurrentsItems([...currentsItems, item]);
    setInputSymptomsValue("");
  };

  return (
    <SimpleModal
      large={false}
      title="Agregar sintomas"
      textBtn="Agregar"
      btnClass="w-fit"
    >
      <div className="flex gap-2 mb-5">
        <AutocompleteInput
          options={defaultsSymptoms.map((symptom) => symptom.name)}
          inputValue={inputSymptomsValue}
          setInputValue={setInputSymptomsValue}
        />
        <Button type="button" onClick={() => handleAddItem(inputSymptomsValue)}>
          Agregar
        </Button>
      </div>
        <ListSymptoms
         currentsItems={currentsItems}
         setCurrentsItems={setCurrentsItems}
        />
     
    </SimpleModal>
  );
};
