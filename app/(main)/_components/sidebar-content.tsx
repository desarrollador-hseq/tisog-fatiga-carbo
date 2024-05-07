import { LucideIcon } from "lucide-react";
import { SidebarItems } from "./sidebar-items";
import { useLoading } from "@/components/providers/loading-provider";

interface SidebarContentProps {
  routes: { href: string; icon: LucideIcon; label: string }[];
}

export const SidebarContent = ({ routes }: SidebarContentProps) => {
  const { userRole } = useLoading();

  return (
    <div className="h-full w-full  flex flex-col overflow-y-auto bg-white ">
      <div className="flex flex-col w-full h-full max-h-[calc(100vh-60px)] md:max-h-[calc(100vh-140px)]">
        <div className="md:hidden flex justify-start items-center pl-7 h-14">
          {/* <LogoMain /> */}
        </div>
        {routes.map((route) => (
          <SidebarItems
            key={route.href}
            href={`${
              userRole === "ADMIN"
                ? "/admin"
                : userRole === "LEADER"
                ? "/lider"
                : "/dashboard"
            }${route.href}`}
            icon={route.icon}
            label={route.label}
          />
        ))}
      </div>
      {/* <div className="w-full flex justify-center">
        <LogoMain />
      </div> */}
    </div>
  );
};
