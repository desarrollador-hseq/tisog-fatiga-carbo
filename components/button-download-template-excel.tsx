"use client"

import React from "react";
import { Button } from "./ui/button";
import { FileDown, Info } from "lucide-react";
import { TooltipInfo } from "./tooltip-info";

export const ButtonDownloadTemplateExcel = ({name}:{name: string}) => {
  const handleDownloadTemplate = () => {

    // todo: crear plantilla

    const templateUrl = `/${name}.xlsx`;
   
    const link = document.createElement("a");
    link.href = templateUrl;
    link.download =  `${name}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center gap-2 ">
      <Button onClick={handleDownloadTemplate} className="gap-2  py-7 px-6">
        <FileDown />
        Descargar plantilla de excel
      </Button>
      <TooltipInfo text="Se debe descargar y llenar esta plantilla para cargar los colaboradores de la empresa">
        <Info className="text-white w-6 h-6" />
      </TooltipInfo>
    </div>
  );
};
