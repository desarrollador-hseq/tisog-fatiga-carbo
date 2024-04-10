"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  Building2,
  BookOpenText,
  ClipboardCheck,
  UsersRound,
  ScrollText,
  Home,
  Contact2,
  LucideIcon,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SidebarContent } from "./sidebar-content";



interface SidebarProps {
  openSidebar: boolean;
  isAdmin: boolean;
  setOpenSidebar: Dispatch<SetStateAction<boolean>>;
  routes: {icon: LucideIcon, label: string, href: string}[],
}

export const Sidebar = ({
  isAdmin,
  openSidebar,
  routes,
  setOpenSidebar,
}: SidebarProps) => {
  return (
    <>
      <div className="fixed right-0 top-[64px] ">
        <Sheet open={openSidebar} onOpenChange={setOpenSidebar}>
          <SheetContent side="right" className="p-0 w-56">
            <SidebarContent routes={routes} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
