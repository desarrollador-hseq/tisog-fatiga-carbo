import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";

import { authOptions } from "@/lib/authOptions";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (session) {
    if (session.user.role === "ADMIN") {
      redirect("/admin/");
    } else if (session.user.role === "LEADER") {
      redirect("/lider/");
    } else if (session.user.role === "USER") {
      redirect("/dashboard/");
    } else {
      signOut();
    }
  }
  return (
    <div className="w-full">
      {/* <AuthNavbar /> */}

      <div className=" w-full">{children}</div>
    </div>
  );
};

export default AuthLayout;
