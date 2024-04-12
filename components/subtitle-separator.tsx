import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

export const SubtitleSeparator = ({
  text,
  className,
  children,
  sub,
}: {
  children?: ReactNode;
  text: string;
  className?: string;
  sub?: string;
}) => {
  return (
    <div
      className={cn(
        "w-full h-12 bg-primary text-white flex items-center justify-between pl-3 p-2",
        className,
        children && "px-3"
      )}
    >
      <div className="flex flex-col p-2">
        <h4 className="text-lg font-medium uppercase">{text}</h4>
        <p className="font-normal text-slate-300 text-base">{sub}</p>
      </div>
      <div>{children}</div>
    </div>
  );
};
