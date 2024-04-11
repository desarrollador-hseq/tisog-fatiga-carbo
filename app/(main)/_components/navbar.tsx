"use client";
import { useMemo, useState } from "react";
import { ClipboardCheck, Home, Menu, ScrollText } from "lucide-react";
import { Sidebar } from "./sidebar";
import { Button } from "@/components/ui/button";
import { LogoMain } from "@/components/logo-main";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ModalLogout } from "@/app/(auth)/_components/modal-logout";

const dashRoutes = [
  { icon: Home, label: "Inicio", href: "/" },
  {
    icon: ClipboardCheck,
    label: "reportes",
    href: "/reportes",
  },
  {
    icon: ScrollText,
    label: "conductores",
    href: "/conductores",
  },
];
const adminRoutes = [
  { icon: Home, label: "Inicio", href: "/" },
  {
    icon: ClipboardCheck,
    label: "Ciudades",
    href: "/ciudades",
  },
  {
    icon: ClipboardCheck,
    label: "empresas",
    href: "/empresas",
  },
  {
    icon: ScrollText,
    label: "reportes",
    href: "/reportes",
  },
  {
    icon: ScrollText,
    label: "conduuctores",
    href: "/conduuctores",
  },
  {
    icon: ScrollText,
    label: "supervisores",
    href: "/supervisores",
  },
];

export const Navbar = ({ isAdmin }: { isAdmin: boolean }) => {
  const [openSidebar, setOpenSidebar] = useState(false);

  const routes = useMemo(() => (isAdmin ? adminRoutes : dashRoutes), [isAdmin]);

  return (
    <div
      className={cn(
        `fixed top-0 z-50 p-1 min-h-[60px] max-h-[60px] text-white w-full bg-slate-200 shadow-sm flex items-center`,
        isAdmin && "bg-slate-400"
      )}
    >
      <div className="mx-auto w-full mt-1">
        <div className="mx-3 flex items-center justify-between">
          <div className="p-2 flex gap-1 relative items-center">
            <Button
              className="md:hidden"
              variant="ghost"
              onClick={() => setOpenSidebar(!openSidebar)}
            >
              <Menu />
            </Button>

            <Sidebar
              isAdmin={isAdmin}
              openSidebar={openSidebar}
              setOpenSidebar={setOpenSidebar}
              routes={routes}
            />

            <LogoMain goRoot />
            <span className="text-lg text-slate-600 font-semibold">
              Fatiga y sueño
            </span>
          </div>

          <div className="flex gap-5 items-center">
            {isAdmin && <span>Administrador</span>}
          </div>

          <div className="flex gap-4 items-center">
            <div className="hidden lg:flex gap-3">
              {routes.map((route) => (
                <div key={route.href}>
                  <Link
                  className="text-slate-700" 
                    href={`${isAdmin ? "/admin" : "/dashboard"}/${route.href}`}
                  >
                    {route.label}
                  </Link>
                </div>
              ))}
            </div>

            <ModalLogout />
          </div>
        </div>
      </div>
    </div>
  );
};
