"use client";

import React, { useEffect, useState } from "react";

import { City, Company } from "@prisma/client";
import { cn } from "@/lib/utils";
import { DateFilter } from "@/components/date-filter";
import SelectCityFilter from "./select-city-filter";
import { useLoading } from "@/components/providers/loading-provider";
import { SelectCompanyFilter } from "./select-company-filter";
import { SelectLevelFilter } from "./select-level-filter";

export const HeaderDateFilter = ({
  cities,
  companies,
}: {
  cities: City[];
  companies: Company[];
}) => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(false);

  const { cityFilter, dateFilter, companyFilter, levelFilter } = useLoading();

  const handleScroll = () => {
    setPrevScrollPos(window.scrollY);
    setVisible(prevScrollPos > 100);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible, handleScroll]);
  return (
    <div
      className={cn(
        "-mt-2 w-full h-25 bg-primary flex flex-col md:flex-row rounded-md items-center justify-between gap-2 inset-x-0 p-2 duration-200 ease-out transition transform origin-top-right",
        visible &&
          "fixed mt-0 py-1 px-5 top-[60px] left-0 right-0 z-50 h-fit max-w-[1200px] mx-auto rounded-b-sm gap-1"
      )}
    >
      <h2 className=" text-3xl font-bold text-white self-center">Panel</h2>

      <div className="flex gap-2 items-center flex-col md:flex-row">
        <span className="text-white text-sm text-right mx-2 leading-3">
          {!!dateFilter || !!cityFilter || !!companyFilter || !!levelFilter ? "Filtrando por:" : <span></span>}
        </span>
        <SelectCityFilter cities={cities} />
        <SelectCompanyFilter companies={companies} />
        <SelectLevelFilter />
        <DateFilter />
      </div>
    </div>
  );
};
