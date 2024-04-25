import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NotAuthorized } from "@/components/not-authorized";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "LEADER") {
    return <NotAuthorized />;
  }

  return <>{children}</>;
}
