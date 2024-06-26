"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export const SidebarItems = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = useMemo(
    () =>
      pathname === href ||
      (href !== "/dashboard" &&
        pathname?.startsWith(`${href}/`) &&
        href !== "/admin" &&
        pathname?.startsWith(`${href}/`) &&
        href !== "/lider" &&
        pathname?.startsWith(`${href}/`)),
    [pathname, href]
  );

  const onClick = () => {
    router.push(href);
  };


  return (
    <div>
      <button
        onClick={onClick}
        type="button"
        className={cn(
          "w-full h-full flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
          isActive &&
            "text-blue-950 bg-sky-200/20 hover:bg-sky-200/20 hover:text-blue-950"
        )}
      >
        <div className="flex items-center gap-x-2 py-4">
          <Icon
            size={22}
            className={cn("text-slate-500", isActive && "text-primary")}
          />

          <span
            className={cn(
              "text-slate-500",
              isActive && "text-primary font-semibold"
            )}
          >
            {label}
          </span>
        </div>
        <div
          className={cn(
            "ml-auto opacity-0 border-2 border-secondary h-full transition-all animate-in",
            isActive && "opacity-100"
          )}
        />
      </button>
    </div>
  );
};
