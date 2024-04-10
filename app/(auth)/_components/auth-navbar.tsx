import { LogoMain } from "@/components/logo-main";
import { ModalLogout } from "./modal-logout";


export const AuthNavbar = () => {
  return (
    <div className="relative p-1 border-b h-[55px] max-h-[70px] w-full bg-slate-300 shadow-sm flex items-center">
      <div className="mx-auto w-full max-w-[1500px] mt-1">
        <div className="mx-3 flex items-center justify-between">
          <div className="p-2 flex gap-1 text-white">
            <LogoMain goRoot />
          </div>
         
        </div>
      </div>
    </div>
  );
};
