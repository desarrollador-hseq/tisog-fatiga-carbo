import { cn } from "@/lib/utils";
import { Navbar } from "./_components/navbar";
import { Roboto } from "next/font/google";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ScrollUp } from "@/components/scroll-up";

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
    //   redirect("/");
  }

  return (
    <div>
      <main
        className={cn(
          "relative flex flex-col h-full min-h-screen m-0 p-0 mx-auto ",
          roboto.className
        )}
      >
        <Navbar isAdmin={session?.user.role === "ADMIN" || false} />
        {/* <div className="mt-1 md:pl-[223px] min-h-screen xl:flex justify-center items-start xl:w-full relative"> */}
        <div className="mt-1 min-h-screen justify-center items-start xl:w-full relative bg-transparent">
          <div className="min-h-full mt-[60px] max-w-[1200px] w-full mx-auto">
            {children}
          </div>
        </div>
        <ScrollUp />
        {/* <Footer /> */}
      </main>
    </div>
  );
}
