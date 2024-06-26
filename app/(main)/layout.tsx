import { cn } from "@/lib/utils";
import { Navbar } from "./_components/navbar";
import { Roboto } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ScrollUp } from "@/components/scroll-up";
import { NotAuthorized } from "@/components/not-authorized";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import querystring from "querystring";
import { headers } from "next/headers";
import { Redirectt } from "./redirect";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  
  if (!session || !session.user?.role) {
    return <Redirectt />
  }

  const { user } = await session;

  let company;
  if (user.companyId) {
    company = await db.company.findUnique({
      where: {
        id: user.companyId,
      },
      select: {
        name: true,
      },
    });
  }

  return (
    <div>
      <main
        className={cn(
          "relative flex flex-col h-full min-h-screen m-0 p-0 mx-auto ",
          roboto.className
        )}
      >
        <Navbar
          company={company?.name}
          isMaster={user.isMaster || false}
          role={user.role || "USER"}
        />
        {/* <div className="mt-1 md:pl-[223px] min-h-screen xl:flex justify-center items-start xl:w-full relative"> */}
        <div className="mt-1 min-h-screen justify-center items-start xl:w-full relative">
          <div className=" min-h-full mt-[60px] max-w-[1200px] w-full mx-auto">
            {children}
          </div>
        </div>
        <ScrollUp />
        {/* <Footer /> */}
      </main>
    </div>
  );
}
