

import React, { ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { cn } from "@/lib/utils";

interface CardPageProps {
  pageHeader?: string | ReactNode;
  className?: string ;
  children: ReactNode;
  pageFooter?: string | ReactNode;
}

export const CardPage = ({
  pageHeader,
  children,
  pageFooter,
  className
}: CardPageProps) => {
  return (
    <Card className={cn("w-full h-full rounded-none min-h-[calc(100vh-62px)] overflow-hidden min-w-full max-w-max", className)}>
      <CardHeader>{pageHeader}</CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>{pageFooter}</CardFooter>
    </Card>
  );
};
