"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CarFront, ClipboardCheck, Home, Menu, ScrollText, Settings, User, Users, UsersRound } from "lucide-react";
import { Role } from "@prisma/client";
import { Sidebar } from "./sidebar";
import { Button } from "@/components/ui/button";
import { LogoMain } from "@/components/logo-main";
import { cn } from "@/lib/utils";
import { ModalLogout } from "@/app/(auth)/_components/modal-logout";
import { useLoading } from "@/components/providers/loading-provider";

const dashRoutes = [
  { icon: Home, label: "Inicio", href: "/" },
  // {
  //   icon: ClipboardCheck,
  //   label: "reportes",
  //   href: "/reportes",
  // },
];

const leaderRoutes = [
  { icon: Home, label: "Inicio", href: "/" },
  {
    icon: ClipboardCheck,
    label: "Reportes",
    href: "/reportes",
  },
  {
    icon: UsersRound,
    label: "Supervisores",
    href: "/supervisores",
  },
  {
    icon: CarFront,
    label: "Conductores",
    href: "/conductores",
  },
];

const adminRoutes = [
  { icon: Home, label: "Inicio", href: "/" },
  // {
  //   icon: ClipboardCheck,
  //   label: "Ciudades",
  //   href: "/ciudades",
  // },

  {
    icon: CarFront,
    label: "Conductores",
    href: "/conductores",
  },
  {
    icon: Users,
    label: "Líderes",
    href: "/lideres",
  },
  {
    icon: ScrollText,
    label: "Reportes",
    href: "/reportes",
  },
  {
    icon: UsersRound,
    label: "Supervisores",
    href: "/supervisores",
  },

  // {
  //   icon: ScrollText,
  //   label: "Centros",
  //   href: "/centros",
  // },
];

export const Navbar = ({
  isMaster,
  role,
  company
}: {
  isMaster: boolean;
  company?: String;
  role: Role;
}) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  

  const { data: session } = useSession();

  const routes = useMemo(
    () =>
      role === "ADMIN"
        ? adminRoutes
        : role === "LEADER"
        ? leaderRoutes
        : dashRoutes,
    [role]
  );

  return (
    <div
      className={cn(
        `fixed top-0 z-50 p-1 min-h-[60px] max-h-[60px] text-white w-full bg-slate-200 shadow-sm flex items-center`
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
            <span className="hidden md:flex text-lg text-slate-600 font-semibold">
              Gestión de fatiga y sueño
            </span>
          </div>

          <div className="flex gap-5 items-center text-slate-500">
            {role === "ADMIN" ? (
              <span className="font-bold uppercase">Administrador</span>
            ) : role === "LEADER" ? (
              <span className="font-bold uppercase">Líder - {company}</span>
            ) : (
              <span className="font-bold uppercase">Supervisor - {company}</span>
            )}
          </div>

         

          <div className="flex gap-4 items-center">
            <div className="hidden lg:flex gap-3">
              {routes.map((route) => (
                <div key={route.href}>
                  <Link
                    className="text-slate-700"
                    href={`${
                      role === "ADMIN"
                        ? "/admin"
                        : role === "LEADER"
                        ? "/lider"
                        : "/dashboard"
                    }${route.href}`}
                  >
                    {route.label}
                  </Link>
                </div>
              ))}
              {/* <NavbarMenuItem></NavbarMenuItem> */}
            </div>
            {role === "ADMIN" && isMaster && (
              <Link
                href="/admin/parametros"
                className="ml-6 w-fit h-fit p-2  bg-inherit hover:bg-accent rounded-full flex items-center"
              >
                <Settings className="w-5 h-5" />
              </Link>
            )}
             <div className="flex gap-5 items-center text-slate-500">
            {role === "ADMIN" ? (
              <Link href={`/admin/perfil`}><User /></Link>
            ) : role === "LEADER" ? (
              <Link href={`/lider/perfil`}><User /></Link>
            ) : (
              <Link href={`/dashboard/perfil`}><User /></Link>
            )}
          </div>
            <ModalLogout />
          </div>
        </div>
      </div>
    </div>
  );
};
