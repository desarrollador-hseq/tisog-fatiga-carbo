"use client";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ClipboardCheck, Home, Menu, ScrollText, Settings } from "lucide-react";
import { Sidebar } from "./sidebar";
import { Button } from "@/components/ui/button";
import { LogoMain } from "@/components/logo-main";
import { cn } from "@/lib/utils";
import { ModalLogout } from "@/app/(auth)/_components/modal-logout";
import { useLoading } from "@/components/providers/loading-provider";


const dashRoutes = [
  { icon: Home, label: "Inicio", href: "/" },
  {
    icon: ClipboardCheck,
    label: "reportes",
    href: "/reportes",
  },
];

const leaderRoutes = [
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
    label: "conductores",
    href: "/conductores",
  },
  {
    icon: ScrollText,
    label: "supervisores",
    href: "/supervisores",
  },
];

export const Navbar = ({
  isLeader,
}: {
  isLeader: boolean;
}) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const { userRole } = useLoading();

  const { data: session } = useSession();

  const routes = useMemo(
    () =>
      userRole === "ADMIN"
        ? adminRoutes
        : userRole === "LEADER"
        ? leaderRoutes
        : dashRoutes,
    [userRole]
  );

  return (
    <div
      className={cn(
        `fixed top-0 z-50 p-1 min-h-[60px] max-h-[60px] text-white w-full bg-slate-200 shadow-sm flex items-center`,
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
            {userRole === "ADMIN" ? (
              <span className="font-bold uppercase">Administrador</span>
            ) : userRole === "LEADER" ? (
              <span className="font-bold uppercase">Lider</span>
            ) : (
              <span className="font-bold uppercase">Supervisor</span>
            )}
          </div>

          <div className="flex gap-4 items-center">
            <div className="hidden lg:flex gap-3">
              {routes.map((route) => (
                <div key={route.href}>
                  <Link
                    className="text-slate-700"
                    href={`${userRole === "ADMIN" ? "/admin" : userRole === "LEADER" ? "/lider" : "/dashboard"}${route.href}`}
                  >
                    {route.label}
                  </Link>
                </div>
              ))}
              {/* <NavbarMenuItem></NavbarMenuItem> */}
            </div>
            <Link href="/admin/parametros" className="ml-6 w-fit h-fit p-2  bg-inherit hover:bg-accent rounded-full flex items-center">
              <Settings className="w-5 h-5" /> 
            </Link>
            <ModalLogout />
          </div>
        </div>
      </div>
    </div>
  );
};
