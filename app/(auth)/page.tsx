import { LogoMain } from "@/components/logo-main";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoginForm } from "./_components/login-form";

import React from "react";

const LoginPage = () => {
  return (
    <div className="bg-slate-50 h-screen">
      <div className="relative p-1 border-b h-[55px] max-h-[70px] w-full bg-slate-300 shadow-sm flex items-center">
        <div className="mx-auto w-full max-w-[1500px] mt-1">
          <div className="mx-3 flex items-center justify-between">
            <div className="p-2 flex gap-1">
              <LogoMain />
            </div>
          </div>
        </div>
      </div>
      <div className="container w-full flex flex-col items-center justify-start pt-14 h-fit">
        <div className="mb-4">{/* <TitleApp /> */}</div>

        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
